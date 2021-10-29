import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcService } from 'mftl-rpc';
import { serviceConfig } from './app.module';

@Injectable()
export class AppService {
  constructor(private rpcSrv: RpcService) {}
  async getData() {
    try {
      const testRPC = await this.rpcSrv.rpcBuilder(
        serviceConfig.FETCH_CUSTOMER.name
      );
      return { message: 'Welcome to common-test!', data: testRPC };
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
}
