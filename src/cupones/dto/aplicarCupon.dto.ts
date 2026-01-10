import { IsNotEmpty } from 'class-validator';

export class AplicarCuponDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;
}
