import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';

import { PaystackService } from 'mftl-paystack';
import Stripe from 'stripe';
import {
  ProductResponse,
  PlanPaystack,
  ProductStripe,
} from '../classes/product';
import { RefType, ProductModel } from '../payment-processor.model';

@Injectable()
export class ProductService {
  constructor(
    @Optional()
    @InjectStripeClient()
    private readonly stripeClient: Stripe,
    @Optional()
    private paystackService: PaystackService
  ) {}

  async create(paymentProcessor: RefType, product: ProductModel) {
    switch (paymentProcessor) {
      case RefType.PAYSTACK:
        return new ProductResponse(this.paystackService).paystack(
          await this.paystackService.createPlan(new PlanPaystack(product)),
          product
        );

      case RefType.STRIPE: {
        const pdt = new ProductStripe(product);
        if (!this.stripeClient) {
          return new BadRequestException(
            'The Payment processor specified has not been configured yet'
          );
        }
        const pdtRes = await this.stripeClient.products.create(pdt);
        const priceRes = await this.stripeClient.prices.create(
          pdt.price(pdtRes.id, product)
        );
        return new ProductResponse(this.stripeClient).stripe(
          pdtRes,
          priceRes,
          product
        );
      }

      default:
        throw new NotFoundException(
          'Payment Processor specified does not exist'
        );
    }
  }
}
