import { SetMetadata } from '@nestjs/common';

export interface OwnershipConfig {
  entity: 'habit' | 'habitRegister' | 'userReward';
  paramName: string; // Nombre del parámetro en la ruta (ej: 'id', 'habitId')
}

export const OWNERSHIP_KEY = 'ownership';

/**
 * Decorador para verificar la propiedad de un recurso
 * @param entity - Tipo de entidad a verificar
 * @param paramName - Nombre del parámetro en la ruta que contiene el ID
 *
 * @example
 * @CheckOwnership({ entity: 'habit', paramName: 'id' })
 * @Get(':id')
 * findOne(@Param('id') id: string) {}
 */
export const CheckOwnership = (config: OwnershipConfig) =>
  SetMetadata(OWNERSHIP_KEY, config);
