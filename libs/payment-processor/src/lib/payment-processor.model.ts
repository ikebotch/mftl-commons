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
}

export interface ProductModel {
  name: string;
  currency: string;
  amount: number;
  description?: string;
  primaryImage?: string;
  secondaryImages?: string[];
  interval: string;
  extra?: any
}

export interface SubscriptionModel {
  billingCode: string;
  productRefId?: string;
  customer: string;
  successUrl?: string;
  cancelUrl?:string;
  paymentMethods?: string;
  mode?: string;
  amount: number;
}



export interface CustomerMetaDataModel {
  customerId: string;
  sponsorRef: string;
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
  [IntervalEnum.WEEKLY as string]: 'week',
  [IntervalEnum.MONTHLY as string]: 'month',
  [IntervalEnum.CUSTOM as string]: 'custom',
};
