import { Test, TestingModule } from '@nestjs/testing';
import { HabitRegisterService } from './habit-register.service';

describe('HabitRegisterService', () => {
  let service: HabitRegisterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HabitRegisterService],
    }).compile();

    service = module.get<HabitRegisterService>(HabitRegisterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

// asdasd
