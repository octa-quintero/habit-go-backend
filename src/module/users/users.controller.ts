import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles/roles.guard';
import { EmailVerifiedGuard } from '../../common/guards/email-verified/email-verified.guard';
import { Roles } from '../../common/guards/roles/roles.decorator';
import { RequireEmailVerification } from '../../common/guards/email-verified/email-verified.decorator';
import { UserRole } from './enums/user-role.enum';
import type { RequestWithUser } from '../habits/interfaces/request-user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Registro público (sin guard)
  @Post()
  @Throttle({ default: { ttl: 3600000, limit: 3 } })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  // Solo admins pueden listar todos los usuarios
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.usersService.findAllUsers(Number(page), Number(limit));
  }

  // Solo admins pueden ver otros usuarios por ID
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOneUser(id);
  }

  // Solo admins pueden actualizar otros usuarios
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  // Solo admins pueden eliminar otros usuarios
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async softDelete(@Param('id') id: string) {
    return this.usersService.softDeleteUser(id);
  }

  // Solo admins pueden restaurar usuarios
  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async restore(@Param('id') id: string) {
    return this.usersService.restoreUser(id);
  }

  // Verificación de email (público)
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.usersService.verifyEmail(
      verifyEmailDto.email,
      verifyEmailDto.token,
    );
  }

  // Endpoints de perfil personal (requieren autenticación)
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: RequestWithUser) {
    return this.usersService.findOneUser(req.user.userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard, EmailVerifiedGuard)
  @RequireEmailVerification()
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(req.user.userId, updateUserDto);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { ttl: 3600000, limit: 3 } })
  @HttpCode(HttpStatus.OK)
  async deleteProfile(@Request() req: RequestWithUser) {
    return this.usersService.softDeleteUser(req.user.userId);
  }

  @Get('me/stats')
  @UseGuards(JwtAuthGuard)
  async getStats(@Request() req: RequestWithUser) {
    return this.usersService.getUserStats(req.user.userId);
  }
}
