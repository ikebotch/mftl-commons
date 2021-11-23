import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { TenancyInterceptor } from 'mftl-tenancy';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseInterceptors(TenancyInterceptor)
  getData() {
    return this.appService.getData();
  }
}
