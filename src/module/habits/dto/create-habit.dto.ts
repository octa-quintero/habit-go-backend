import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateHabitDto {
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El título del hábito es obligatorio' })
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres' })
  @MaxLength(100, {
    message: 'El título no puede exceder los 100 caracteres',
  })
  @Matches(/^[A-Za-záéíóúÁÉÍÓÚñÑ0-9\s.,!?¿¡-]+$/, {
    message:
      'El título solo puede contener letras, números, espacios y signos de puntuación básicos',
  })
  title: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(500, {
    message: 'La descripción no puede exceder los 500 caracteres',
  })
  description?: string;

  @IsOptional()
  @IsEnum(['daily', 'weekly'], {
    message: 'La frecuencia debe ser "daily" (diaria) o "weekly" (semanal)',
  })
  frequency?: 'daily' | 'weekly';
}
