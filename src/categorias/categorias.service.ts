import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Categoria } from './entities/categoria.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoryRepository: Repository<Categoria>,
  ) {}

  create(createCategoriaDto: CreateCategoriaDto) {
    return this.categoryRepository.save(createCategoriaDto);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  async findOne(id: number, productos?: string) {
    const opciones: FindManyOptions<Categoria> = {
      where: {
        id,
      },
    };

    if (productos === 'true') {
      opciones.relations = {
        productos: true,
      };
    }

    const categoria = await this.categoryRepository.findOne(opciones);
    if (!categoria) {
      throw new NotFoundException('La categoría no existe');
    }
    return categoria;
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    const categoria = await this.findOne(id);
    categoria.nombre = updateCategoriaDto.nombre;
    return await this.categoryRepository.save(categoria);
  }

  async remove(id: number) {
    const categoria = await this.findOne(id);
    await this.categoryRepository.remove(categoria);
    return 'Categoría eliminada';
  }
}
