import { PartialType } from '@nestjs/mapped-types';
import { CreateHabitRegisterDto } from './create-habit-register.dto';

export class UpdateHabitRegisterDto extends PartialType(CreateHabitRegisterDto) {}
