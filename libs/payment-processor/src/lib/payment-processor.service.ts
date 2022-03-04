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
    public productRepoSrv: ProductService,
    public customerSrv: CustomerService,
    public subscriptionSrv: SubscriptionService
  ) {}

  async createCustomer(paymentProcessor: RefType, customer: CustomerModel) {
    return await this.customerSrv.create(paymentProcessor, customer);
  }

  async updateCustomer(
    paymentProcessor: RefType,
    id: string,
    customer: CustomerModel
  ) {
    return await this.customerSrv.update(paymentProcessor, id, customer);
  }
  async createProduct(paymentProcessor: RefType, product: ProductModel) {
    return await this.productRepoSrv.create(paymentProcessor, product);
  }

  deleteProduct(paymentProcessor: RefType, id: string, extra: any) {
    return this.productRepoSrv.delete(paymentProcessor, id, extra);
  }

  deleteAllProducts(paymentProcessor: RefType) {
    return this.productRepoSrv.deletAll(paymentProcessor);
  }

  async createSubscription(
    paymentProcessor: RefType,
    subscription: SubscriptionModel
  ) {
    return await this.subscriptionSrv.create(paymentProcessor, subscription);
  }

  async createCustomSubscription(
    paymentProcessor: RefType,
    subscription: SubscriptionModel
  ) {
    return await this.subscriptionSrv.createCustom(
      paymentProcessor,
      subscription
    );
  }

  async fetchSubscription(paymentProcessor: RefType, id: string) {
    return await this.subscriptionSrv.fetchSubscription(paymentProcessor, id);
  }
  async changeCustomerSubscription(
    paymentProcessor: RefType,
    id: string,
    subscription: SubscriptionModel
  ) {
    return await this.subscriptionSrv.change(
      paymentProcessor,
      id,
      subscription
    );
  }

  async disableSubscription(paymentProcessor: RefType, id: string) {
    return await this.subscriptionSrv.disable(paymentProcessor, id);
  }
}
