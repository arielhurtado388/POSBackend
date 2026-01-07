import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductoDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre no es válido' })
  nombre: string;

  @IsNotEmpty({ message: 'El precio es obligatorio' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio no es válido' })
  precio: number;

  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'La cantidad no es válida' })
  inventario: number;

  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  @IsInt({ message: 'La categoría no es válida' })
  categoriaId: number;
}
