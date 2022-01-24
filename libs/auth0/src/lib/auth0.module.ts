import { DynamicModule, Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Auth0Service } from './auth0.service';
import { JwtStrategy } from './jwt.stategy';
import { HttpModule } from '@nestjs/axios';
import { Auth0ConfigModel } from './auth0.model';
import { AxiosRequestConfig } from '@nestjs/axios/node_modules/axios';
import { AUTH0_CONFIG } from './auth0.config';

@Global()
@Module({})
export class Auth0Module {
  static forRoot(
    config: Auth0ConfigModel,
    httpConfig = {} as AxiosRequestConfig
  ): DynamicModule {
    return {
      module: Auth0Module,
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        HttpModule.register({ ...httpConfig }),
      ],
      exports: [PassportModule, Auth0Service],
      providers: [
        JwtStrategy,
        Auth0Service,
        { provide: AUTH0_CONFIG, useValue: config },
      ],
    };
  }
}
