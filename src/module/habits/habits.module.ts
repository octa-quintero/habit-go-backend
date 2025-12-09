import { Module } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habit } from './entities/habit.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Habit]), ConfigModule],
  controllers: [HabitsController],
  providers: [HabitsService],
  exports: [TypeOrmModule],
})
export class HabitsModule {}
