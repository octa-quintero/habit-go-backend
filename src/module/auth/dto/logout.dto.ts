import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class LogoutDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  refreshToken?: string;
}
