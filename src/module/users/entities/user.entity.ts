import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Habit } from '../../habits/entities/habit.entity';
import { UserRole } from '../enums/user-role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 100 })
  username: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 255, select: false })
  password: string;

  @Column({ nullable: true, length: 500 })
  avatar?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false, name: 'is_email_verified' })
  isEmailVerified: boolean;

  @Column({ nullable: true, name: 'email_verification_token' })
  emailVerificationToken?: string;

  @Column({ nullable: true, name: 'email_verified_at' })
  emailVerifiedAt?: Date;

  @Column({ nullable: true, name: 'password_reset_token' })
  passwordResetToken?: string;

  @Column({ nullable: true, name: 'password_reset_expires' })
  passwordResetExpires?: Date;

  @OneToMany(() => Habit, (habit) => habit.user, { cascade: true })
  habits: Habit[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;
}
