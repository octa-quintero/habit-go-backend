import { Module } from '@nestjs/common';
import { HabitRegisterService } from './habit-register.service';
import { HabitRegisterController } from './habit-register.controller';

@Module({
  controllers: [HabitRegisterController],
  providers: [HabitRegisterService],
})
export class HabitRegisterModule {}
