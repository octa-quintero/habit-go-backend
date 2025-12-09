import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitRegisterService } from './habit-register.service';
import { HabitRegisterController } from './habit-register.controller';
import { HabitRegister } from './entities/habit-register.entity';
import { Habit } from '../habits/entities/habit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HabitRegister, Habit])],
  controllers: [HabitRegisterController],
  providers: [HabitRegisterService],
  exports: [TypeOrmModule],
})
export class HabitRegisterModule {}
