import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { PaystackWebhookEventService } from './paystack-webhook-event.service';
import { PaystackGuard } from './paystack.guard';
// import { InjectStripeModuleConfig } from './stripe.decorators';
// import { StripeModuleConfig } from './stripe.interfaces';
// import { StripePayloadService } from './stripe.payload.service';
// import { StripeWebhookService } from './stripe.webhook.service';

@Controller('/paystack')
export class PaystackController {
  constructor(
    private readonly stripeWebhookService: PaystackWebhookEventService,
  ) {}

  @Get('/webhook')
  async testWebhook() {
    return `${new Date()} testing Paystack web hook route`;
  }
  @UseGuards(PaystackGuard)
  @Post('/webhook')
  async handleWebhook(@Request() request: Request) {
    // console.log('hey i see u baby', request.body);
    await this.stripeWebhookService.handleWebhook(request.body);
    return {};
  }
}
