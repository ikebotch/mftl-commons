import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import { Injectable, NotFoundException, Optional } from '@nestjs/common';

import { PaystackService } from 'mftl-paystack';
import Stripe from 'stripe';
import {
  CustomerPaystack,
  CustomerResponse,
  CustomerStripe,
} from '../classes/customer';
import { CustomerModel, RefType } from '../payment-processor.model';

@Injectable()
export class CustomerService {
  constructor(
    @Optional()
    @InjectStripeClient()
    public readonly stripeClient: Stripe,
    @Optional()
    public paystackService: PaystackService
  ) {}

  async create(paymentProcessor: RefType, customer: CustomerModel) {
    switch (paymentProcessor) {
      case RefType.PAYSTACK:
        return new CustomerResponse(this.paystackService).paystack(
          await this.paystackService.createCustomer(
            new CustomerPaystack(customer)
          ),
          customer
        );

      case RefType.STRIPE:
        return new CustomerResponse(this.stripeClient).stripe(
          await this.stripeClient.customers.create(new CustomerStripe(customer))
        );

      default:
        throw new NotFoundException('No payment Processor specified');
    }
  }

  async update(paymentProcessor: RefType, id: string, customer: CustomerModel) {
    switch (paymentProcessor) {
      case RefType.PAYSTACK:
        return new CustomerResponse(this.paystackService).paystack(
          await this.paystackService.updateCustomer(
            id,
            new CustomerPaystack(customer)
          ),
          customer
        );

      case RefType.STRIPE:
        return new CustomerResponse(this.stripeClient).stripe(
          await this.stripeClient.customers.update(
            id,
            new CustomerStripe(customer)
          )
        );

      default:
        throw new NotFoundException('No payment Processor specified');
    }
  }
}
