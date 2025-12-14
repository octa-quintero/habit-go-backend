import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class VerifyEmailDto {
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @MaxLength(100, {
    message: 'El correo electrónico no puede exceder los 100 caracteres',
  })
  email: string;

  @IsNotEmpty({ message: 'El token de verificación es obligatorio' })
  token: string;
}
