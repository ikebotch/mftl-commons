import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { PaystackService } from 'mftl-paystack';
import Stripe from 'stripe';
import {
  CreatePaymentPage,
  CreatePaymentPageResponse,
} from '../classes/payment';
import { PaymentPageModel, RefType } from '../payment-processor.model';

@Injectable()
export class PaymentService {
  constructor(
    @Optional()
    @InjectStripeClient()
    public readonly stripeClient: Stripe,
    @Optional()
    public paystackService: PaystackService
  ) {}
  async create(paymentProcessor: RefType, paymentData: PaymentPageModel) {
    switch (paymentProcessor) {
      case RefType.PAYSTACK:
        return new CreatePaymentPageResponse().paystack(
          await this.paystackService.createPaymentPage(
            new CreatePaymentPage(paymentData).paystack() as any
          )
        );

      case RefType.STRIPE:
        return new CreatePaymentPageResponse().stripe(
          await this.stripeClient.checkout.sessions.create(
            new CreatePaymentPage(paymentData).stripe() as any
          )
        );

      default:
        throw new NotFoundException(
          'Payment Processor specified does not exist for creating payment'
        );
    }
  }

  async expire(paymentProcessor: RefType, id: string) {
    switch (paymentProcessor) {
      // case RefType.PAYSTACK:
      //   return new CreatePaymentPageResponse().paystack(
      //     await this.paystackService.createPaymentPage(
      //       new CreatePaymentPage(paymentData).paystack()
      //     )
      //   );

      case RefType.STRIPE:
        return new CreatePaymentPageResponse().stripe(
          await this.stripeClient.checkout.sessions.expire(id)
        );

      default:
        throw new NotFoundException(
          'Payment Processor specified does not exist for Ending payment'
        );
    }
  }
}
