import { BadRequestException } from '@nestjs/common';
import { PaystackInterface } from 'mftl-paystack';
import Stripe from 'stripe';
import { SubscriptionChangeModel, SubscriptionModel } from '../payment-processor.model';
import { convertAmountToFintech } from '../payment-processor.utils';

export class CheckoutSessionStripe {
  success_url!: string;
  cancel_url!: string;
  payment_method_types: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] =
    ['card'];
  mode: Stripe.Checkout.SessionCreateParams.Mode = 'subscription';
  customer: string;
  line_items: Stripe.Checkout.SessionCreateParams.LineItem[];
  constructor(checkout: SubscriptionModel) {
    const { customer, billingCode, successUrl, cancelUrl } = checkout;
    this.success_url = successUrl as string;
    this.cancel_url = cancelUrl as string;
    this.customer = customer;
    this.line_items = [{ price: billingCode, quantity: 1 }];
  }
}

export class SubscriptionPaystack {
  email: string;
  plan: string;
  amount: number;

  constructor(subscription: SubscriptionModel) {
    const { customer, billingCode, amount } = subscription;
    this.email = customer;
    this.plan = billingCode;
    this.amount = convertAmountToFintech(Number(amount));
  }
}

export class CustomSubscriptionPaystack {
  customer: string;
  plan: string;
  authorization?: string;
  start_date?: Date;

  constructor(subscription: SubscriptionModel) {
    const { customer, billingCode, start_date, authorization } = subscription;
    this.customer = customer;
    this.plan = billingCode;
    if (start_date) {
      this.start_date = new Date(start_date);
    }
    if (authorization) {
      this.authorization = authorization;
    }
  }
}

export class SubscriptionChange {
  billingCode: string;
  start_date?: Date;
  authorization?: string;
  customer: string;

  constructor(sub: SubscriptionChangeModel) {
    const { billingCode, start_date, authorization, customer } = sub;
    this.billingCode = billingCode;
    this.customer = customer;
    if (start_date) {
      this.start_date = start_date;
    }
    if (authorization) {
      this.authorization = authorization;
    }
  }
  stripe() {
    return {
      customer: this.customer,
      items: [
        { price: this.billingCode, quantity: 1 },
      ],
      default_payment_method: this.authorization,
      trial_end: this.start_date
    };
  }

  paystack() {
    return {
      customer: this.customer,
      plan: this.billingCode,
      authorization: this.authorization ? this.authorization : undefined ,
      start_date: this.start_date ? new Date(this.start_date) : undefined,
    };
  }
}

export class SubscriptionResponse<T> {
  url!: string;

  constructor(paymentProcessorSrv: T) {
    if (!paymentProcessorSrv) {
      throw new BadRequestException(
        'The Payment processor specified has not been configured yet'
      );
    }
  }
  stripe(subRes: Stripe.Response<Stripe.Checkout.Session>) {
    const { url } = subRes;
    this.url = url as string;
    return this;
  }

  paystack(
    res: PaystackInterface.GenericHttpResponse<PaystackInterface.TransactionInitialize>
  ) {
    const { authorization_url } = res.data;
    this.url = authorization_url;

    return this;
  }
}
