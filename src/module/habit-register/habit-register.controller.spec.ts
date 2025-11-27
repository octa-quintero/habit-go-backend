import { Test, TestingModule } from '@nestjs/testing';
import { HabitRegisterController } from './habit-register.controller';
import { HabitRegisterService } from './habit-register.service';

describe('HabitRegisterController', () => {
  let controller: HabitRegisterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HabitRegisterController],
      providers: [HabitRegisterService],
    }).compile();

    controller = module.get<HabitRegisterController>(HabitRegisterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
