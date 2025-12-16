import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { LoginResponse, SessionInfo } from './interfaces/auth.interface';
import { User } from '../users/entities/user.entity';
import { Auth } from './entities/auth.entity';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { config } from '../../config/dotenv.config';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponse> {
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

    // Crear payload JWT
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    // Generar refresh token
    const refreshToken = await this.createRefreshToken(user.id);

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
      refreshToken: refreshToken.token,
    };
  }

  async googleLogin(googleUser: any): Promise<LoginResponse> {
    // Buscar usuario existente por email
    let user = await this.userRepository.findOne({
      where: { email: googleUser.email },
    });

    // Si no existe, crear nuevo usuario
    if (!user) {
      const username = googleUser.email.split('@')[0];
      user = this.userRepository.create({
        name: googleUser.name,
        username: username,
        email: googleUser.email,
        avatar: googleUser.avatar,
        password: '', // No necesita password para login con Google
        isEmailVerified: true, // Google ya verificó el email
      });
      await this.userRepository.save(user);
    }

    // Crear token JWT
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    // Generar refresh token
    const refreshToken = await this.createRefreshToken(user.id);

    return {
      userData: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar ?? null,
      },
      accessToken,
      refreshToken: refreshToken.token,
    };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        // Por seguridad, no revelamos si el email existe o no
        return {
          message:
            'Si el correo existe, recibirás un email con instrucciones para restablecer tu contraseña',
        };
      }

      // Generar token de reset (32 bytes en hexadecimal)
      const resetToken = randomBytes(32).toString('hex');

      // El token expira en 1 hora
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      // Guardar token y expiración
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = expiresAt;
      await this.userRepository.save(user);

      // Enviar email
      try {
        await this.emailService.sendPasswordResetEmail(
          user.email,
          user.name,
          resetToken,
        );
      } catch (emailError) {
        console.error('Error al enviar email de reset:', emailError);
        throw new HttpException(
          'Error al enviar el email de recuperación',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        message:
          'Si el correo existe, recibirás un email con instrucciones para restablecer tu contraseña',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al procesar la solicitud',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetPassword(
    email: string,
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: [
          'id',
          'name',
          'email',
          'password',
          'passwordResetToken',
          'passwordResetExpires',
        ],
      });

      if (!user) {
        throw new HttpException(
          'Token inválido o expirado',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!user.passwordResetToken || user.passwordResetToken !== token) {
        throw new HttpException(
          'Token inválido o expirado',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (
        !user.passwordResetExpires ||
        user.passwordResetExpires < new Date()
      ) {
        throw new HttpException(
          'Token inválido o expirado',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Encriptar nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Actualizar contraseña y limpiar token
      user.password = hashedPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await this.userRepository.save(user);

      return { message: 'Contraseña actualizada correctamente' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al restablecer la contraseña',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async createRefreshToken(userId: string): Promise<Auth> {
    // Generar token aleatorio
    const token = randomBytes(64).toString('hex');

    // Expiración de 14 días
    const expiresAt = new Date();
    const daysToExpire = parseInt(
      config.REFRESH_TOKEN_EXPIRES_IN?.replace('d', '') || '14',
    );
    expiresAt.setDate(expiresAt.getDate() + daysToExpire);

    // Crear registro de refresh token
    const refreshToken = this.authRepository.create({
      user: { id: userId },
      token,
      tokenType: 'refresh',
      expiresAt,
      isRevoked: false,
    });

    return await this.authRepository.save(refreshToken);
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Buscar refresh token
      const tokenRecord = await this.authRepository.findOne({
        where: { token: refreshToken, tokenType: 'refresh' },
        relations: ['user'],
      });

      if (!tokenRecord) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      // Validar que no esté revocado
      if (tokenRecord.isRevoked) {
        throw new UnauthorizedException('Refresh token revocado');
      }

      // Validar que no haya expirado
      if (tokenRecord.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token expirado');
      }

      // Validar que el usuario esté activo
      if (!tokenRecord.user.isActive) {
        throw new UnauthorizedException('Usuario inactivo');
      }

      // Revocar el refresh token actual (rotación)
      tokenRecord.isRevoked = true;
      await this.authRepository.save(tokenRecord);

      // Generar nuevo access token
      const payload = {
        sub: tokenRecord.user.id,
        email: tokenRecord.user.email,
      };
      const accessToken = this.jwtService.sign(payload);

      // Generar nuevo refresh token
      const newRefreshToken = await this.createRefreshToken(
        tokenRecord.user.id,
      );

      return {
        accessToken,
        refreshToken: newRefreshToken.token,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new HttpException(
        'Error al renovar el token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logout(
    userId: string,
    refreshToken?: string,
  ): Promise<{ message: string }> {
    try {
      if (!refreshToken) {
        return { message: 'Sesión cerrada correctamente' };
      }

      // Buscar y revocar el refresh token
      const tokenRecord = await this.authRepository.findOne({
        where: {
          token: refreshToken,
          user: { id: userId },
          tokenType: 'refresh',
        },
      });

      if (tokenRecord && !tokenRecord.isRevoked) {
        tokenRecord.isRevoked = true;
        await this.authRepository.save(tokenRecord);
      }

      return { message: 'Sesión cerrada correctamente' };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException(
        'Error al cerrar sesión',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logoutAll(userId: string): Promise<{ message: string }> {
    try {
      // Revocar todos los refresh tokens del usuario
      await this.authRepository.update(
        { user: { id: userId }, tokenType: 'refresh', isRevoked: false },
        { isRevoked: true },
      );

      return { message: 'Todas las sesiones cerradas correctamente' };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException(
        'Error al cerrar todas las sesiones',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSessions(
    userId: string,
    currentToken?: string,
  ): Promise<SessionInfo[]> {
    try {
      const sessions = await this.authRepository.find({
        where: {
          user: { id: userId },
          tokenType: 'refresh',
          isRevoked: false,
        },
        order: { createdAt: 'DESC' },
      });

      return sessions.map((session) => ({
        id: session.id,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        isCurrentSession: currentToken ? session.token === currentToken : false,
      }));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException(
        'Error al obtener las sesiones',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
