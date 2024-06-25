import { Test, TestingModule } from '@nestjs/testing';
import { LamdaService } from './lamda.service';

describe('LamdaService', () => {
  let service: LamdaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LamdaService],
    }).compile();

    service = module.get<LamdaService>(LamdaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
