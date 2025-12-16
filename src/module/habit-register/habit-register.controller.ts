import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { HabitRegisterService } from './habit-register.service';
import { CreateHabitRegisterDto } from './dto/create-habit-register.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-guards/jwt-auth.guard';
import { EmailVerifiedGuard } from '../../common/guards/email-verified/email-verified.guard';
import { RequireEmailVerification } from '../../common/guards/email-verified/email-verified.decorator';
import { Throttle } from '@nestjs/throttler';
import type { RequestWithUser } from '../habits/interfaces/request-user.interface';

@Controller('habit-register')
@UseGuards(JwtAuthGuard, EmailVerifiedGuard)
@RequireEmailVerification()
export class HabitRegisterController {
  constructor(private readonly habitRegisterService: HabitRegisterService) {}

  @Post()
  @Throttle({ default: { ttl: 60000, limit: 100 } })
  markAsCompleted(
    @Body() createHabitRegisterDto: CreateHabitRegisterDto,
    @Request() req: RequestWithUser,
  ) {
    return this.habitRegisterService.markAsCompleted(
      createHabitRegisterDto,
      req.user.userId,
    );
  }

  @Get()
  getCompletedHabits(@Request() req: RequestWithUser) {
    return this.habitRegisterService.getCompletedHabits(req.user.userId);
  }

  @Get(':habitId')
  getCompletedByHabit(
    @Param('habitId') habitId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.habitRegisterService.getCompletedHabits(
      req.user.userId,
      habitId,
    );
  }

  @Get('streak/:habitId')
  getStreakData(
    @Param('habitId') habitId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.habitRegisterService.getStreakData(habitId, req.user.userId);
  }
}
