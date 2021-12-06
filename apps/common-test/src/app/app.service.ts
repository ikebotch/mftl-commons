import { Injectable } from '@nestjs/common';
// import { CentralizedConfigService } from 'mftl-config';
import { PaymentProcessorService, RefType } from 'mftl-payment-processor';

@Injectable()
export class AppService {
  constructor(private ppSrv: PaymentProcessorService) {}
  async getData() {
    return this.ppSrv.deleteAllProducts(RefType.STRIPE)
    // return await this.configService.fetchConfig(
    //   'qplus-payment-properties',
    //   'ghana'
    // );
  }
}
