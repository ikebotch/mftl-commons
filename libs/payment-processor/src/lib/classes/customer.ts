import { BadRequestException } from '@nestjs/common';
import { PaystackInterface } from 'mftl-paystack';
import Stripe from 'stripe';
import {
  CustomerMetaDataModel,
  CustomerModel,
} from '../payment-processor.model';

export class CustomerStripe {
  name: string;
  phone: string;
  email: string;
  metadata: CustomerMetaDataModel | any;
  constructor(customer: CustomerModel) {
    const {
      firstname,
      lastname,
      phone,
      email,
      customerId,
      sponsorRef,
      tenantId,
    } = customer;
    (this.name = `${firstname} ${lastname}`), (this.phone = phone);
    this.email = email;
    this.metadata = {
      customerId,
      sponsorRef,
      tenantId,
    };
  }
}

export class CustomerPaystack {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  metadata: CustomerMetaDataModel;
  constructor(customer: CustomerModel) {
    const {
      firstname,
      lastname,
      phone,
      email,
      customerId,
      sponsorRef,
      tenantId,
    } = customer;
    this.first_name = firstname;
    this.last_name = lastname;
    this.phone = phone;
    this.email = email;
    this.metadata = {
      customerId,
      sponsorRef,
      tenantId,
    };
  }
}

export class CustomerResponse<T> {
  customerRefId?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  metadata?: CustomerMetaDataModel;
  extra: any;

  constructor(paymentProcessorSrv: T) {
    if (!paymentProcessorSrv) {
      throw new BadRequestException(
        'The Payment processor specified has not been configured yet'
      );
    }
  }

  stripe(res: Stripe.Response<Stripe.Customer>) {
    const { name, phone, id, email, metadata } = res;
    const [firstname, lastname] = name?.split(' ') || [];
    this.firstname = firstname;
    this.lastname = lastname;
    this.phone = phone as string;
    this.email = email as string;
    this.customerRefId = id;
    this.metadata = metadata as any;

    return this;
  }

  paystack(
    res: PaystackInterface.GenericHttpResponse<PaystackInterface.Customer>,
    customer: CustomerModel
  ) {
    const { customer_code, email } = res.data;
    const { firstname, lastname, phone, customerId, sponsorRef, tenantId } =
      customer;
    this.customerRefId = customer_code;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.phone = phone;
    this.metadata = {
      customerId,
      sponsorRef,
      tenantId,
    };

    return this;
  }
}
