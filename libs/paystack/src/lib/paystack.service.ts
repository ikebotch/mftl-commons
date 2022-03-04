import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { InjectPaystackModuleConfig } from './decorators/paystack-event.decorator';
import { PaystackInterface } from './paystack.interface';

@Injectable()
export class PaystackService {
  constructor(
    private httpService: HttpService,
    @InjectPaystackModuleConfig()
    public config: PaystackInterface.ConfigModuleOptions
  ) {}

  async createPlan(
    data: any
  ): Promise<PaystackInterface.GenericHttpResponse<PaystackInterface.Plan>> {
    try {
      return await lastValueFrom(
        this.httpService.post('plan', data).pipe(map((x) => x.data))
      );
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async deletePlan(id: string): Promise<any> {
    try {
      return await lastValueFrom(this.httpService.delete(`plan/${id}`));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async listPlans(): Promise<
    PaystackInterface.GenericHttpResponse<PaystackInterface.Plan[]>
  > {
    try {
      return await lastValueFrom(
        this.httpService.get('plan').pipe(map((x) => x.data))
      );
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async retrievePlan(
    id: string
  ): Promise<PaystackInterface.GenericHttpResponse<PaystackInterface.Plan>> {
    try {
      return await lastValueFrom(
        this.httpService.get(`plan/${id}`).pipe(map((x) => x.data))
      );
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async updatePlan(
    id: string,
    data: any
  ): Promise<PaystackInterface.GenericHttpResponse<PaystackInterface.Plan>> {
    try {
      return await lastValueFrom(
        this.httpService.post(`plan/${id}`, data).pipe(map((x) => x.data))
      );
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async createPaymentPage(
    data: PaystackInterface.PaymentPageParam
  ): Promise<
    PaystackInterface.GenericHttpResponse<PaystackInterface.PaymentPage>
  > {
    try {
      return await lastValueFrom(
        this.httpService.post('page', data).pipe(map((x) => x.data))
      );
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async listCustomers(): Promise<
    PaystackInterface.GenericHttpResponse<PaystackInterface.Customer[]>
  > {
    try {
      return await lastValueFrom(
        this.httpService.get('customer').pipe(map((x) => x.data))
      );
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async retrieveCustomer(
    id: string
  ): Promise<
    PaystackInterface.GenericHttpResponse<PaystackInterface.Customer>
  > {
    try {
      return await lastValueFrom(
        this.httpService.get(`customer/${id}`).pipe(map((x) => x.data))
      );
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async createCustomer(
    data: PaystackInterface.CustomerParam
  ): Promise<
    PaystackInterface.GenericHttpResponse<PaystackInterface.Customer>
  > {
    try {
      return await lastValueFrom(
        this.httpService.post('customer', data).pipe(map((x) => x.data))
      );
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async updateCustomer(
    id: string,
    data: PaystackInterface.CustomerParam
  ): Promise<
    PaystackInterface.GenericHttpResponse<PaystackInterface.Customer>
  > {
    try {
      return await lastValueFrom(
        this.httpService.put(`customer/${id}`, data).pipe(map((x) => x.data))
      );
    } catch (error: any) {
      // console.log(error);
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async transactionInitialize(
    data: PaystackInterface.TransactionInitializeParam
  ): Promise<
    PaystackInterface.GenericHttpResponse<PaystackInterface.TransactionInitialize>
  > {
    try {
      return await lastValueFrom(
        this.httpService
          .post('transaction/initialize', data)
          .pipe(map((x) => x.data))
      );
    } catch (error: any) {
      // console.log('error log me', error);
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async subscribe(
    data: PaystackInterface.SubscriptionParam
  ): Promise<
    PaystackInterface.GenericHttpResponse<PaystackInterface.Subscription>
  > {
    try {
      return await lastValueFrom(
        this.httpService.post('subscription', data).pipe(map((x) => x.data))
      );
    } catch (error: any) {
      // console.log('error log me', error.response?.data?.message);
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async fetchSubscription(
    id: string
  ): Promise<
    PaystackInterface.GenericHttpResponse<PaystackInterface.Subscription>
  > {
    try {
      return await lastValueFrom(
        this.httpService.get(`subscription/${id}`).pipe(map((x) => x.data))
      );
    } catch (error: any) {
      // console.log('error log me', error.response?.data?.message);
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async listSubscriptions(): Promise<
    PaystackInterface.GenericHttpResponse<PaystackInterface.Subscription[]>
  > {
    try {
      return await lastValueFrom(
        this.httpService.get('subscription').pipe(map((x) => x.data))
      );
    } catch (error: any) {
      // console.log('error log me', error.response?.data?.message);
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async disableSubscription(
    code: string,
    token: string
  ): Promise<PaystackInterface.GenericHttpResponse<unknown>> {
    try {
      return await lastValueFrom(
        this.httpService
          .post(`subscription/disable`, { code, token })
          .pipe(map((x) => x.data))
      );
    } catch (error: any) {
      // console.log('error log me', error.response?.data?.message);
      throw new Error(error.response?.data?.message || error.message);
    }
  }
}
