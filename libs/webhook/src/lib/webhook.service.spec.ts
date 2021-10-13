import { Test } from '@nestjs/testing';
import { WebhookService } from './webhook.service';

describe('WebhookService', () => {
  let service: WebhookService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [WebhookService],
    }).compile();

    service = module.get(WebhookService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
