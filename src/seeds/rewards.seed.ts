import { DataSource } from 'typeorm';
import { Reward } from '../module/reward/entities/reward.entity';
import { RewardType } from '../module/reward/enums/rewards-type.enum';
import { RewardTier } from '../module/reward/enums/rewards-tier.enum';

export async function seedRewards(dataSource: DataSource) {
  const rewardRepository = dataSource.getRepository(Reward);

  const rewards = [
    // ========================================
    // RACHAS (STREAK)
    // ========================================
    
    // STARTER
    {
      code: 'streak_1_starter',
      name: 'Primer Paso',
      description: 'Completa tu primer día de hábito',
      type: RewardType.STREAK,
      tier: RewardTier.STARTER,
      icon: '10', // Carpeta de la gema
      requirement: 1,
      orderIndex: 1,
    },
    
    // COMMON
    {
      code: 'streak_3_common',
      name: 'Arranque',
      description: 'Mantén un hábito por 3 días consecutivos',
      type: RewardType.STREAK,
      tier: RewardTier.COMMON,
      icon: '9',
      requirement: 3,
      orderIndex: 2,
    },
    
    // UNCOMMON
    {
      code: 'streak_7_uncommon',
      name: 'Semana Completa',
      description: 'Mantén un hábito por 7 días consecutivos',
      type: RewardType.STREAK,
      tier: RewardTier.UNCOMMON,
      icon: '8',
      requirement: 7,
      orderIndex: 3,
    },
    
    // RARE
    {
      code: 'streak_14_rare',
      name: 'Dos Semanas',
      description: 'Mantén un hábito por 14 días consecutivos',
      type: RewardType.STREAK,
      tier: RewardTier.RARE,
      icon: '7',
      requirement: 14,
      orderIndex: 4,
    },
    
    // RARE_PLUS
    {
      code: 'streak_21_rare_plus',
      name: 'Hábito Formado',
      description: 'Mantén un hábito por 21 días consecutivos',
      type: RewardType.STREAK,
      tier: RewardTier.RARE_PLUS,
      icon: '6',
      requirement: 21,
      orderIndex: 5,
    },
    
    // EPIC
    {
      code: 'streak_30_epic',
      name: 'Mes de Hierro',
      description: 'Mantén un hábito por 30 días consecutivos',
      type: RewardType.STREAK,
      tier: RewardTier.EPIC,
      icon: '5',
      requirement: 30,
      orderIndex: 6,
    },
    
    // EPIC_PLUS
    {
      code: 'streak_60_epic_plus',
      name: 'Bimestre Perfecto',
      description: 'Mantén un hábito por 60 días consecutivos',
      type: RewardType.STREAK,
      tier: RewardTier.EPIC_PLUS,
      icon: '4',
      requirement: 60,
      orderIndex: 7,
    },
    
    // LEGENDARY
    {
      code: 'streak_100_legendary',
      name: 'Centenario',
      description: 'Mantén un hábito por 100 días consecutivos',
      type: RewardType.STREAK,
      tier: RewardTier.LEGENDARY,
      icon: '3',
      requirement: 100,
      orderIndex: 8,
    },
    
    // MYTHIC
    {
      code: 'streak_200_mythic',
      name: 'Bicentenario',
      description: 'Mantén un hábito por 200 días consecutivos',
      type: RewardType.STREAK,
      tier: RewardTier.MYTHIC,
      icon: '2',
      requirement: 200,
      orderIndex: 9,
    },
    
    // ULTIMATE
    {
      code: 'streak_365_ultimate',
      name: 'Año Perfecto',
      description: 'Mantén un hábito por 365 días consecutivos',
      type: RewardType.STREAK,
      tier: RewardTier.ULTIMATE,
      icon: '1',
      requirement: 365,
      orderIndex: 10,
    },

    // ========================================
    // HÁBITOS CREADOS (HABIT_COUNT)
    // ========================================
    
    // STARTER
    {
      code: 'habit_1_starter',
      name: 'Primer Hábito',
      description: 'Crea tu primer hábito',
      type: RewardType.HABIT_COUNT,
      tier: RewardTier.STARTER,
      icon: '10',
      requirement: 1,
      orderIndex: 11,
    },
    
    // COMMON
    {
      code: 'habit_2_common',
      name: 'Doble Compromiso',
      description: 'Crea 2 hábitos',
      type: RewardType.HABIT_COUNT,
      tier: RewardTier.COMMON,
      icon: '9',
      requirement: 2,
      orderIndex: 12,
    },
    
    // UNCOMMON
    {
      code: 'habit_3_uncommon',
      name: 'Diversificación',
      description: 'Crea 3 hábitos',
      type: RewardType.HABIT_COUNT,
      tier: RewardTier.UNCOMMON,
      icon: '8',
      requirement: 3,
      orderIndex: 13,
    },
    
    // RARE
    {
      code: 'habit_4_rare',
      name: 'Cuatro Pilares',
      description: 'Crea 4 hábitos',
      type: RewardType.HABIT_COUNT,
      tier: RewardTier.RARE,
      icon: '7',
      requirement: 4,
      orderIndex: 14,
    },
    
    // RARE_PLUS
    {
      code: 'habit_5_rare_plus',
      name: 'Cinco Fuerzas',
      description: 'Crea 5 hábitos',
      type: RewardType.HABIT_COUNT,
      tier: RewardTier.RARE_PLUS,
      icon: '6',
      requirement: 5,
      orderIndex: 15,
    },
    
    // EPIC
    {
      code: 'habit_7_epic',
      name: 'Semana de Hábitos',
      description: 'Crea 7 hábitos',
      type: RewardType.HABIT_COUNT,
      tier: RewardTier.EPIC,
      icon: '5',
      requirement: 7,
      orderIndex: 16,
    },
    
    // EPIC_PLUS
    {
      code: 'habit_8_epic_plus',
      name: 'Octágono Perfecto',
      description: 'Crea 8 hábitos',
      type: RewardType.HABIT_COUNT,
      tier: RewardTier.EPIC_PLUS,
      icon: '4',
      requirement: 8,
      orderIndex: 17,
    },
    
    // LEGENDARY
    {
      code: 'habit_10_legendary',
      name: 'Decálogo',
      description: 'Crea 10 hábitos',
      type: RewardType.HABIT_COUNT,
      tier: RewardTier.LEGENDARY,
      icon: '3',
      requirement: 10,
      orderIndex: 18,
    },
    
    // MYTHIC
    {
      code: 'habit_12_mythic',
      name: 'Doce Meses',
      description: 'Crea 12 hábitos',
      type: RewardType.HABIT_COUNT,
      tier: RewardTier.MYTHIC,
      icon: '2',
      requirement: 12,
      orderIndex: 19,
    },
    
    // ULTIMATE
    {
      code: 'habit_15_ultimate',
      name: 'Maestro de Hábitos',
      description: 'Crea 15 hábitos',
      type: RewardType.HABIT_COUNT,
      tier: RewardTier.ULTIMATE,
      icon: '1',
      requirement: 15,
      orderIndex: 20,
    },

    // ========================================
    // COMPLETACIONES TOTALES (TOTAL_COMPLETIONS)
    // ========================================
    
    // STARTER
    {
      code: 'completion_1_starter',
      name: 'Primera Vez',
      description: 'Completa tu primera tarea',
      type: RewardType.TOTAL_COMPLETIONS,
      tier: RewardTier.STARTER,
      icon: '10',
      requirement: 1,
      orderIndex: 21,
    },
    
    // COMMON
    {
      code: 'completion_5_common',
      name: 'Cinco Veces',
      description: 'Completa 5 tareas',
      type: RewardType.TOTAL_COMPLETIONS,
      tier: RewardTier.COMMON,
      icon: '9',
      requirement: 5,
      orderIndex: 22,
    },
    
    // UNCOMMON
    {
      code: 'completion_10_uncommon',
      name: 'Decena',
      description: 'Completa 10 tareas',
      type: RewardType.TOTAL_COMPLETIONS,
      tier: RewardTier.UNCOMMON,
      icon: '8',
      requirement: 10,
      orderIndex: 23,
    },
    
    // RARE
    {
      code: 'completion_25_rare',
      name: 'Veinticinco',
      description: 'Completa 25 tareas',
      type: RewardType.TOTAL_COMPLETIONS,
      tier: RewardTier.RARE,
      icon: '7',
      requirement: 25,
      orderIndex: 24,
    },
    
    // RARE_PLUS
    {
      code: 'completion_50_rare_plus',
      name: 'Medio Centenar',
      description: 'Completa 50 tareas',
      type: RewardType.TOTAL_COMPLETIONS,
      tier: RewardTier.RARE_PLUS,
      icon: '6',
      requirement: 50,
      orderIndex: 25,
    },
    
    // EPIC
    {
      code: 'completion_100_epic',
      name: 'Centenar',
      description: 'Completa 100 tareas',
      type: RewardType.TOTAL_COMPLETIONS,
      tier: RewardTier.EPIC,
      icon: '5',
      requirement: 100,
      orderIndex: 26,
    },
    
    // EPIC_PLUS
    {
      code: 'completion_200_epic_plus',
      name: 'Bicentenario',
      description: 'Completa 200 tareas',
      type: RewardType.TOTAL_COMPLETIONS,
      tier: RewardTier.EPIC_PLUS,
      icon: '4',
      requirement: 200,
      orderIndex: 27,
    },
    
    // LEGENDARY
    {
      code: 'completion_365_legendary',
      name: 'Año de Compromiso',
      description: 'Completa 365 tareas',
      type: RewardType.TOTAL_COMPLETIONS,
      tier: RewardTier.LEGENDARY,
      icon: '3',
      requirement: 365,
      orderIndex: 28,
    },
    
    // MYTHIC
    {
      code: 'completion_500_mythic',
      name: 'Medio Millar',
      description: 'Completa 500 tareas',
      type: RewardType.TOTAL_COMPLETIONS,
      tier: RewardTier.MYTHIC,
      icon: '2',
      requirement: 500,
      orderIndex: 29,
    },
    
    // ULTIMATE
    {
      code: 'completion_1000_ultimate',
      name: 'Millar Perfecto',
      description: 'Completa 1000 tareas',
      type: RewardType.TOTAL_COMPLETIONS,
      tier: RewardTier.ULTIMATE,
      icon: '1',
      requirement: 1000,
      orderIndex: 30,
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
