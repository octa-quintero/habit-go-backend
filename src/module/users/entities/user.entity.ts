import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Habit } from '../../habits/entities/habit.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 255, select: false })
  password: string;

  @Column({ nullable: true, length: 500 })
  avatar?: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Habit, (habit) => habit.user, { cascade: true })
  habits: Habit[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
