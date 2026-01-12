import { DataSource } from 'typeorm';
import { Reward } from '../module/reward/entities/reward.entity';
import { RewardType } from '../module/reward/enums/rewards-type.enum';
import { RewardTier } from '../module/reward/enums/rewards-tier.enum';

export async function seedRewards(dataSource: DataSource) {
  const rewardRepository = dataSource.getRepository(Reward);

  // Eliminar todas las recompensas antiguas (y las relaciones en user_rewards con CASCADE)
  console.log('🗑️  Eliminando recompensas antiguas y relaciones...');
  await dataSource.query('TRUNCATE TABLE "user_rewards" CASCADE');
  await dataSource.query('TRUNCATE TABLE "rewards" CASCADE');
  console.log('✅ Tablas limpiadas');

  const rewards = [
    // ========================================
    // MES 1: GEMAS BÁSICAS (Variant 3)
    // Días 1-30: Una gema cada 3 días
    // ========================================
    
    {
      code: 'streak_day_3_gem10_v3',
      name: '🔥 Tres Días',
      description: '¡Primera gema conseguida!',
      type: RewardType.STREAK,
      tier: RewardTier.STARTER,
      icon: '10',
      variant: 3,
      requirement: 3,
      orderIndex: 1,
    },
    {
      code: 'streak_day_6_gem9_v3',
      name: '🔥 Seis Días',
      description: '¡Segunda gema desbloqueada!',
      type: RewardType.STREAK,
      tier: RewardTier.COMMON,
      icon: '9',
      variant: 3,
      requirement: 6,
      orderIndex: 2,
    },
    {
      code: 'streak_day_9_gem8_v3',
      name: '🔥 Nueve Días',
      description: '¡Tercera gema en tu poder!',
      type: RewardType.STREAK,
      tier: RewardTier.UNCOMMON,
      icon: '8',
      variant: 3,
      requirement: 9,
      orderIndex: 3,
    },
    {
      code: 'streak_day_12_gem7_v3',
      name: '🔥 Doce Días',
      description: '¡Cuarta gema brillando!',
      type: RewardType.STREAK,
      tier: RewardTier.RARE,
      icon: '7',
      variant: 3,
      requirement: 12,
      orderIndex: 4,
    },
    {
      code: 'streak_day_15_gem6_v3',
      name: '🔥 Quince Días',
      description: '¡Quinta gema alcanzada!',
      type: RewardType.STREAK,
      tier: RewardTier.RARE_PLUS,
      icon: '6',
      variant: 3,
      requirement: 15,
      orderIndex: 5,
    },
    {
      code: 'streak_day_18_gem5_v3',
      name: '🔥 Dieciocho Días',
      description: '¡Sexta gema conquistada!',
      type: RewardType.STREAK,
      tier: RewardTier.EPIC,
      icon: '5',
      variant: 3,
      requirement: 18,
      orderIndex: 6,
    },
    {
      code: 'streak_day_21_gem4_v3',
      name: '🔥 Veintiún Días',
      description: '¡Séptima gema ganada!',
      type: RewardType.STREAK,
      tier: RewardTier.EPIC_PLUS,
      icon: '4',
      variant: 3,
      requirement: 21,
      orderIndex: 7,
    },
    {
      code: 'streak_day_24_gem3_v3',
      name: '🔥 Veinticuatro Días',
      description: '¡Octava gema obtenida!',
      type: RewardType.STREAK,
      tier: RewardTier.LEGENDARY,
      icon: '3',
      variant: 3,
      requirement: 24,
      orderIndex: 8,
    },
    {
      code: 'streak_day_27_gem2_v3',
      name: '🔥 Veintisiete Días',
      description: '¡Novena gema desbloqueada!',
      type: RewardType.STREAK,
      tier: RewardTier.MYTHIC,
      icon: '2',
      variant: 3,
      requirement: 27,
      orderIndex: 9,
    },
    {
      code: 'streak_day_30_gem1_v3',
      name: '🎉 Mes 1 Completo',
      description: '¡Primera colección completa!',
      type: RewardType.STREAK,
      tier: RewardTier.ULTIMATE,
      icon: '1',
      variant: 3,
      requirement: 30,
      orderIndex: 10,
    },

    // ========================================
    // MES 2: GEMAS MEJORADAS (Variant 2)
    // Días 31-60: Una gema cada 3 días
    // ========================================
    
    {
      code: 'streak_day_33_gem10_v2',
      name: '💎 Día 33',
      description: '¡Gema mejorada nivel 2!',
      type: RewardType.STREAK,
      tier: RewardTier.STARTER,
      icon: '10',
      variant: 2,
      requirement: 33,
      orderIndex: 11,
    },
    {
      code: 'streak_day_36_gem9_v2',
      name: '💎 Día 36',
      description: '¡Segunda gema mejorada!',
      type: RewardType.STREAK,
      tier: RewardTier.COMMON,
      icon: '9',
      variant: 2,
      requirement: 36,
      orderIndex: 12,
    },
    {
      code: 'streak_day_39_gem8_v2',
      name: '💎 Día 39',
      description: '¡Tercera gema mejorada!',
      type: RewardType.STREAK,
      tier: RewardTier.UNCOMMON,
      icon: '8',
      variant: 2,
      requirement: 39,
      orderIndex: 13,
    },
    {
      code: 'streak_day_42_gem7_v2',
      name: '💎 Día 42',
      description: '¡Cuarta gema mejorada!',
      type: RewardType.STREAK,
      tier: RewardTier.RARE,
      icon: '7',
      variant: 2,
      requirement: 42,
      orderIndex: 14,
    },
    {
      code: 'streak_day_45_gem6_v2',
      name: '💎 Día 45',
      description: '¡Quinta gema mejorada!',
      type: RewardType.STREAK,
      tier: RewardTier.RARE_PLUS,
      icon: '6',
      variant: 2,
      requirement: 45,
      orderIndex: 15,
    },
    {
      code: 'streak_day_48_gem5_v2',
      name: '💎 Día 48',
      description: '¡Sexta gema mejorada!',
      type: RewardType.STREAK,
      tier: RewardTier.EPIC,
      icon: '5',
      variant: 2,
      requirement: 48,
      orderIndex: 16,
    },
    {
      code: 'streak_day_51_gem4_v2',
      name: '💎 Día 51',
      description: '¡Séptima gema mejorada!',
      type: RewardType.STREAK,
      tier: RewardTier.EPIC_PLUS,
      icon: '4',
      variant: 2,
      requirement: 51,
      orderIndex: 17,
    },
    {
      code: 'streak_day_54_gem3_v2',
      name: '💎 Día 54',
      description: '¡Octava gema mejorada!',
      type: RewardType.STREAK,
      tier: RewardTier.LEGENDARY,
      icon: '3',
      variant: 2,
      requirement: 54,
      orderIndex: 18,
    },
    {
      code: 'streak_day_57_gem2_v2',
      name: '💎 Día 57',
      description: '¡Novena gema mejorada!',
      type: RewardType.STREAK,
      tier: RewardTier.MYTHIC,
      icon: '2',
      variant: 2,
      requirement: 57,
      orderIndex: 19,
    },
    {
      code: 'streak_day_60_gem1_v2',
      name: '🎊 Mes 2 Completo',
      description: '¡Segunda colección completa!',
      type: RewardType.STREAK,
      tier: RewardTier.ULTIMATE,
      icon: '1',
      variant: 2,
      requirement: 60,
      orderIndex: 20,
    },

    // ========================================
    // MES 3: GEMAS SUPREMAS (Variant 1)
    // Días 61-90: Una gema cada 3 días
    // ========================================
    
    {
      code: 'streak_day_63_gem10_v1',
      name: '⭐ Día 63',
      description: '¡Gema suprema conseguida!',
      type: RewardType.STREAK,
      tier: RewardTier.STARTER,
      icon: '10',
      variant: 1,
      requirement: 63,
      orderIndex: 21,
    },
    {
      code: 'streak_day_66_gem9_v1',
      name: '⭐ Día 66',
      description: '¡Segunda gema suprema!',
      type: RewardType.STREAK,
      tier: RewardTier.COMMON,
      icon: '9',
      variant: 1,
      requirement: 66,
      orderIndex: 22,
    },
    {
      code: 'streak_day_69_gem8_v1',
      name: '⭐ Día 69',
      description: '¡Tercera gema suprema!',
      type: RewardType.STREAK,
      tier: RewardTier.UNCOMMON,
      icon: '8',
      variant: 1,
      requirement: 69,
      orderIndex: 23,
    },
    {
      code: 'streak_day_72_gem7_v1',
      name: '⭐ Día 72',
      description: '¡Cuarta gema suprema!',
      type: RewardType.STREAK,
      tier: RewardTier.RARE,
      icon: '7',
      variant: 1,
      requirement: 72,
      orderIndex: 24,
    },
    {
      code: 'streak_day_75_gem6_v1',
      name: '⭐ Día 75',
      description: '¡Quinta gema suprema!',
      type: RewardType.STREAK,
      tier: RewardTier.RARE_PLUS,
      icon: '6',
      variant: 1,
      requirement: 75,
      orderIndex: 25,
    },
    {
      code: 'streak_day_78_gem5_v1',
      name: '⭐ Día 78',
      description: '¡Sexta gema suprema!',
      type: RewardType.STREAK,
      tier: RewardTier.EPIC,
      icon: '5',
      variant: 1,
      requirement: 78,
      orderIndex: 26,
    },
    {
      code: 'streak_day_81_gem4_v1',
      name: '⭐ Día 81',
      description: '¡Séptima gema suprema!',
      type: RewardType.STREAK,
      tier: RewardTier.EPIC_PLUS,
      icon: '4',
      variant: 1,
      requirement: 81,
      orderIndex: 27,
    },
    {
      code: 'streak_day_84_gem3_v1',
      name: '⭐ Día 84',
      description: '¡Octava gema suprema!',
      type: RewardType.STREAK,
      tier: RewardTier.LEGENDARY,
      icon: '3',
      variant: 1,
      requirement: 84,
      orderIndex: 28,
    },
    {
      code: 'streak_day_87_gem2_v1',
      name: '⭐ Día 87',
      description: '¡Novena gema suprema!',
      type: RewardType.STREAK,
      tier: RewardTier.MYTHIC,
      icon: '2',
      variant: 1,
      requirement: 87,
      orderIndex: 29,
    },
    {
      code: 'streak_day_90_gem1_v1',
      name: '👑 MAESTRO ABSOLUTO',
      description: '¡LA GEMA MÁS VALIOSA! ¡90 DÍAS PERFECTOS!',
      type: RewardType.STREAK,
      tier: RewardTier.ULTIMATE,
      icon: '1',
      variant: 1,
      requirement: 90,
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
