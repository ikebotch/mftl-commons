import { BadRequestException } from '@nestjs/common';
import { PaystackInterface } from 'mftl-paystack';
import Stripe from 'stripe';
import { SubscriptionModel } from '../payment-processor.model';
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
    this.line_items = [{ price: billingCode }];
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

export class SubscriptionResponse<T> {
  url!: string;

  constructor(paymentProcessorSrv: T) {
    if (!paymentProcessorSrv) {
      throw new BadRequestException(
        'The Payment processor specified has not been configured yet',
      );
    }
  }
  stripe(subRes: Stripe.Response<Stripe.Checkout.Session>) {
    const { url } = subRes;
    this.url = url as string;
    return this;
  }

  paystack(
    res: PaystackInterface.GenericHttpResponse<PaystackInterface.TransactionInitialize>,
  ) {
    const { authorization_url } = res.data;
    this.url = authorization_url;

    return this;
  }
}
