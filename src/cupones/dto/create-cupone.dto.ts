import { IsDateString, IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateCuponeDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsNotEmpty({ message: 'El porcentaje es obligatorio' })
  @IsInt({ message: 'El porcentaje debe estar entre 1 y 100' })
  @Min(1, { message: 'El descuento mínimo es de 1' })
  @Max(100, { message: 'El descuento máximo es de 100' })
  porcentaje: number;

  @IsNotEmpty({ message: 'La fecha es obligatoria' })
  @IsDateString({}, { message: 'La fecha no es válida' })
  fechaExpiracion: Date;
}
