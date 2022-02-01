import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { PaystackService } from 'mftl-paystack';
import Stripe from 'stripe';
import {
  CheckoutSessionStripe,
  CustomSubscriptionPaystack,
  SubscriptionChange,
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

      case RefType.STRIPE: {
        // console.dir(new CheckoutSessionStripe(subscription), {depth: 8})
        const sub = new SubscriptionResponse(this.stripeClient).stripe(
          await this.stripeClient.checkout.sessions.create(
            new CheckoutSessionStripe(subscription)
          )
        );
        return sub;
      }

      default:
        throw new NotFoundException(
          'Payment Processor specified does not exist'
        );
    }
  }

  async createCustom(
    paymentProcessor: RefType,
    subscription: SubscriptionModel
  ) {
    switch (paymentProcessor) {
      case RefType.PAYSTACK:
        return await this.paystackService.subscribe(
          new CustomSubscriptionPaystack(subscription)
        );

      default:
        throw new NotFoundException(
          'Payment Processor specified does not exist'
        );
    }
  }

  async fetchSubscription(paymentProcessor: RefType, id: string) {
    switch (paymentProcessor) {
      case RefType.PAYSTACK:
        return await this.paystackService.fetchSubscription(id);

      default:
        throw new NotFoundException(
          'Payment Processor specified does not exist'
        );
    }
  }

  async change(
    paymentProcessor: RefType,
    id: string,
    subscription: SubscriptionModel
  ) {
    switch (paymentProcessor) {
      case RefType.PAYSTACK: {
        const sub = await this.paystackService.fetchSubscription(id);
        const authorization = sub.data.authorization.authorization_code;
        await this.paystackService.disableSubscription(
          sub.data.subscription_code,
          sub.data.email_token
        );

        return await this.paystackService.subscribe(
          new SubscriptionChange({
            ...subscription,
            authorization,
          }).paystack()
        );
      }

      case RefType.STRIPE: {
        const sub = await this.stripeClient.subscriptions.del(id);
        return await this.stripeClient.subscriptions.create(
          new SubscriptionChange({
            ...subscription,
            authorization: sub.default_payment_method as string,
          }).stripe() as any
        );
      }

      default:
        throw new NotFoundException(
          'Payment Processor specified does not exist'
        );
    }
  }

  //   const subscription = await stripe.subscriptions.retrieve('sub_49ty4767H20z6a');
  // stripe.subscriptions.update('sub_49ty4767H20z6a', {
  //   cancel_at_period_end: false,
  //   proration_behavior: 'create_prorations',
  //   items: [{
  //     id: subscription.items.data[0].id,
  //     price: 'price_CBb6IXqvTLXp3f',
  //   }]
  // });
  // async changeSubscription() {

  // }
}
