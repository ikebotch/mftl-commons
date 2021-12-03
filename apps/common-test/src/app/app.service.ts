import { Injectable } from '@nestjs/common';
import { CentralizedConfigService } from 'mftl-config';

@Injectable()
export class AppService {
  constructor(private configService: CentralizedConfigService) {}
  async getData() {
    return await this.configService.fetchConfig(
      'qplus-payment-properties',
      'ghana'
    );
  }
}
