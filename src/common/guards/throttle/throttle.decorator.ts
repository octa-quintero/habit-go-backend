import { SetMetadata } from '@nestjs/common';

export const THROTTLE_CONFIG_KEY = 'throttle_config';

/**
 * Decorador para aplicar rate limiting personalizado
 * @param ttl - Tiempo en milisegundos
 * @param limit - Número máximo de peticiones
 * 
 * @example
 * @CustomThrottle({ ttl: 60000, limit: 10 })
 * @Post('login')
 * login() {}
 */
export const CustomThrottle = (config: { ttl: number; limit: number }) =>
  SetMetadata(THROTTLE_CONFIG_KEY, config);

/**
 * Decorador para omitir rate limiting en un endpoint específico
 * 
 * @example
 * @SkipThrottle()
 * @Get('health')
 * healthCheck() {}
 */
export { SkipThrottle } from '@nestjs/throttler';
