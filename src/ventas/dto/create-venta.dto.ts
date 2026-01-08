import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Length,
  ValidateNested,
} from 'class-validator';

export class ContenidoVentaDto {
  @IsNotEmpty({ message: 'La cantidad no puede estar vacía' })
  @IsInt({ message: 'La cantidad no es válida' }) // Validate quantity too
  cantidad: number;

  @IsNotEmpty({ message: 'El precio no puede estar vacío' })
  @IsNumber({}, { message: 'El precio no es válido' })
  precio: number;

  @IsNotEmpty({ message: 'El id del producto no puede estar vacío' })
  @IsInt({ message: 'El producto no es válido' })
  productoId: number;
}

export class CreateVentaDto {
  @IsNotEmpty({ message: 'El total no puede ir vacio' })
  @IsNumber({}, { message: 'La cantidad no es válida' })
  total: number;

  @IsArray()
  @ArrayNotEmpty({ message: 'Los contenidos no pueden ir vacios' })
  @ValidateNested()
  @Type(() => ContenidoVentaDto)
  contenido: ContenidoVentaDto[];
}
