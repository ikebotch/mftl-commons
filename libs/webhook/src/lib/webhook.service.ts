import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from '@nestjs/axios/node_modules/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { lastValueFrom, map, retry } from 'rxjs';
import { Repository } from 'typeorm';
import { WebhookRequestEntity } from './entities/webhook-request.entity';
import { WebhookEntity } from './entities/webhook.entity';
import { WEBHOOK_EVENTS, WEBHOOK_HTTP_RETRY } from './webhook.config';
import { CreateWebhookDto, UpdateWebhookDto } from './webhook.dto';
import { WebhookEventModel } from './webhook.interface';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger('MFTL Webhook');
  constructor(
    @InjectRepository(WebhookEntity)
    private webhookRepository: Repository<WebhookEntity>,
    @InjectRepository(WebhookRequestEntity)
    private webhookRequestRepository: Repository<WebhookRequestEntity>,
    private httpService: HttpService,
    @Inject(WEBHOOK_EVENTS) private webHookEventSrv: WebhookEventModel,
    @Inject(WEBHOOK_HTTP_RETRY) private webhookHttpRetry: number
  ) {}

  // Crud functions
  // ==============

  getEvents() {
    return this.webHookEventSrv || {};
  }

  async create(body: CreateWebhookDto) {
    // create new webhook instance
    const newInstance = this.webhookRepository.create({ ...body });

    return await this.webhookRepository.save(newInstance);
  }

  async update(id: string, body: UpdateWebhookDto) {
    // update
    return await this.webhookRepository.update(id, { ...body });
  }

  async findById(id: string) {
    return await this.webhookRepository.findOne(id);
  }

  async find(pagination: IPaginationOptions, query?: any) {
    return await paginate(this.webhookRepository, pagination, {
      where: { ...query },
    });
  }

  async delete(id: string) {
    // delete
    await this.webhookRepository.softDelete(id);

    // return
    return `Webhook with id ${id} has been successfully deleted`;
  }

  // Webhook functions
  // ==================

  async fetchRequests(pagination: IPaginationOptions, query?: any) {
    return await paginate(this.webhookRequestRepository, pagination, {
      where: { ...query },
    });
  }

  async dispatch(
    event: string,
    data: any,
    methodName: 'post' | 'put' = 'post',
    id?: string,
    config?: AxiosRequestConfig,
    httpRetry?: number
  ) {
    // get all subscriptions to this event
    this.logger.log(JSON.stringify(data), event);
    const subscriptions = await this.webhookRepository.find({
      where: { event },
    });

    for await (const subscription of subscriptions) {
      const webhookReq = this.webhookRequestRepository.create();
      try {
        const idParam = id?.trim() ? '/' + id.trim() : '';
        const res = await lastValueFrom(
          this.httpService[methodName](
            `${subscription.registeredUrl}${idParam}`,
            data,
            config
          ).pipe(map((x) => x.data))
          // .pipe(map((x) => x.data), retry(httpRetry ?? this.webhookHttpRetry))
        );

        this.logger.log('SUCCESS RES: =>' + JSON.stringify(res?.data || {}))

        Object.assign(webhookReq, {
          registeredUrl: subscription.registeredUrl,
          body: JSON.stringify(res),
          event: event,
        });
      } catch (error: any) {
        this.logger.log('ERROR RES: =>' + error?.message)
        this.logger.error(error, error?.stack || error?.message, event);
        Object.assign(webhookReq, {
          registeredUrl: subscription.registeredUrl,
          body: JSON.stringify(error),
          event,
        });
      } finally {
        this.logger.log('FINALIZE ENTRY: =>' + webhookReq.registeredUrl)
        await this.webhookRequestRepository.save(webhookReq);
      }
    }
  }
}
