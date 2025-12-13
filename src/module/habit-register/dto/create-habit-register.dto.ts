import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateHabitRegisterDto {
  @IsNotEmpty({ message: 'El ID del hábito es obligatorio' })
  @IsUUID('4', { message: 'El ID del hábito debe ser un UUID válido' })
  habitId: string;
}
