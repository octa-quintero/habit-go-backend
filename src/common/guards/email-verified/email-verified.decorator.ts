import { SetMetadata } from '@nestjs/common';

export const REQUIRE_EMAIL_VERIFICATION_KEY = 'require_email_verification';

/**
 * Decorador para requerir que el email del usuario esté verificado
 *
 * @example
 * @RequireEmailVerification()
 * @Post('premium-feature')
 * premiumFeature() {}
 */
export const RequireEmailVerification = () =>
  SetMetadata(REQUIRE_EMAIL_VERIFICATION_KEY, true);

/**
 * Decorador para omitir la verificación de email en un endpoint específico
 *
 * @example
 * @SkipEmailVerification()
 * @Get('public')
 * publicEndpoint() {}
 */
export const SkipEmailVerification = () =>
  SetMetadata(REQUIRE_EMAIL_VERIFICATION_KEY, false);
