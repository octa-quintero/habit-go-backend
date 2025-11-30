import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { HabitRegister } from '../../habit-register/entities/habit-register.entity';

@Entity('habits')
export class Habit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column({ nullable: true, length: 255 })
  description?: string;

  @Column({ type: 'enum', enum: ['daily', 'weekly'], default: 'daily' })
  frequency: 'daily' | 'weekly';

  @Column({ default: 0 })
  streak: number;

  @Column({ default: 0, name: 'longest_streak' })
  longestStreak: number;

  @Column({ nullable: true, name: 'last_completed_date' })
  lastCompletedDate?: Date;

  @ManyToOne(() => User, (user) => user.habits, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => HabitRegister, (hr) => hr.habit, { cascade: true })
  registers: HabitRegister[];

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
