import { Module, Global, DynamicModule } from '@nestjs/common';
import { API_KEY, SENDER_EMAIL, SENDER_NAME } from './mailchip.config';
import { MailchipService } from './mailchip.service';

@Global()
@Module({})
export class MailchipModule {
  static forRoot(options: {
    apiKey: string;
    senderEmail: string;
    senderName: string;
  }): DynamicModule {
    const { apiKey, senderEmail, senderName } = options;
    return {
      module: MailchipModule,
      providers: [
        { provide: API_KEY, useValue: apiKey },
        { provide: SENDER_EMAIL, useValue: senderEmail },
        { provide: SENDER_NAME, useValue: senderName },
        MailchipService,
      ],

      exports: [MailchipService],
    };
  }
}
