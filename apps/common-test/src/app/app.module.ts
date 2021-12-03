import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CentralizedConfigModule } from 'mftl-config';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';


@Module({
  imports: [
    ConfigModule.forRoot(),
    CentralizedConfigModule.register({
      serviceFilePath: join(
        __dirname,
        'assets',
        process.env.CONFIG_SERVICE_FILE as string
      ),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
