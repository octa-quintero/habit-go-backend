import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { Reward } from './entities/reward.entity';
import { UserReward } from './entities/user-reward.entity';
import { Habit } from '../habits/entities/habit.entity';
import { HabitRegister } from '../habit-register/entities/habit-register.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reward, UserReward, Habit, HabitRegister]),
  ],
  controllers: [RewardController],
  providers: [RewardService],
  exports: [TypeOrmModule, RewardService],
})
export class RewardModule {}
