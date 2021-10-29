import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RpcConfigModel, RpcModule } from 'mftl-rpc';

export const serviceConfig: { [id: string]: RpcConfigModel } = {
  FETCH_CUSTOMER: {
    name: 'FETCH_CUSTOMER',
    url: 'https://reqres.in/api/users',
    method: 'get',
  },
};
@Module({
  imports: [RpcModule.register(serviceConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
