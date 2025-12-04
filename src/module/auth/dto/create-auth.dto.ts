import { IsNotEmpty, IsString, IsUUID, IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAuthDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsEnum(['access', 'refresh'])
  tokenType: 'access' | 'refresh';

  @IsDate()
  @Type(() => Date)
  expiresAt: Date;
}
