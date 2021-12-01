import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from '@nestjs/axios/node_modules/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { RPC_CONFIG } from './rpc.config';
import { RpcConfigModel } from './rpc.models';

@Injectable()
export class RpcService {
  private readonly logger = new Logger('MFTL RPC');
  constructor(
    private httpService: HttpService,
    @Inject(RPC_CONFIG) private rpcConfig: { [id: string]: RpcConfigModel }
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
    httpConfig?: AxiosRequestConfig
  ) {
    try {
      const idParam = id?.trim() ? '/' + id.trim() : '';
      const { method, url } = this.rpcConfig[rpcName];
      this.logger.log(JSON.stringify({ ...this.rpcConfig[rpcName] }));
      if (method === 'post') {
        return await lastValueFrom(
          this.httpService
            .post<T>(`${url}${idParam}`, httpConfig?.data, httpConfig)
            .pipe(map((x) => x.data))
        );
      } else {
        return await lastValueFrom(
          this.httpService[method]<T>(`${url}${idParam}`, httpConfig).pipe(
            map((x) => x.data)
          )
        );
      }
    } catch (error: any) {
      this.logger.error(error, error?.message);
      throw new Error(error);
    }
  }
}
