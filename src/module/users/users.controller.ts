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
  ForbiddenException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles/roles.guard';
import { Roles } from '../../common/guards/roles/roles.decorator';
import { UserRole } from './enums/user-role.enum';
import type { RequestWithUser } from '../habits/interfaces/request-user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(':create')
  @Throttle({ default: { ttl: 3600000, limit: 10 } })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.usersService.findAllUsers(Number(page), Number(limit));
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: RequestWithUser) {
    return this.usersService.findOneUser(req.user.userId);
  }

  @Get('me/stats')
  @UseGuards(JwtAuthGuard)
  async getStats(@Request() req: RequestWithUser) {
    return this.usersService.getUserStats(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOneUser(id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(req.user.userId, updateUserDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: RequestWithUser,
  ) {
    // Validate user owns this account (no se puede editar otra cuenta)
    if (req.user.userId !== id) {
      throw new ForbiddenException('No tienes permiso para editar esta cuenta');
    }
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteProfile(@Request() req: RequestWithUser) {
    return this.usersService.softDeleteUser(req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async softDelete(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ) {
    // Validate user owns this account (no se puede eliminar otra cuenta)
    if (req.user.userId !== id) {
      throw new ForbiddenException('No tienes permiso para eliminar esta cuenta');
    }
    return this.usersService.softDeleteUser(id);
  }

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async restore(@Param('id') id: string) {
    return this.usersService.restoreUser(id);
  }

  @Post('verify-email')
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.usersService.verifyEmail(
      verifyEmailDto.email,
      verifyEmailDto.token,
    );
  }
}
