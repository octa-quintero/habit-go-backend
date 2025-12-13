import { IsArray, IsUUID, IsNotEmpty, ArrayMinSize } from 'class-validator';

export class MarkViewedDto {
  @IsNotEmpty({ message: 'La lista de IDs de recompensas es obligatoria' })
  @IsArray({ message: 'Los IDs de recompensas deben ser un arreglo' })
  @ArrayMinSize(1, {
    message: 'Debe proporcionar al menos un ID de recompensa',
  })
  @IsUUID('4', {
    each: true,
    message: 'Cada ID de recompensa debe ser un UUID válido',
  })
  rewardIds: string[];
}
