import { ThrottlerModuleOptions } from '@nestjs/throttler';

/**
 * Configuración global de rate limiting
 *
 * - ttl: Tiempo en segundos para el límite
 * - limit: Número máximo de peticiones en ese tiempo
 */
export const throttlerConfig: ThrottlerModuleOptions = {
  throttlers: [
    {
      name: 'default',
      ttl: 60000, // 60 segundos
      limit: 60, // 60 peticiones por minuto
    },
    {
      name: 'short',
      ttl: 10000, // 10 segundos
      limit: 10, // 10 peticiones por cada 10 segundos
    },
  ],
};

/**
 * Configuración específica para autenticación
 * Más restrictivo para prevenir ataques de fuerza bruta
 */
export const authThrottlerConfig = {
  name: 'auth',
  ttl: 900000, // 15 minutos
  limit: 5, // 5 intentos cada 15 minutos
};

/**
 * Configuración para operaciones sensibles
 */
export const strictThrottlerConfig = {
  name: 'strict',
  ttl: 60000, // 60 segundos
  limit: 10, // 10 peticiones por minuto
};
