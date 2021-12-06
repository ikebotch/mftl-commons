import { Module, Global, DynamicModule } from '@nestjs/common';
import { RpcConfigModel } from './rpc.models';
import { RpcService } from './rpc.service';
import { HttpModule } from '@nestjs/axios';
import { AxiosRequestConfig } from '@nestjs/axios/node_modules/axios';
import { RPC_CONFIG, RPC_HTTP_RETRY } from './rpc.config';

@Global()
@Module({})
export class RpcModule {
  static register(
    config: { [id: string]: RpcConfigModel },
    httpConfig?: AxiosRequestConfig, httpRetry?: number
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
        {
          provide: RPC_HTTP_RETRY,
          useValue: httpRetry ?? 5,
        },
        RpcService,
      ],
      exports: [RpcService],
    };
  }
}
