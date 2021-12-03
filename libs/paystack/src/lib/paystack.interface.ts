/* eslint-disable @typescript-eslint/no-namespace */
export namespace PaystackInterface {
  export interface ConfigModuleOptions {
    secretkey: string;
    url?: string;
    httpConfig?: { maxRedirects?: number; timeout?: number };
    useWebhook?: boolean;
  }
  export interface GenericHttpResponse<T> {
    status: boolean;
    message: string;
    data: T;
  }

  export interface PlanParam {
    name?: string;
    amount?: number;
    interval?: string;
    description?: string;
    send_invoices?: boolean;
    send_sms?: boolean;
    currency?: string;
    invoice_limit?: number;
  }

  export interface Plan {
    amount?: number;
    interval?: string;
    integration?: number;
    domain?: string;
    plan_code?: string;
    send_invoices?: boolean;
    send_sms?: boolean;
    hosted_page?: boolean;
    currency?: string;
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }

  export interface PaymentPageParam {
    name?: string;
    description?: string;
    amount?: number;
    slug?: string;
    redirect_url?: string;
    send_invoices?: boolean;
    custom_fields?: boolean;
    plan?: number;
    customer?: number;
  }

  export interface PaymentPage {
    name: string;
    description: string;
    integration: number;
    customer: number;
    plan: number;
    domain: string;
    slug: string;
    currency: string;
    active: true;
    id: number;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface TransactionInitializeParam {
    email: string;
    amount: number;
    currency?: string;
    callback_url?: string;
    reference?: string;
    plan?: string;
    invoice_limit?: number;
    metadata?: string;
    channels?: string[];
    split_code?: string;
    subaccount?: string;
    transaction_charge?: number;
    bearer?: string;
  }

  export interface TransactionInitialize {
    authorization_url: string;
    access_code: string;
    reference: string;
  }

  export interface SubscriptionParam {
    customer: string;
    plan: string;
    authorization?: string;
    start_date?: Date;
  }

  export interface Authorization {
    authorization_code: string;
    bin: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    channel: string;
    card_type: string;
    bank: string;
    country_code: string;
    brand: string;
    reusable: boolean;
    signature: string;
    account_name: string;
}

  export interface Subscription {
    customer: number;
    plan: number;
    integration: number;
    domain: string;
    start: number;
    status: string;
    quantity: number;
    amount: number;
    authorization: Authorization;
    subscription_code: string;
    email_token: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface CustomerParam {
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    metadata?: any;
  }

  export interface Customer {
    email?: string;
    integration?: number;
    domain?: string;
    customer_code?: string;
    id?: number;
    identified?: false;
    identifications?: null;
    createdAt?: Date;
    updatedAt?: Date;
  }

  export type WebHookEvent =
    | 'charge.dispute.create'
    | 'charge.dispute.remind'
    | 'charge.dispute.resolve'
    | 'charge.success'
    | 'customeridentification.failed'
    | 'customeridentification.success'
    | 'invoice.create'
    | 'invoice.payment_failed'
    | 'invoice.update'
    | 'paymentrequest.pending'
    | 'paymentrequest.success'
    | 'subscription.create'
    | 'subscription.disable'
    | 'subscription.enable'
    | 'transfer.failed'
    | 'transfer.success'
    | 'transfer.reversed';
}
