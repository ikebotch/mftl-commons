import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcService } from 'mftl-rpc';
import { TenancyService } from 'mftl-tenancy';
import { serviceConfig } from './app.constants';

@Injectable()
export class AppService {
  constructor(
    private rpcSrv: RpcService,
    private tenancyService: TenancyService
  ) {}
  async getData() {
    try {
      console.log(this.tenancyService.tenancy);

      const testRPC = await this.rpcSrv.rpcBuilder(
        serviceConfig.FETCH_CUSTOMER.name
      );
      return { message: 'Welcome to common-test!', data: testRPC };
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
}
