import { Module, Global, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookRequestEntity } from './entities/webhook-request.entity';
import { WebhookEntity } from './entities/webhook.entity';
import { WEBHOOK_EVENTS, WEBHOOK_HTTP_RETRY } from './webhook.config';
import { WebhookController } from './webhook.controller';
import { WebhookEventModel, WebhookHttpConfigModel } from './webhook.interface';
import { WebhookService } from './webhook.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  controllers: [WebhookController]
})
export class WebhookModule {
  static register(
    event: WebhookEventModel,
    httpConfig?: WebhookHttpConfigModel,
    httpRetry?: number
  ): DynamicModule {
    return {
      module: WebhookModule,
      imports: [
        HttpModule.register({
          timeout: 5000,
          maxRedirects: 5,
          ...httpConfig,
        }),
        TypeOrmModule.forFeature([WebhookEntity, WebhookRequestEntity]),
      ],
      providers: [
        {
          provide: WEBHOOK_EVENTS,
          useValue: event,
        },
        {
          provide: WEBHOOK_HTTP_RETRY,
          useValue: httpRetry ?? 5,
        },
        WebhookService
      ],
      exports: [WebhookService],
    };
  }
}
