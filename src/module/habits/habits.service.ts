import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHabitDto } from './dto/create-habit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habit } from './entities/habit.entity';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitRepository: Repository<Habit>,
  ) {}
  async createHabit(
    userId: string,
    createHabitDto: CreateHabitDto,
  ): Promise<Habit> {
    try {
      const habit = this.habitRepository.create({
        ...createHabitDto,
        user: { id: userId },
      });
      return await this.habitRepository.save(habit);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException(
        'Error al crear el hábito',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllHabits(userId: string): Promise<Habit[]> {
    try {
      const habits = await this.habitRepository.find({
        where: {
          user: { id: userId },
          isActive: true,
        },
        order: { createdAt: 'DESC' },
      });
      return habits;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException(
        'Error al obtener los hábitos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
