import { Module, Global, DynamicModule } from '@nestjs/common';
import { RpcConfigModel } from './rpc.models';
import { RpcService } from './rpc.service';
import { HttpModule } from '@nestjs/axios';
import { AxiosRequestConfig } from '@nestjs/axios/node_modules/axios';
import { RPC_CONFIG } from './rpc.config';

@Global()
@Module({})
export class RpcModule {
  static register(
    config: { [id: string]: RpcConfigModel },
    httpConfig?: AxiosRequestConfig
  ): DynamicModule {
    return {
      module: RpcModule,
      imports: [
        HttpModule.register({
          timeout: 5000,
          maxRedirects: 3,
          ...(httpConfig || {}),
        }),
      ],
      providers: [
        {
          provide: RPC_CONFIG,
          useValue: config,
        },
        RpcService,
      ],
      exports: [RpcService],
    };
  }
}
