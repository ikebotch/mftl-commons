import { Module, Global, DynamicModule } from '@nestjs/common';
import { API_KEY, SENDER_EMAIL, SENDER_NAME } from './mailchimp.config';
import { MailchimpService } from './mailchimp.service';

@Global()
@Module({})
export class MailchimpModule {
  static forRoot(options: {
    apiKey: string;
    senderEmail: string;
    senderName: string;
  }): DynamicModule {
    const { apiKey, senderEmail, senderName } = options;
    return {
      module: MailchimpModule,
      providers: [
        { provide: API_KEY, useValue: apiKey },
        { provide: SENDER_EMAIL, useValue: senderEmail },
        { provide: SENDER_NAME, useValue: senderName },
        MailchimpService,
      ],

      exports: [MailchimpService],
    };
  }
}
