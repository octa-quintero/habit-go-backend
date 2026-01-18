import { Module } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habit } from './entities/habit.entity';
import { HabitRegister } from '../habit-register/entities/habit-register.entity';
import { UserReward } from '../reward/entities/user-reward.entity';
import { ConfigModule } from '@nestjs/config';
import { OwnershipGuard } from '../../common/guards/ownership/ownership.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Habit, HabitRegister, UserReward]),
    ConfigModule,
  ],
  controllers: [HabitsController],
  providers: [HabitsService, OwnershipGuard],
  exports: [TypeOrmModule],
})
export class HabitsModule {}
