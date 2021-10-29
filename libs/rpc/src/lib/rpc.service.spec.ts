import { Test } from '@nestjs/testing';
import { RpcService } from './rpc.service';

describe('RpcService', () => {
  let service: RpcService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [RpcService],
    }).compile();

    service = module.get(RpcService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
