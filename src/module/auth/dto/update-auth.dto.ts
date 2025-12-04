import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
  @IsOptional()
  @IsBoolean()
  isRevoked?: boolean;
}
