import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { RequestWithUser } from './interfaces/request-user.interface';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-guards/jwt-auth.guard';
import { EmailVerifiedGuard } from '../../common/guards/email-verified/email-verified.guard';
import { OwnershipGuard } from '../../common/guards/ownership/ownership.guard';
import { RequireEmailVerification } from '../../common/guards/email-verified/email-verified.decorator';
import { CheckOwnership } from '../../common/guards/ownership/ownership.decorator';
import { UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

@UseGuards(JwtAuthGuard, EmailVerifiedGuard)
@RequireEmailVerification()
@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  @Throttle({ default: { ttl: 60000, limit: 20 } })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req: RequestWithUser,
    @Body() createHabitDto: CreateHabitDto,
  ) {
    const userId = req.user.userId;
    return this.habitsService.createHabit(userId, createHabitDto);
  }

  @Get()
  async findAll(@Request() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.habitsService.findAllHabits(userId);
  }

  @Get(':id')
  @UseGuards(OwnershipGuard)
  @CheckOwnership({ entity: 'habit', paramName: 'id' })
  async findOne(@Param('id') id: string) {
    return this.habitsService.findOneHabit(id);
  }

  @Patch(':id')
  @UseGuards(OwnershipGuard)
  @CheckOwnership({ entity: 'habit', paramName: 'id' })
  async update(
    @Param('id') id: string,
    @Body() updateHabitDto: UpdateHabitDto,
  ) {
    return this.habitsService.updateHabit(id, updateHabitDto);
  }

  @Delete(':id')
  @UseGuards(OwnershipGuard)
  @CheckOwnership({ entity: 'habit', paramName: 'id' })
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.habitsService.softDeleteHabit(id);
  }

  @Patch(':id/restore')
  @UseGuards(OwnershipGuard)
  @CheckOwnership({ entity: 'habit', paramName: 'id' })
  async restore(@Param('id') id: string) {
    return this.habitsService.restoreHabit(id);
  }

  @Get(':id/stats')
  @UseGuards(OwnershipGuard)
  @CheckOwnership({ entity: 'habit', paramName: 'id' })
  async getStats(@Param('id') id: string) {
    return this.habitsService.getHabitStats(id);
  }
}
