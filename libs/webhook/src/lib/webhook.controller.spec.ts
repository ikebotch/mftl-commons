import { Test } from '@nestjs/testing';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

describe('WebhookController', () => {
  let controller: WebhookController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [WebhookService],
      controllers: [WebhookController],
    }).compile();

    controller = module.get(WebhookController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
