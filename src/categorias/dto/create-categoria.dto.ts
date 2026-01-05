import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoriaDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;
}
