import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { GoogleOAuthGuard } from '../../common/guards/google-oauth/google-oauth.guard';
import type { Response } from 'express';
import { config } from '../../config/dotenv.config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Throttle({ default: { ttl: 900000, limit: 5 } })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {
    // Redirige automáticamente a Google
  }

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    const result = await this.authService.googleLogin(req.user);

    // Redirigir al frontend con el token y userData
    const userDataEncoded = encodeURIComponent(JSON.stringify(result.userData));
    const redirectUrl = `${config.FRONTEND_URL}/auth/callback?token=${result.accessToken}&userData=${userDataEncoded}`;
    res.redirect(redirectUrl);
  }

  @Post('forgot-password')
  @Throttle({ default: { ttl: 900000, limit: 3 } })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @Throttle({ default: { ttl: 900000, limit: 5 } })
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }
}
