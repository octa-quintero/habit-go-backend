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
import { OwnershipGuard } from '../../common/guards/ownership/ownership.guard';
import { CheckOwnership } from '../../common/guards/ownership/ownership.decorator';
import { UseGuards } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
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
  async findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.habitsService.findOneHabit(userId, id);
  }

  @Patch(':id')
  @UseGuards(OwnershipGuard)
  @CheckOwnership({ entity: 'habit', paramName: 'id' })
  async update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateHabitDto: UpdateHabitDto,
  ) {
    const userId = req.user.userId;
    return this.habitsService.updateHabit(userId, id, updateHabitDto);
  }

  @Delete(':id')
  @UseGuards(OwnershipGuard)
  @CheckOwnership({ entity: 'habit', paramName: 'id' })
  @HttpCode(HttpStatus.OK)
  async remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.habitsService.softDeleteHabit(userId, id);
  }

  @Patch(':id/restore')
  async restore(@Request() req: RequestWithUser, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.habitsService.restoreHabit(userId, id);
  }

  @Get(':id/stats')
  async getStats(@Request() req: RequestWithUser, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.habitsService.getHabitStats(userId, id);
  }
}
