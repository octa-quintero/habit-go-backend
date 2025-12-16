import { Module } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habit } from './entities/habit.entity';
import { ConfigModule } from '@nestjs/config';
import { OwnershipModule } from '../../common/guards/ownership/ownership.module';

@Module({
  imports: [TypeOrmModule.forFeature([Habit]), ConfigModule, OwnershipModule],
  controllers: [HabitsController],
  providers: [HabitsService],
  exports: [TypeOrmModule],
})
export class HabitsModule {}
