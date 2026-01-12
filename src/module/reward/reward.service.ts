import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Reward, RewardType } from './entities/reward.entity';
import { UserReward } from './entities/user-reward.entity';
import { Habit } from '../habits/entities/habit.entity';
import { HabitRegister } from '../habit-register/entities/habit-register.entity';

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(Reward)
    private readonly rewardRepository: Repository<Reward>,
    @InjectRepository(UserReward)
    private readonly userRewardRepository: Repository<UserReward>,
    @InjectRepository(Habit)
    private readonly habitRepository: Repository<Habit>,
    @InjectRepository(HabitRegister)
    private readonly habitRegisterRepository: Repository<HabitRegister>,
  ) {}

  // Obtener todas las insignias disponibles
  async getAllRewards() {
    return this.rewardRepository.find({
      where: { isActive: true },
      order: { orderIndex: 'ASC' },
    });
  }

  // Obtener insignias del usuario con su progreso
  async getUserRewards(userId: string) {
    const earnedRewards = await this.userRewardRepository.find({
      where: { user: { id: userId } },
      relations: ['reward'],
    });

    // Agrupar por rewardId y contar ocurrencias
    const rewardCountMap = new Map<string, { reward: any; count: number; earnedAt: Date }>();
    
    earnedRewards.forEach((userReward) => {
      const rewardId = userReward.reward.id;
      if (rewardCountMap.has(rewardId)) {
        const existing = rewardCountMap.get(rewardId)!;
        existing.count += 1;
      } else {
        rewardCountMap.set(rewardId, {
          reward: userReward.reward,
          count: 1,
          earnedAt: userReward.earnedAt,
        });
      }
    });

    // Convertir a array con contador
    return Array.from(rewardCountMap.values()).map(({ reward, count, earnedAt }) => ({
      ...reward,
      count,
      earnedAt,
    }));
  }

  // Verificar y desbloquear nuevas insignias
  async checkAndUnlockRewards(userId: string, habitId?: string) {
    const newRewards: UserReward[] = [];

    // Verificar insignias de rachas
    await this.checkStreakRewards(userId, habitId, newRewards);

    // Verificar insignias de cantidad de hábitos
    await this.checkHabitCountRewards(userId, newRewards);

    // Verificar insignias de completados totales
    await this.checkTotalCompletionsRewards(userId, newRewards);

    return newRewards.map((ur) => ({
      id: ur.id,
      rewardId: ur.reward.id,
      rewardName: ur.reward.name,
      rewardIcon: ur.reward.icon,
      rewardTier: ur.reward.tier,
      earnedAt: ur.earnedAt,
      viewed: ur.viewed,
    }));
  }

  private async checkStreakRewards(
    userId: string,
    habitId: string | undefined,
    newRewards: UserReward[],
  ) {
    // Obtener todos los hábitos del usuario
    const habits = await this.habitRepository.find({
      where: { user: { id: userId } },
    });

    // Calcular el streak máximo del usuario
    let maxStreak = 0;
    for (const habit of habits) {
      if (habit.streak > maxStreak) {
        maxStreak = habit.streak;
      }
    }

    // Obtener todas las recompensas de streak
    const streakRewards = await this.rewardRepository.find({
      where: { type: RewardType.STREAK, isActive: true },
    });

    // Verificar cada recompensa de streak
    for (const reward of streakRewards) {
      if (maxStreak >= reward.requirement) {
        // Contar cuántas veces ya se obtuvo esta recompensa
        const earnedCount = await this.userRewardRepository.count({
          where: {
            user: { id: userId },
            reward: { id: reward.id },
          },
        });

        // Permitir obtener la misma gema múltiples veces (sin límite)
        // Solo agregar si el streak alcanza el requisito
        const userReward = this.userRewardRepository.create({
          user: { id: userId } as any,
          reward,
          viewed: false,
        });
        const saved = await this.userRewardRepository.save(userReward);
        newRewards.push(saved);
      }
    }
  }

  private async checkHabitCountRewards(
    userId: string,
    newRewards: UserReward[],
  ) {
    const habitCount = await this.habitRepository.count({
      where: { user: { id: userId }, isActive: true },
    });

    const habitCountRewards = await this.rewardRepository.find({
      where: { type: RewardType.HABIT_COUNT, isActive: true },
    });

    for (const reward of habitCountRewards) {
      if (habitCount >= reward.requirement) {
        const alreadyEarned = await this.userRewardRepository.findOne({
          where: {
            user: { id: userId },
            reward: { id: reward.id },
          },
        });

        if (!alreadyEarned) {
          const userReward = this.userRewardRepository.create({
            user: { id: userId } as any,
            reward,
            viewed: false,
          });
          const saved = await this.userRewardRepository.save(userReward);
          newRewards.push(saved);
        }
      }
    }
  }

  private async checkTotalCompletionsRewards(
    userId: string,
    newRewards: UserReward[],
  ) {
    const totalCompletions = await this.habitRegisterRepository.count({
      where: {
        habit: { user: { id: userId } },
        completed: true,
      },
    });

    const completionRewards = await this.rewardRepository.find({
      where: { type: RewardType.TOTAL_COMPLETIONS, isActive: true },
    });

    for (const reward of completionRewards) {
      if (totalCompletions >= reward.requirement) {
        const alreadyEarned = await this.userRewardRepository.findOne({
          where: {
            user: { id: userId },
            reward: { id: reward.id },
          },
        });

        if (!alreadyEarned) {
          const userReward = this.userRewardRepository.create({
            user: { id: userId } as any,
            reward,
            viewed: false,
          });
          const saved = await this.userRewardRepository.save(userReward);
          newRewards.push(saved);
        }
      }
    }
  }

  // Marcar insignias como vistas
  async markRewardsAsViewed(userId: string, rewardIds: string[]) {
    await this.userRewardRepository.update(
      {
        user: { id: userId },
        id: In(rewardIds),
      },
      { viewed: true },
    );

    return { success: true, message: 'Insignias marcadas como vistas' };
  }
}
