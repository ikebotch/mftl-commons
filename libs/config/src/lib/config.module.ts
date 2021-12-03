import { Module, Global, DynamicModule } from '@nestjs/common';
import { ConfigModel } from './config.model';
import { CentralizedConfigService } from './config.service';
import { CONFIG_OPTIONS } from './config.token';

@Global()
@Module({})
export class CentralizedConfigModule {
  static register(config: ConfigModel): DynamicModule {
    return {
      module: CentralizedConfigModule,
      imports: [],
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: config,
        },
        CentralizedConfigService,
      ],
      exports: [CentralizedConfigService],
    };
  }
}
