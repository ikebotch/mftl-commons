import { BadRequestException } from '@nestjs/common';
import { PaystackInterface } from 'mftl-paystack';
import Stripe from 'stripe';
import {
  ProductModel,
  STRIPE_PAYMENT_INTERVAL,
} from '../payment-processor.model';
import {
  convertAmountFromFintech,
  convertAmountToFintech,
} from '../payment-processor.utils';

export class ProductStripe {
  name!: string;
  description?: string;
  images!: string[];
  constructor(product: ProductModel) {
    const { name, description, primaryImage, secondaryImages } = product;
    this.name = name;
    this.description = description;
    this.images = primaryImage
      ? [primaryImage, ...(secondaryImages || [])]
      : [...(secondaryImages || [])];
  }

  price(id: string, product: ProductModel): Stripe.PriceCreateParams {
    const { amount, currency, interval } = product;
    return {
      product: id,
      unit_amount: convertAmountToFintech(amount),
      recurring: !interval
        ? undefined
        : {
            interval: STRIPE_PAYMENT_INTERVAL[interval] as any,
          },
      currency,
    };
  }

}

export class PlanPaystack {
  name!: string;
  amount!: number;
  interval!: string;
  description?: string;
  send_invoices?: boolean;
  send_sms?: boolean;
  currency!: string;
  invoice_limit?: number;

  constructor(plan: PaystackInterface.PlanParam) {
    const {
      name,
      amount,
      interval,
      description,
      send_invoices,
      send_sms,
      currency,
      invoice_limit,
    } = plan;
    this.name = name as string;
    this.amount = convertAmountToFintech(Number(amount));
    this.interval = interval as string;
    this.description = description;
    this.send_invoices = send_invoices ?? false;
    this.send_sms = send_sms ?? false;
    this.currency = currency as string;
    this.invoice_limit = invoice_limit;
  }
}

export class ProductResponse<T> {
  name?: string;
  productRefId?: string;
  billingCode?: string;
  currency?: string;
  interval?: string;
  amount?: number;
  extra: any;
  constructor(paymentProcessorSrv: T) {
    if (!paymentProcessorSrv) {
      throw new BadRequestException(
        'The Payment processor specified has not been configured yet'
      );
    }
  }

  stripe(
    pdtRes: Stripe.Response<Stripe.Product>,
    priceRes: Stripe.Response<Stripe.Price>,
    product: ProductModel
  ) {
    const { name, id: productRefId } = pdtRes;
    const { id: billingCode, currency, unit_amount } = priceRes;
    this.name = name;
    this.productRefId = productRefId;
    this.billingCode = billingCode;
    this.currency = currency;
    this.interval = product?.interval;
    this.amount = convertAmountFromFintech(Number(unit_amount));

    return this;
  }

  paystack(
    res: PaystackInterface.GenericHttpResponse<PaystackInterface.Plan>,
    product: ProductModel
  ) {
    const {
      amount,
      currency,
      plan_code: billingCode,
      id: productRefId,
      interval,
    } = res.data;
    this.name = product.name;
    this.productRefId = productRefId?.toString();
    this.billingCode = billingCode;
    this.currency = currency;
    this.interval = interval;
    this.amount = convertAmountFromFintech(Number(amount));

    return this;
  }
}
