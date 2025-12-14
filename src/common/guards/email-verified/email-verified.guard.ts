import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRE_EMAIL_VERIFICATION_KEY } from './email-verified.decorator';

@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireEmailVerification = this.reflector.getAllAndOverride<boolean>(
      REQUIRE_EMAIL_VERIFICATION_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si no se especifica el decorador o está en false, permitir acceso
    if (requireEmailVerification === false || requireEmailVerification === undefined) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    if (!user.isEmailVerified) {
      throw new ForbiddenException(
        'Debes verificar tu correo electrónico para acceder a esta función. Por favor, revisa tu bandeja de entrada.',
      );
    }

    return true;
  }
}
