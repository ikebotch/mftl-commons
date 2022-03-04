import { StripeModuleConfig } from '@golevelup/nestjs-stripe';
import { PaystackInterface } from 'mftl-paystack';

export interface PaymentProcessorConfigModel {
  stripeConfig?: StripeModuleConfig;
  paystackConfig?: PaystackInterface.ConfigModuleOptions;
}

export interface CustomerModel {
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  customerId: string;
  sponsorRef: string;
  tenantId: string;
}

export interface ProductModel {
  name: string;
  currency: string;
  amount: number;
  description?: string;
  primaryImage?: string;
  secondaryImages?: string[];
  interval: string;
  extra?: any;
}

export interface SubscriptionModel {
  productId: string;
  customerId: string;
  billingCode: string;
  productRefId?: string;
  customer: string;
  successUrl?: string;
  cancelUrl?: string;
  paymentMethods?: string;
  mode?: string;
  amount: number;
  metaData?: any;
  authorization?: string;
  start_date?: Date;
}

export interface SubscriptionChangeModel {
  billingCode: string;
  start_date?: Date;
  authorization?: string;
  customer: string;
}

export interface PaymentPageModel {
  name: string;
  billingCode: string;
  customerId: string;
  customerRefId: string;
  productRefId: string;
  amount: number;
  description: string;
  currency: string;
  subscriptionCode: string;
  cancelUrl: string;
  successUrl: string;
  leaseId: number;
  refundId: string;
  refundAmount: number;
  refundReason?: string;
  transactionId: string;
  invoiceId: string;
}

export interface RefundModel {
  id: string;
  amount: number;
  reason?: string;
}

export interface CustomerMetaDataModel {
  customerId: string;
  sponsorRef: string;
  tenantId: string;
}

export enum IntervalEnum {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  ANNUALLY = 'annually',
  BIANNUALLY = 'biannually',
  CUSTOM = 'custom',
}

export enum RefType {
  PAYSTACK = 'paystack',
  STRIPE = 'stripe',
}

export const STRIPE_PAYMENT_INTERVAL = {
  [IntervalEnum.DAILY as string]: 'day',
  [IntervalEnum.ANNUALLY as string]: 'year',
  [IntervalEnum.WEEKLY as string]: 'week',
  [IntervalEnum.MONTHLY as string]: 'month',
  [IntervalEnum.CUSTOM as string]: 'custom',
};
