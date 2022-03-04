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
    meta?: {
      total: number;
      skipped: number;
      perPage: number;
      page: number;
      pageCount: number;
    };
  }

  // "subscriptions": [],
  //   "integration": 100032,
  //   "domain": "test",
  //   "name": "Monthly retainer",
  //   "plan_code": "PLN_gx2wn530m0i3w3m",
  //   "description": null,
  //   "amount": 50000,
  //   "interval": "monthly",
  //   "send_invoices": true,
  //   "send_sms": true,
  //   "hosted_page": false,
  //   "hosted_page_url": null,
  //   "hosted_page_summary": null,
  //   "currency": "NGN",
  //   "id": 28,
  //   "createdAt": "2016-03-29T22:42:50.000Z",
  //   "updatedAt": "2016-03-29T22:42:50.000Z"
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
    subscriptions?: any[];
    description?: string;
    hosted_page_url?: null;
    hosted_page_summary?: null;
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

  // {
  //   "invoices": [],
  //   "customer": {},
  //   "plan": {}
  //   "integration": 100032,
  //   "authorization": {},
  //   "domain": "test",
  //   "start": 1459296064,
  //   "status": "active",
  //   "quantity": 1,
  //   "amount": 50000,
  //   "subscription_code": "SUB_vsyqdmlzble3uii",
  //   "email_token": "d7gofp6yppn3qz7",
  //   "easy_cron_id": null,
  //   "cron_expression": "0 0 28 * *",
  //   "next_payment_date": "2016-04-28T07:00:00.000Z",
  //   "open_invoice": null,
  //   "id": 9,
  //   "createdAt": "2016-03-30T00:01:04.000Z",
  //   "updatedAt": "2016-03-30T00:22:58.000Z"
  // }

  export interface Subscription {
    invoices: any[];
    customer: Customer;
    plan: Plan;
    integration: number;
    authorization: Authorization;
    domain: string;
    start: number;
    status: string;
    quantity: number;
    amount: number;
    subscription_code: string;
    email_token: string;
    easy_cron_id?: string;
    cron_expression: string;
    next_payment_date: Date;
    open_invoice?: any;
    id: number;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Transaction {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message?: any;
    gateway_response: string;
    paid_at?: any;
    created_at: Date;
    channel: string;
    currency: string;
    ip_address?: any;
    metadata: any;
    timeline?: any;
    customer: Customer;
    authorization: Authorization;
    plan: Plan;
    requested_amount: number;
    log?: any;
    fees?: any;
    paidAt?: Date;
    createdAt?: Date;
  }

  export interface TransactionQueryParam {
    perPage?: number;
    page?: number;
    customer?: string | number;
    status?: string;
    from?: Date;
    to?: Date;
    amount?: number;
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

  export interface RefundParam {
    transaction: string;
    amount?: number;
    currency?: string;
    customer_note?: string;
    merchant_note?: string;
  }

  export interface Refund {
    transaction: Transaction;
    integration: number;
    deducted_amount: number;
    channel?: any;
    merchant_note: string;
    customer_note: string;
    status: string;
    refunded_by: string;
    expected_at: Date;
    currency: string;
    domain: string;
    amount: number;
    fully_deducted: boolean;
    id: number;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface RefundQueryParam {
    reference?: string;
    currency?: string;
    from?: Date;
    to?: Date;
    perPage?: number;
    page?: number;
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
