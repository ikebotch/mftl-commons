import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from '@nestjs/axios/node_modules/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { lastValueFrom, map, retry } from 'rxjs';
import { RPC_CONFIG, RPC_HTTP_RETRY } from './rpc.config';
import { RpcConfigModel } from './rpc.models';

@Injectable()
export class RpcService {
  private readonly logger = new Logger('MFTL RPC');
  constructor(
    private httpService: HttpService,
    @Inject(RPC_CONFIG) private rpcConfig: { [id: string]: RpcConfigModel },
    @Inject(RPC_HTTP_RETRY) private rpcHttpRetry: number
  ) {}

  getConfigs() {
    return (
      Object.keys(this.rpcConfig).map(
        (configKey) => this.rpcConfig[configKey]
      ) || []
    );
  }

  async rpcBuilder<T>(
    rpcName: string,
    id?: string,
    httpConfig?: AxiosRequestConfig,
    httpRetry?: number
  ) {
    try {
      const idParam = id?.trim() ? '/' + id.trim() : '';
      const { method, url } = this.rpcConfig[rpcName];
      this.logger.log(JSON.stringify({ ...this.rpcConfig[rpcName] }));
      if (method === 'post') {
        return await lastValueFrom(
          this.httpService
            .post<T>(`${url}${idParam}`, httpConfig?.data, httpConfig)
            .pipe(
              map((x) => x.data),
              retry(httpRetry ?? this.rpcHttpRetry)
            )
        );
      } else {
        return await lastValueFrom(
          this.httpService[method]<T>(`${url}${idParam}`, httpConfig).pipe(
            map((x) => x.data),
            retry(httpRetry ?? this.rpcHttpRetry)
          )
        );
      }
    } catch (error: any) {
      this.logger.error(error, error?.message);
      throw new Error(error);
    }
  }
}
