import { Test } from '@nestjs/testing';
import { MailchimpService } from './mailchimp.service';

describe('MailchimpService', () => {
  let service: MailchimpService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MailchimpService],
    }).compile();

    service = module.get(MailchimpService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
