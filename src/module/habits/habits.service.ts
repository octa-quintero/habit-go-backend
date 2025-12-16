import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHabitDto } from './dto/create-habit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habit } from './entities/habit.entity';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { HabitStats } from './interfaces/habit-stats.interface';

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

  async findOneHabit(habitId: string): Promise<Habit> {
    try {
      const habit = await this.habitRepository.findOne({
        where: { id: habitId },
        relations: ['registers'],
      });

      if (!habit) {
        throw new HttpException('Hábito no encontrado', HttpStatus.NOT_FOUND);
      }

      return habit;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al obtener el hábito',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateHabit(
    habitId: string,
    updateHabitDto: UpdateHabitDto,
  ): Promise<Habit> {
    try {
      const habit = await this.habitRepository.findOne({
        where: { id: habitId },
      });

      if (!habit) {
        throw new HttpException('Hábito no encontrado', HttpStatus.NOT_FOUND);
      }

      const updatedHabit = this.habitRepository.merge(habit, updateHabitDto);

      return await this.habitRepository.save(updatedHabit);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error actualizando hábito:', error);
      throw new HttpException(
        'Error al actualizar el hábito',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async softDeleteHabit(habitId: string): Promise<Habit> {
    try {
      const habit = await this.habitRepository.findOne({
        where: { id: habitId },
      });

      if (!habit) {
        throw new HttpException('Hábito no encontrado', HttpStatus.NOT_FOUND);
      }

      if (!habit.isActive) {
        throw new HttpException(
          'El hábito ya está desactivado',
          HttpStatus.BAD_REQUEST,
        );
      }

      habit.isActive = false;
      return await this.habitRepository.save(habit);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al desactivar el hábito',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async restoreHabit(habitId: string): Promise<Habit> {
    try {
      const habit = await this.habitRepository.findOne({
        where: {
          id: habitId,
          isActive: false, // Solo busca desactivados
        },
      });

      if (!habit) {
        throw new HttpException(
          'Hábito desactivado no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      habit.isActive = true;
      return await this.habitRepository.save(habit);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al restaurar el hábito',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getHabitStats(habitId: string): Promise<HabitStats> {
    try {
      const habit = await this.habitRepository.findOne({
        where: { id: habitId },
        relations: ['registers'],
      });

      if (!habit) {
        throw new HttpException('Hábito no encontrado', HttpStatus.NOT_FOUND);
      }

      // Calcular estadísticas
      const completedRegisters = habit.registers.filter((r) => r.completed);
      const totalDays = habit.registers.length;
      const completedDays = completedRegisters.length;
      const completionRate =
        totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

      return {
        totalDays,
        completedDays,
        completionRate,
        currentStreak: habit.streak,
        longestStreak: habit.longestStreak,
        lastCompletedDate: habit.lastCompletedDate
          ? habit.lastCompletedDate.toISOString().split('T')[0]
          : null,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al obtener estadísticas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
