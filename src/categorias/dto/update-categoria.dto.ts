import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaDto } from './create-categoria.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;
}
