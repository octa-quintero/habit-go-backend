import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OWNERSHIP_KEY, OwnershipConfig } from './ownership.decorator';
import { Habit } from '../../../module/habits/entities/habit.entity';
import { HabitRegister } from '../../../module/habit-register/entities/habit-register.entity';
import { UserReward } from '../../../module/reward/entities/user-reward.entity';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Habit)
    private habitRepository: Repository<Habit>,
    @InjectRepository(HabitRegister)
    private habitRegisterRepository: Repository<HabitRegister>,
    @InjectRepository(UserReward)
    private userRewardRepository: Repository<UserReward>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const config = this.reflector.get<OwnershipConfig>(
      OWNERSHIP_KEY,
      context.getHandler(),
    );

    if (!config) {
      return true; // Si no hay configuración, permitir acceso
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.userId) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    const resourceId = request.params[config.paramName];

    if (!resourceId) {
      throw new ForbiddenException(
        `Parámetro '${config.paramName}' no encontrado en la ruta`,
      );
    }

    const isOwner = await this.verifyOwnership(
      config.entity,
      resourceId,
      user.userId,
    );

    if (!isOwner) {
      throw new ForbiddenException(
        'No tienes permiso para acceder a este recurso',
      );
    }

    return true;
  }

  private async verifyOwnership(
    entity: string,
    resourceId: string,
    userId: string,
  ): Promise<boolean> {
    switch (entity) {
      case 'habit':
        return this.verifyHabitOwnership(resourceId, userId);
      case 'habitRegister':
        return this.verifyHabitRegisterOwnership(resourceId, userId);
      case 'userReward':
        return this.verifyUserRewardOwnership(resourceId, userId);
      default:
        throw new ForbiddenException('Tipo de entidad no soportada');
    }
  }

  private async verifyHabitOwnership(
    habitId: string,
    userId: string,
  ): Promise<boolean> {
    const habit = await this.habitRepository.findOne({
      where: { id: habitId },
      relations: ['user'],
    });

    if (!habit) {
      throw new NotFoundException('Hábito no encontrado');
    }

    return habit.user.id === userId;
  }

  private async verifyHabitRegisterOwnership(
    registerId: string,
    userId: string,
  ): Promise<boolean> {
    const register = await this.habitRegisterRepository.findOne({
      where: { id: registerId },
      relations: ['habit', 'habit.user'],
    });

    if (!register) {
      throw new NotFoundException('Registro no encontrado');
    }

    return register.habit.user.id === userId;
  }

  private async verifyUserRewardOwnership(
    userRewardId: string,
    userId: string,
  ): Promise<boolean> {
    const userReward = await this.userRewardRepository.findOne({
      where: { id: userRewardId },
      relations: ['user'],
    });

    if (!userReward) {
      throw new NotFoundException('Recompensa no encontrada');
    }

    return userReward.user.id === userId;
  }
}
