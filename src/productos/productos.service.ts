import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';
import { Categoria } from 'src/categorias/entities/categoria.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productRepository: Repository<Producto>,
    @InjectRepository(Categoria)
    private readonly categoryRepository: Repository<Categoria>,
  ) {}

  async create(createProductoDto: CreateProductoDto) {
    const categoria = await this.categoryRepository.findOneBy({
      id: createProductoDto.categoriaId,
    });
    if (!categoria) {
      let errores: string[] = [];
      errores.push('La categoría no existe');
      throw new NotFoundException(errores);
    }
    return this.productRepository.save({
      ...createProductoDto,
      categoria,
    });
  }

  async findAll(categoriaId: number | null) {
    if (categoriaId) {
      const [productos, total] = await this.productRepository.findAndCount({
        where: {
          categoria: {
            id: categoriaId,
          },
        },
        relations: {
          categoria: true,
        },
        order: {
          id: 'DESC',
        },
      });

      return {
        productos,
        total,
      };
    }

    const [productos, total] = await this.productRepository.findAndCount({
      relations: {
        categoria: true,
      },
      order: {
        id: 'DESC',
      },
    });

    return {
      productos,
      total,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} producto`;
  }

  update(id: number, updateProductoDto: UpdateProductoDto) {
    return `This action updates a #${id} producto`;
  }

  remove(id: number) {
    return `This action removes a #${id} producto`;
  }
}
