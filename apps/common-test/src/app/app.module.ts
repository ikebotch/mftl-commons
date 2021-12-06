import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CentralizedConfigModule } from 'mftl-config';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentProcessorModule } from 'mftl-payment-processor';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({maxRedirects: 5, timeout: 500}),
    ConfigModule.forRoot(),
    CentralizedConfigModule.register({
      serviceFilePath: join(
        __dirname,
        'assets',
        process.env.CONFIG_SERVICE_FILE as string
      ),
    }),
    PaymentProcessorModule.forRoot({
      stripeConfig: {
        apiKey: process.env.STRIPE_API_KEY as string,
        webhookConfig: {
          stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET as string,
        },
        apiVersion: process.env.STRIPE_API_VERSION as any,
      },
      paystackConfig: {
        secretkey: process.env.PAYSTACK_SECRET_KEY as string,
        url: process.env.PAYSTACK_URL,
        useWebhook: process.env.PAYSTACK_USE_WEBHOOK === 'true',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
