import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habit } from '../habits/entities/habit.entity';
import { HabitRegister } from './entities/habit-register.entity';
import { CreateHabitRegisterDto } from './dto/create-habit-register.dto';
import { RewardService } from '../reward/reward.service';

@Injectable()
export class HabitRegisterService {
  constructor(
    @InjectRepository(HabitRegister)
    private readonly habitRegisterRepository: Repository<HabitRegister>,
    @InjectRepository(Habit)
    private readonly habitRepository: Repository<Habit>,
    private readonly rewardService: RewardService,
  ) {}

  private async updateStreak(habitId: string) {
    const habit = await this.habitRepository.findOne({
      where: { id: habitId },
    });

    if (!habit) return;

    // Obtener registros ordenados por fecha descendente
    const registers = await this.habitRegisterRepository.find({
      where: { habit: { id: habitId }, completed: true },
      order: { date: 'DESC' },
    });

    if (registers.length === 0) return;

    // Calcular streak actual
    let currentStreak = 0;

    for (let i = 0; i < registers.length; i++) {
      const registerDate = registers[i].date;
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      const expectedDateStr = expectedDate.toISOString().split('T')[0];

      if (registerDate === expectedDateStr) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Actualizar hábito
    habit.streak = currentStreak;
    habit.longestStreak = Math.max(habit.longestStreak, currentStreak);

    await this.habitRepository.save(habit);
  }

  async markAsCompleted(
    createHabitRegisterDto: CreateHabitRegisterDto,
    userId: string,
  ) {
    const { habitId } = createHabitRegisterDto;

    // Verificar que el hábito existe y pertenece al usuario
    const habit = await this.habitRepository.findOne({
      where: { id: habitId, user: { id: userId }, isActive: true },
    });

    if (!habit) {
      throw new NotFoundException('Hábito no encontrado');
    }

    // Verificar que no se haya completado hoy
    const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

    const existingRegister = await this.habitRegisterRepository.findOne({
      where: {
        habit: { id: habitId },
        date: today,
      },
    });

    if (existingRegister) {
      throw new BadRequestException('Ya completaste este hábito hoy');
    }

    // Crear el registro
    const habitRegister = this.habitRegisterRepository.create({
      habit,
      date: today,
      completed: true,
    });

    await this.habitRegisterRepository.save(habitRegister);

    // Actualizar el streak del hábito
    await this.updateStreak(habitId);

    // Verificar y desbloquear nuevas insignias automáticamente
    const newRewards = await this.rewardService.checkAndUnlockRewards(
      userId,
      habitId,
    );

    return {
      id: habitRegister.id,
      habitId: habitRegister.habit.id,
      date: habitRegister.date,
      completed: habitRegister.completed,
      newRewards: newRewards.length > 0 ? newRewards : undefined,
    };
  }

  async getCompletedHabits(userId: string, habitId?: string) {
    const query = this.habitRegisterRepository
      .createQueryBuilder('register')
      .leftJoinAndSelect('register.habit', 'habit')
      .leftJoinAndSelect('habit.user', 'user')
      .where('user.id = :userId', { userId })
      .orderBy('register.date', 'DESC');

    if (habitId) {
      query.andWhere('habit.id = :habitId', { habitId });
    }

    const registers = await query.getMany();

    return registers.map((register) => ({
      id: register.id,
      habitId: register.habit.id,
      habitTitle: register.habit.title,
      date: register.date,
      completed: register.completed,
    }));
  }

  async getStreakData(habitId: string, userId: string) {
    // Verificar que el hábito pertenece al usuario
    const habit = await this.habitRepository.findOne({
      where: { id: habitId, user: { id: userId } },
    });

    if (!habit) {
      throw new NotFoundException('Hábito no encontrado');
    }

    // Obtener total de completados
    const totalCompletions = await this.habitRegisterRepository.count({
      where: { habit: { id: habitId }, completed: true },
    });

    return {
      habitId: habit.id,
      habitTitle: habit.title,
      currentStreak: habit.streak,
      longestStreak: habit.longestStreak,
      totalCompletions,
    };
  }
}
