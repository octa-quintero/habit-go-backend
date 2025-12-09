import { IsUUID } from 'class-validator';

export class CreateHabitRegisterDto {
  @IsUUID()
  habitId: string;
}
