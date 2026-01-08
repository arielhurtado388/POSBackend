import { IsNumberString, IsOptional } from 'class-validator';

export class GetProductoQueryDto {
  @IsOptional()
  @IsNumberString({}, { message: 'La categoría debe ser un número' })
  categoria_id: number;

  @IsOptional()
  @IsNumberString({}, { message: 'La cantidad debe ser un número' })
  take: number;

  @IsOptional()
  @IsNumberString({}, { message: 'La cantidad debe ser un número' })
  skip: number;
}
