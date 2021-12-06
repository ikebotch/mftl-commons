import { HttpService } from '@nestjs/axios';
import { Controller, Get, Post } from '@nestjs/common';
import { lastValueFrom,map,retry,throwError,timer } from 'rxjs';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly httpSrv: HttpService) {}

  @Get()
  getData() {
    console.log('i am high as a kite')
    // return this.appService.getData();
  }

  @Post()
  async postData() {
    await lastValueFrom(this.httpSrv.get('https://www.google.com/').pipe(retry(5))) ;
    console.log('i am high as a kite....POST')
    // return this.appService.getData();
  }
}
