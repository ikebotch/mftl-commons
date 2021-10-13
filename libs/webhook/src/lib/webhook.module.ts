import { Module, Global, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookRequestEntity } from './entities/webhook-request.entity';
import { WebhookEntity } from './entities/webhook.entity';
import { WEBHOOK_EVENTS } from './webhook.config';
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
    httpConfig: WebhookHttpConfigModel
  ): DynamicModule {
    return {
      module: WebhookModule,
      imports: [
        HttpModule.register({
          ...httpConfig,
        }),
        TypeOrmModule.forFeature([WebhookEntity, WebhookRequestEntity]),
      ],
      providers: [
        {
          provide: WEBHOOK_EVENTS,
          useValue: event,
        },
        WebhookService
      ],
      exports: [WebhookService],
    };
  }
}
