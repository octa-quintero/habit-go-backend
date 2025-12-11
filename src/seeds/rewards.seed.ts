import { DataSource } from 'typeorm';
import { Reward } from '../module/reward/entities/reward.entity';
import { RewardType } from '../module/reward/enums/rewards-type.enum';
import { RewardTier } from '../module/reward/enums/rewards-tier.enum';

export async function seedRewards(dataSource: DataSource) {
  const rewardRepository = dataSource.getRepository(Reward);

  const rewards = [
    {
      code: 'streak_7',
      name: 'Semana Completa',
      description: 'Completa un hábito 7 días seguidos',
      type: RewardType.STREAK,
      tier: RewardTier.COMMON,
      icon: '🔥',
      requirement: 7,
      orderIndex: 1,
    },
    {
      code: 'streak_30',
      name: 'Mes Completo',
      description: 'Completa un hábito 30 días seguidos',
      type: RewardType.STREAK,
      tier: RewardTier.RARE,
      icon: '💪',
      requirement: 30,
      orderIndex: 2,
    },
    {
      code: 'streak_100',
      name: 'Centenario',
      description: 'Completa un hábito 100 días seguidos',
      type: RewardType.STREAK,
      tier: RewardTier.EPIC,
      icon: '⭐',
      requirement: 100,
      orderIndex: 3,
    },
    {
      code: 'streak_365',
      name: 'Año Completo',
      description: 'Completa un hábito 365 días seguidos',
      type: RewardType.STREAK,
      tier: RewardTier.LEGENDARY,
      icon: '🏆',
      requirement: 365,
      orderIndex: 4,
    },

    {
      code: 'habit_count_1',
      name: 'Primer Paso',
      description: 'Crea tu primer hábito',
      type: RewardType.HABIT_COUNT,
      tier: RewardTier.COMMON,
      icon: '🎯',
      requirement: 1,
      orderIndex: 5,
    },
    {
      code: 'habit_count_5',
      name: 'Coleccionista',
      description: 'Crea 5 hábitos',
      type: RewardType.HABIT_COUNT,
      tier: RewardTier.UNCOMMON,
      icon: '📚',
      requirement: 5,
      orderIndex: 6,
    },
    {
      code: 'habit_count_10',
      name: 'Maestro de Hábitos',
      description: 'Crea 10 hábitos',
      type: RewardType.HABIT_COUNT,
      tier: RewardTier.RARE,
      icon: '👑',
      requirement: 10,
      orderIndex: 7,
    },

    // Insignias de completados totales
    {
      code: 'total_50',
      name: 'Principiante',
      description: 'Completa 50 hábitos en total',
      type: RewardType.TOTAL_COMPLETIONS,
      tier: RewardTier.COMMON,
      icon: '🌱',
      requirement: 50,
      orderIndex: 8,
    },
    {
      code: 'total_100',
      name: 'Comprometido',
      description: 'Completa 100 hábitos en total',
      type: RewardType.TOTAL_COMPLETIONS,
      tier: RewardTier.UNCOMMON,
      icon: '🚀',
      requirement: 100,
      orderIndex: 9,
    },
    {
      code: 'total_500',
      name: 'Imparable',
      description: 'Completa 500 hábitos en total',
      type: RewardType.TOTAL_COMPLETIONS,
      tier: RewardTier.EPIC,
      icon: '💎',
      requirement: 500,
      orderIndex: 10,
    },
  ];

  let created = 0;
  let skipped = 0;

  for (const rewardData of rewards) {
    const exists = await rewardRepository.findOne({
      where: { code: rewardData.code },
    });

    if (!exists) {
      const reward = rewardRepository.create(rewardData);
      await rewardRepository.save(reward);
      console.log(`✅ Insignia creada: ${rewardData.name}`);
      created++;
    } else {
      console.log(`⏭️  Ya existe: ${rewardData.name}`);
      skipped++;
    }
  }

  console.log(
    `\n🎉 Seeds completados: ${created} creadas, ${skipped} omitidas`,
  );
}
