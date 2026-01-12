import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RewardTier } from '../enums/rewards-tier.enum';
import { RewardType } from '../enums/rewards-type.enum';

@Entity('rewards')
export class Reward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string; // 'streak_7', 'habit_count_5', etc.

  @Column()
  name: string; // "Semana Completa"

  @Column({ type: 'text' })
  description: string; // "Completa un hábito 7 días seguidos"

  @Column({ type: 'enum', enum: RewardType })
  type: RewardType;

  @Column({ type: 'enum', enum: RewardTier })
  tier: RewardTier;

  @Column()
  icon: string; // "🔥", "⭐", "🏆"

  @Column({ nullable: true })
  variant: number; // 1, 2, 3 para las diferentes versiones de gemas

  @Column()
  requirement: number; // 7, 30, 100, etc.

  @Column({ name: 'order_index', default: 0 })
  orderIndex: number; // Para ordenar en el frontend

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
export { RewardType };
