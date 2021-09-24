import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { SECRET_KEY } from './config';

@Global()
@Module({})
export class StrategiesModule {
  static register(secretKey: string): DynamicModule {
    return {
      module: StrategiesModule,
      providers: [
        {
          provide: SECRET_KEY,
          useValue: secretKey
        },
        JwtStrategy,
      ]
    }
  }
}
