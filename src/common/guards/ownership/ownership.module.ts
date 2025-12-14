import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnershipGuard } from './ownership.guard';
import { Habit } from '../../../module/habits/entities/habit.entity';
import { HabitRegister } from '../../../module/habit-register/entities/habit-register.entity';
import { UserReward } from '../../../module/reward/entities/user-reward.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Habit, HabitRegister, UserReward])],
  providers: [OwnershipGuard],
  exports: [OwnershipGuard, TypeOrmModule],
})
export class OwnershipModule {}
