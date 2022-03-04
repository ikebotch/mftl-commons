import { Test } from '@nestjs/testing';
import { MailchipService } from './mailchip.service';

describe('MailchipService', () => {
  let service: MailchipService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MailchipService],
    }).compile();

    service = module.get(MailchipService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
