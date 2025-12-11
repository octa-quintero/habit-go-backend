import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitRegisterService } from './habit-register.service';
import { HabitRegisterController } from './habit-register.controller';
import { HabitRegister } from './entities/habit-register.entity';
import { Habit } from '../habits/entities/habit.entity';
import { RewardModule } from '../reward/reward.module';

@Module({
  imports: [TypeOrmModule.forFeature([HabitRegister, Habit]), RewardModule],
  controllers: [HabitRegisterController],
  providers: [HabitRegisterService],
  exports: [TypeOrmModule],
})
export class HabitRegisterModule {}
