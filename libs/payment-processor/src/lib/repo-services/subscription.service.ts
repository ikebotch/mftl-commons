import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { PaystackService } from 'mftl-paystack';
import Stripe from 'stripe';
import {
  CheckoutSessionStripe,
  SubscriptionPaystack,
  SubscriptionResponse,
} from '../classes/subscription';
import { RefType, SubscriptionModel } from '../payment-processor.model';

@Injectable()
export class SubscriptionService {
  constructor(
    @Optional()
    @InjectStripeClient()
    private readonly stripeClient: Stripe,
    @Optional()
    private paystackService: PaystackService
  ) {}

  async create(paymentProcessor: RefType, subscription: SubscriptionModel) {
    switch (paymentProcessor) {
      case RefType.PAYSTACK:
        return new SubscriptionResponse(this.paystackService).paystack(
          await this.paystackService.transactionInitialize(
            new SubscriptionPaystack(subscription)
          )
        );

      case RefType.STRIPE:
        return new SubscriptionResponse(this.stripeClient).stripe(
          await this.stripeClient.checkout.sessions.create(
            new CheckoutSessionStripe(subscription)
          )
        );

      default:
        throw new NotFoundException(
          'Payment Processor specified does not exist'
        );
    }
  }
}
