import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RpcModule } from 'mftl-rpc';
import { ConfigModule } from '@nestjs/config';
import { serviceConfig } from './app.constants';


@Module({
  imports: [
    ConfigModule.forRoot(),
    RpcModule.register(serviceConfig)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
