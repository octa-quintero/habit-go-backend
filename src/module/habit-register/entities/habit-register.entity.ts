import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Habit } from '../../habits/entities/habit.entity';

@Entity('habit_registers')
// COMENTADO PARA TESTING - Permitir múltiples registros por día
// @Index(['habit', 'date'], { unique: true })
export class HabitRegister {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Habit, (habit) => habit.registers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'habit_id' })
  habit: Habit;

  @Column({ type: 'date' })
  date: string;

  @Column({ default: true })
  completed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
