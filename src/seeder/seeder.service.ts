import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from '../categorias/entities/categoria.entity';
import { Repository, DataSource } from 'typeorm';
import { Producto } from '../productos/entities/producto.entity';
import { categorias } from './data/categorias';
import { productos } from './data/productos';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,

    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,

    private dataSource: DataSource,
  ) {}

  async onModuleInit() {
    const connection = this.dataSource;
    await connection.dropDatabase();
    await connection.synchronize();
  }

  async seed() {
    await this.categoriaRepository.save(categorias);
    for await (const seedProducto of productos) {
      const categoria = await this.categoriaRepository.findOneBy({
        id: seedProducto.categoriaId,
      });
      if (!categoria) {
        throw new NotFoundException('La categoría no existe');
      }
      const producto = new Producto();
      producto.nombre = seedProducto.nombre;
      producto.imagen = seedProducto.imagen;
      producto.precio = seedProducto.precio;
      producto.inventario = seedProducto.inventario;
      producto.categoria = categoria;

      await this.productoRepository.save(producto);
    }
  }
}
