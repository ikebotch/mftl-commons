import { makeInjectableDecorator } from '@golevelup/nestjs-common';
import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import {
  PAYSTACK_CONFIG_MODULE_OPTIONS,
  PAYSTACK_WEBHOOK_HANDLER,
} from '../paystack.config';
import { PaystackInterface } from '../paystack.interface';

export const PaystackEvent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.body;
  },
);

export const PaystackWebhookHandler = (
  eventType: PaystackInterface.WebHookEvent,
) => SetMetadata(PAYSTACK_WEBHOOK_HANDLER, eventType);

export const InjectPaystackModuleConfig = makeInjectableDecorator(
  PAYSTACK_CONFIG_MODULE_OPTIONS,
);
