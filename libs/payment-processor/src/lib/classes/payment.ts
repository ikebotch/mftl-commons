import { PaystackInterface } from 'mftl-paystack';
import Stripe from 'stripe';
import { PaymentPageModel } from '../payment-processor.model';
import { convertAmountToFintech } from '../payment-processor.utils';

export class CreatePaymentPage {
  name!: string;
  billingCode!: string;
  customerId!: string;
  customerRefId!: string;
  productRefId!: string;
  amount!: number;
  description!: string;
  currency!: string;
  subscriptionCode!: string;
  cancelUrl!: string;
  successUrl!: string;
  leaseId!: number;
  refundId?: string;
  refundAmount!: number;
  refundReason?: string;
  transactionId!: string;
  invoiceId!: string;

  constructor(paymentData: PaymentPageModel) {
    const {
      amount,
      billingCode,
      cancelUrl,
      currency,
      customerId,
      customerRefId,
      description,
      name,
      productRefId,
      subscriptionCode,
      successUrl,
      leaseId,
      refundAmount,
      refundId,
      refundReason,
      transactionId,
      invoiceId,
    } = paymentData;

    this.amount = convertAmountToFintech(Number(amount));
    this.billingCode = billingCode;
    this.cancelUrl = cancelUrl;
    this.currency = currency;
    this.customerId = customerId;
    this.customerRefId = customerRefId;
    this.description = description;
    this.name = name;
    this.productRefId = productRefId;
    this.subscriptionCode = subscriptionCode;
    this.successUrl = successUrl;
    this.leaseId = leaseId;
    this.refundAmount = refundAmount;
    this.refundId = refundId;
    this.refundReason = refundReason;
    this.transactionId = transactionId;
    this.invoiceId = invoiceId;
  }

  stripe() {
    return {
      cancel_url: this.cancelUrl,
      success_url: this.successUrl,
      mode: 'payment',
      customer: this.customerRefId,
      line_items: [
        {
          description: this.description,
          price_data: {
            product: this.productRefId,
            currency: this.currency,
            unit_amount: this.amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        customerRefId: this.customerRefId,
        customerId: this.customerId,
        billingCode: this.billingCode,
        subscriptionCode: this.subscriptionCode,
        leaseId: this.leaseId,
        transactionId: this.transactionId,
        refundId: this.refundId,
        refundAmount: this.refundAmount,
        refundReason: this.refundReason,
        invoiceId: this.invoiceId,
      },
    };
  }
  paystack() {
    return {
      name: this.name,
      description: this.description,
      amount: this.amount,
      currency: this.currency.toUpperCase(),
      redirect_url: this.successUrl,
      customer_code: this.customerRefId,
      metadata: {
        customerRefId: this.customerRefId,
        customerId: this.customerId,
        billingCode: this.billingCode,
        subscriptionCode: this.subscriptionCode,
        transactionId: this.transactionId,
        leaseId: this.leaseId,
        refundId: this.refundId,
        refundAmount: this.refundAmount,
        refundReason: this.refundReason,
        invoiceId: this.invoiceId,
      },
    };
  }
}

export class CreatePaymentPageResponse {
  url!: string;

  stripe(res: Stripe.Response<Stripe.Checkout.Session>) {
    this.url = res.url as string;
    return this;
  }
  paystack(
    res: PaystackInterface.GenericHttpResponse<PaystackInterface.PaymentPage>
  ) {
    this.url = 'https://paystack.com/pay/' + res.data.slug;
    return this;
  }
}
