import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { PaystackService } from 'mftl-paystack';
import Stripe from 'stripe';
import { CreateRefund } from '../classes/refund';
import { RefType, RefundModel } from '../payment-processor.model';

@Injectable()
export class RefundService {
  constructor(
    @Optional()
    @InjectStripeClient()
    public readonly stripeClient: Stripe,
    @Optional()
    public paystackService: PaystackService
  ) {}
  async create(paymentProcessor: RefType, refundData: RefundModel) {
    switch (paymentProcessor) {
      case RefType.PAYSTACK:
        return await this.paystackService.refund(
          new CreateRefund(refundData).paystack() as any
        );

      case RefType.STRIPE:
        return await this.stripeClient.refunds.create(
          new CreateRefund(refundData).stripe() as any
        );

      default:
        throw new NotFoundException(
          'Payment Processor specified does not exist for Refund'
        );
    }
  }
}
