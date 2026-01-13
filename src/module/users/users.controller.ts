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
import type { RequestWithUser } from '../habits/interfaces/request-user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(':create')
  // @Throttle({ default: { ttl: 3600000, limit: 10 } }) // Desactivado para desarrollo
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
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
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteProfile(@Request() req: RequestWithUser) {
    return this.usersService.softDeleteUser(req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async softDelete(@Param('id') id: string) {
    return this.usersService.softDeleteUser(id);
  }

  @Patch(':id/restore')
  async restore(@Param('id') id: string) {
    return this.usersService.restoreUser(id);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  // @Throttle({ default: { ttl: 60000, limit: 5 } }) // Desactivado para desarrollo
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.usersService.verifyEmail(
      verifyEmailDto.email,
      verifyEmailDto.token,
    );
  }
}
