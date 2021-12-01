import { Test } from '@nestjs/testing';
import { TenancyService } from './tenancy.service';

describe('TenancyService', () => {
  let service: TenancyService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TenancyService],
    }).compile();

    service = module.get(TenancyService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
