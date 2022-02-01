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
    public readonly stripeClient: Stripe,
    @Optional()
    public paystackService: PaystackService
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

  delete(paymentProcessor: RefType, id: string, extra?: any) {
    switch (paymentProcessor) {
      case RefType.PAYSTACK:
        this.paystackService.deletePlan(id);
        return;

      case RefType.STRIPE:
        this.stripeClient.plans.del(extra.billingCode);
        this.stripeClient.products.del(id);
        return;

      default:
        throw new NotFoundException(
          'Payment Processor specified does not exist'
        );
    }
  }

  async deletAll(paymentProcessor: RefType) {
    let products = [];
    switch (paymentProcessor) {
      case RefType.PAYSTACK: {
        const res = await this.paystackService.listPlans();
        products = res?.data || [];
        for (const pdt of products) {
          this.paystackService.deletePlan((pdt as any).id);
        }

        return;
      }
      case RefType.STRIPE: {
        const stripePdts = await this.stripeClient.products.list({
          limit: 100,
        });
        const priceRes = await this.stripeClient.plans.list({ limit: 100 });
        const prices = priceRes.data;
        products = stripePdts.data;
        for (const price of prices) {
          this.stripeClient.plans.del(price.id);
        }
        for (const pdt of products) {
          this.stripeClient.products.del(pdt.id);
        }

        return {
          price: {
            has_more: priceRes.has_more,
            noDeleted: priceRes.data?.length,
          },
          product: {
            has_more: stripePdts.has_more,
            noDeleted: stripePdts.data?.length,
          },
        };
      }
      default:
        throw new NotFoundException(
          'Payment Processor specified does not exist'
        );
    }
  }
}
