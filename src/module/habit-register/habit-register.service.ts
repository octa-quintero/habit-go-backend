import { Injectable, NotFoundException } from '@nestjs/common';
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

    if (registers.length === 0) {
      habit.streak = 0;
      await this.habitRepository.save(habit);
      return;
    }

    // Normalizar fecha actual (medianoche UTC)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Calcular streak actual (días consecutivos desde hoy o ayer)
    let currentStreak = 0;
    const checkDate = new Date(today);

    // Verificar si se completó hoy
    const todayStr = this.formatDate(today);
    const completedToday = registers.some((r) => r.date === todayStr);

    // Si no se completó hoy, empezar desde ayer
    if (!completedToday) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Contar días consecutivos hacia atrás
    for (let i = 0; i < registers.length; i++) {
      const expectedDateStr = this.formatDate(checkDate);
      const registerDate = registers[i].date;

      if (registerDate === expectedDateStr) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (registerDate < expectedDateStr) {
        // Si encontramos una fecha más antigua, el streak se rompió
        break;
      }
      // Si registerDate > expectedDateStr, continuamos buscando
    }

    // Validar que el streak calculado sea correcto
    if (currentStreak < 0) {
      currentStreak = 0;
    }

    // Actualizar hábito
    habit.streak = currentStreak;
    habit.longestStreak = Math.max(habit.longestStreak, currentStreak);

    await this.habitRepository.save(habit);
  }

  private formatDate(date: Date): string {
    // Formatear fecha como YYYY-MM-DD en UTC
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayStr = this.formatDate(today);

    const existingRegister = await this.habitRegisterRepository.findOne({
      where: {
        habit: { id: habitId },
        date: todayStr,
      },
      relations: ['habit'],
    });

    if (existingRegister) {
      // Si ya existe, retornar el registro existente sin error
      return {
        id: existingRegister.id,
        habitId: existingRegister.habit.id,
        date: existingRegister.date,
        completed: existingRegister.completed,
        alreadyCompleted: true,
      };
    }

    // Crear el registro
    const habitRegister = this.habitRegisterRepository.create({
      habit,
      date: todayStr,
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
