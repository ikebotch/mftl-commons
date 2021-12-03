import { Injectable, SetMetadata } from '@nestjs/common';
import { PAYSTACK_WEBHOOK_SERVICE } from './paystack.config';

@Injectable()
@SetMetadata(PAYSTACK_WEBHOOK_SERVICE, true)
export class PaystackWebhookEventService {
  public handleWebhook(evt: any): any {
    // The implementation for this method is overriden by the containing module
    console.log(evt);
  }
}
