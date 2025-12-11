import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Reward } from './reward.entity';

@Entity('user_rewards')
@Index(['user', 'reward'], { unique: true })
export class UserReward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Reward)
  @JoinColumn({ name: 'reward_id' })
  reward: Reward;

  @CreateDateColumn({ name: 'earned_at' })
  earnedAt: Date;

  @Column({ default: false })
  viewed: boolean;

  @Column({ nullable: true, name: 'related_habit_id' })
  relatedHabitId?: string;
}
