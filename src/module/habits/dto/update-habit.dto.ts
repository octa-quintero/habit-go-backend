import { PartialType } from '@nestjs/mapped-types';
import { CreateHabitDto } from './create-habit.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateHabitDto extends PartialType(CreateHabitDto) {
  @IsOptional()
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  isActive?: boolean;
}
