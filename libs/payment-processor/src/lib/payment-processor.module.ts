import { DynamicModule, Global, Module } from '@nestjs/common';
import { PaymentProcessorService } from './payment-processor.service';
import { StripeModule } from '@golevelup/nestjs-stripe';
import { PaymentProcessorConfigModel } from './payment-processor.model';
import { PaystackModule } from 'mftl-paystack';
import { CustomerService } from './repo-services/customer.service';
import { ProductService } from './repo-services/product.service';
import { SubscriptionService } from './repo-services/subscription.service';

@Global()
@Module({})
export class PaymentProcessorModule {
  static forRoot(config: PaymentProcessorConfigModel): DynamicModule {
    const { paystackConfig, stripeConfig } = config;
    const imports = [];
    const exports = [];
    if (paystackConfig && paystackConfig?.secretkey) {
      imports.push(PaystackModule.forRoot({ ...paystackConfig }));
      exports.push(PaystackModule);
    }

    if (stripeConfig && stripeConfig?.apiKey) {
      imports.push(
        StripeModule.forRoot(StripeModule, {
          ...stripeConfig,
        }),
      );
      exports.push(StripeModule);
    }
    return {
      module: PaymentProcessorModule,
      imports,
      exports: [...exports, PaymentProcessorService],
      providers: [
        ProductService,
        CustomerService,
        SubscriptionService,
        PaymentProcessorService,
      ],
    };
  }
}
