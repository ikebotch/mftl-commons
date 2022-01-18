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
    public readonly stripeClient: Stripe,
    @Optional()
    public paystackService: PaystackService
  ) {}

  async create(paymentProcessor: RefType, subscription: SubscriptionModel) {
    switch (paymentProcessor) {
      case RefType.PAYSTACK:
        return new SubscriptionResponse(this.paystackService).paystack(
          await this.paystackService.transactionInitialize(
            new SubscriptionPaystack(subscription)
          )
        );

      case RefType.STRIPE:{
        // console.dir(new CheckoutSessionStripe(subscription), {depth: 8})
        const sub = new SubscriptionResponse(this.stripeClient).stripe(
          await this.stripeClient.checkout.sessions.create(
            new CheckoutSessionStripe(subscription)
          )

        )
        return sub
      }

      default:
        throw new NotFoundException(
          'Payment Processor specified does not exist'
        );
    }
  }

}
