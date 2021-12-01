import { Module, Global } from '@nestjs/common';
import { TenancyService } from './tenancy.service';

@Global()
@Module({
  controllers: [],
  providers: [TenancyService],
  exports: [TenancyService],
})
export class TenancyModule {}
