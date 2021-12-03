import { HttpModule } from '@nestjs/axios';
import {
  DynamicModule,
  Global,
  Logger,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import {
  PAYSTACK_CONFIG_MODULE_OPTIONS,
  PAYSTACK_WEBHOOK_HANDLER,
  PAYSTACK_WEBHOOK_SERVICE,
} from './paystack.config';
import { PaystackService } from './paystack.service';
import { PaystackController } from './paystack.controller';
import { PaystackWebhookEventService } from './paystack-webhook-event.service';
import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';
import { flatten, groupBy } from 'lodash';
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';
import { PaystackInterface } from './paystack.interface';

@Global()
@Module({
  controllers: [PaystackController],
})
export class PaystackModule implements OnModuleInit {
  private readonly logger = new Logger(PaystackModule.name);
  constructor(
    private paystackSrv: PaystackService,
    private readonly discover: DiscoveryService,
    private readonly externalContextCreator: ExternalContextCreator,
  ) {}

  static forRoot(
    payStackConfig: PaystackInterface.ConfigModuleOptions,
  ): DynamicModule {
    const { httpConfig, secretkey, url } = payStackConfig;
    return {
      module: PaystackModule,
      imports: [
        DiscoveryModule,
        HttpModule.register({
          timeout: httpConfig?.timeout ?? 5000,
          maxRedirects: httpConfig?.maxRedirects ?? 3,
          headers: {
            Authorization: `Bearer ${secretkey}`,
            'Content-Type': 'application/json',
          },
          baseURL: url,
        }),
      ],
      providers: [
        PaystackService,
        {
          provide: PAYSTACK_CONFIG_MODULE_OPTIONS,
          useValue: {
            ...payStackConfig,
            useWebhook: payStackConfig?.useWebhook ?? false,
          },
        },
        PaystackWebhookEventService,
      ],
      exports: [PaystackService, PaystackWebhookEventService],
    };
  }

  public async onModuleInit() {
    const { useWebhook, secretkey } = this.paystackSrv.config;

    if (!useWebhook) {
      return;
    }
    if (!secretkey) {
      const errorMessage =
        'missing paystack webhook secret. module is improperly configured and will be unable to process incoming webhooks from Paystack';
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }
    this.logger.log('Initializing PayStack Module for webhooks');

    const [paystackWebhookService] = (
      (await this.discover.providersWithMetaAtKey<boolean>(
        PAYSTACK_WEBHOOK_SERVICE,
      )) || []
    ).map((x) => x.discoveredClass.instance);
    if (
      !paystackWebhookService ||
      !(paystackWebhookService instanceof PaystackWebhookEventService)
    ) {
      throw new Error('Could not find instance of Paystack Webhook Service');
    }
    const eventHandlerMeta =
      await this.discover.providerMethodsWithMetaAtKey<string>(
        PAYSTACK_WEBHOOK_HANDLER,
      );

    const grouped = groupBy(
      eventHandlerMeta,
      (x) => x.discoveredMethod.parentClass.name,
    );

    const webhookHandlers = flatten(
      Object.keys(grouped).map((x) => {
        this.logger.log(`Registering Paystack webhook handlers from ${x}`);
        return grouped[x].map(({ discoveredMethod, meta: eventType }) => ({
          key: eventType,
          handler: this.externalContextCreator.create(
            discoveredMethod.parentClass.instance,
            discoveredMethod.handler,
            discoveredMethod.methodName,
          ),
        }));
      }),
    );

    const handleWebhook = async (webhookEvent: { event: string }) => {
      const { event } = webhookEvent;
      // console.log('webhookEvent =>>>>>>', webhookEvent);
      const handlers = webhookHandlers.filter((x) => x.key === event);
      // console.log('handlers =>>>>>>', handlers);
      if (handlers.length) {
        this.logger.log(
          `Received webhook event for ${event}. Forwarding to ${handlers.length} event handlers`,
        );
        await Promise.all(handlers.map((x) => x.handler(webhookEvent)));
      }
    };
    paystackWebhookService.handleWebhook = handleWebhook;
  }
}
