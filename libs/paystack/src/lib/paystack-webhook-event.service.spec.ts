import { Test, TestingModule } from '@nestjs/testing';
import { PaystackWebhookEventService } from './paystack-webhook-event.service';

describe('PaystackWebhookEventService', () => {
  let service: PaystackWebhookEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaystackWebhookEventService],
    }).compile();

    service = module.get<PaystackWebhookEventService>(PaystackWebhookEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
