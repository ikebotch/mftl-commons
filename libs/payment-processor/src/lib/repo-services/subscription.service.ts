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
import {
  RefType,
  SubscriptionChangeModel,
  SubscriptionModel,
} from '../payment-processor.model';

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
    subscription: SubscriptionChangeModel
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
            authorization,
            ...subscription,
          }).paystack()
        );
      }

      case RefType.STRIPE: {
        const sub = await this.stripeClient.subscriptions.del(id);
        return await this.stripeClient.subscriptions.create(
          new SubscriptionChange({
            authorization: sub?.default_payment_method as string,
            ...subscription,
          }).stripe() as any
        );
      }

      default:
        throw new NotFoundException(
          'Payment Processor specified does not exist'
        );
    }
  }

  async disable(paymentProcessor: RefType, id: string) {
    switch (paymentProcessor) {
      case RefType.PAYSTACK: {
        const sub = await this.paystackService.fetchSubscription(id);
        return await this.paystackService.disableSubscription(
          sub.data.subscription_code,
          sub.data.email_token
        );
      }

      case RefType.STRIPE: {
        return await this.stripeClient.subscriptions.del(id);
      }

      default:
        throw new NotFoundException(
          'Payment Processor specified does not exist to disable subscription'
        );
    }
  }
}
