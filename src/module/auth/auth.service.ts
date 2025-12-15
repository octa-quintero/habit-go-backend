import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { LoginResponse, RefreshResponse } from './interfaces/auth.interface';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { config } from '../../config/dotenv.config';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    loginDto: LoginDto,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<LoginResponse> {
    const { email, password } = loginDto;

    // Buscar usuario con password
    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'name',
        'username',
        'email',
        'password',
        'avatar',
        'isActive',
      ],
    });

    // Validaciones combinadas para evitar dar pistas
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Los datos ingresados no son correctos.');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Los datos ingresados no son correctos.');
    }

    // Generar tokens
    const accessToken = this.generateAccessToken(user.id, user.email);
    const refreshToken = await this.generateRefreshToken(
      user,
      userAgent,
      ipAddress,
    );

    // Retornar datos sin password
    return {
      userData: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar ?? null,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(
    refreshTokenString: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<RefreshResponse> {
    // Buscar refresh token en BD
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshTokenString },
      relations: ['user'],
    });

    // Validar que existe
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    // Validar que no está revocado
    if (refreshToken.isRevoked) {
      throw new UnauthorizedException('Refresh token revocado');
    }

    // Validar que no expiró
    if (new Date() > refreshToken.expiresAt) {
      throw new UnauthorizedException('Refresh token expirado');
    }

    // Validar que el usuario sigue activo
    if (!refreshToken.user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Revocar el refresh token antiguo
    await this.revokeRefreshToken(refreshTokenString);

    // Generar nuevos tokens
    const accessToken = this.generateAccessToken(
      refreshToken.user.id,
      refreshToken.user.email,
    );
    const newRefreshToken = await this.generateRefreshToken(
      refreshToken.user,
      userAgent,
      ipAddress,
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshTokenString: string): Promise<void> {
    await this.revokeRefreshToken(refreshTokenString);
  }

  async revokeRefreshToken(token: string): Promise<void> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token },
    });

    if (refreshToken) {
      refreshToken.isRevoked = true;
      await this.refreshTokenRepository.save(refreshToken);
    }
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { user: { id: userId }, isRevoked: false },
      { isRevoked: true },
    );
  }

  // Limpiar tokens expirados (ejecutar periódicamente con cron)
  async cleanExpiredTokens(): Promise<void> {
    await this.refreshTokenRepository.delete({
      expiresAt: LessThan(new Date()),
    });
  }

  private generateAccessToken(userId: string, email: string): string {
    const payload = {
      sub: userId,
      email: email,
    };
    return this.jwtService.sign(payload);
  }

  private async generateRefreshToken(
    user: User,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<string> {
    // Generar token aleatorio
    const token = randomBytes(64).toString('hex');

    // Calcular fecha de expiración
    const expiresIn = config.REFRESH_TOKEN_EXPIRES_IN;
    const expiresAt = this.calculateExpirationDate(expiresIn);

    // Guardar en base de datos
    const refreshToken = this.refreshTokenRepository.create({
      token,
      user,
      expiresAt,
      userAgent,
      ipAddress,
    });

    await this.refreshTokenRepository.save(refreshToken);

    return token;
  }

  private calculateExpirationDate(duration: string): Date {
    const now = new Date();
    const match = duration.match(/^(\d+)([dhm])$/);

    if (!match) {
      throw new BadRequestException('Formato de duración inválido');
    }

    const [, value, unit] = match;
    const numValue = parseInt(value, 10);

    switch (unit) {
      case 'd':
        now.setDate(now.getDate() + numValue);
        break;
      case 'h':
        now.setHours(now.getHours() + numValue);
        break;
      case 'm':
        now.setMinutes(now.getMinutes() + numValue);
        break;
    }

    return now;
  }
}
