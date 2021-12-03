import { Injectable } from '@nestjs/common';
import {
  CustomerModel,
  ProductModel,
  RefType,
  SubscriptionModel,
} from './payment-processor.model';
import { CustomerService } from './repo-services/customer.service';
import { ProductService } from './repo-services/product.service';
import { SubscriptionService } from './repo-services/subscription.service';

@Injectable()
export class PaymentProcessorService {
  constructor(
    private productRepoSrv: ProductService,
    private customerSrv: CustomerService,
    private subscriptionSrv: SubscriptionService,
  ) {}

  async createCustomer(paymentProcessor: RefType, customer: CustomerModel) {
    return await this.customerSrv.create(paymentProcessor, customer);
  }
  async createProduct(paymentProcessor: RefType, product: ProductModel) {
    return await this.productRepoSrv.create(paymentProcessor, product);
  }

  async createSubscription(
    paymentProcessor: RefType,
    subscription: SubscriptionModel,
  ) {
    return await this.subscriptionSrv.create(paymentProcessor, subscription);
  }
}
