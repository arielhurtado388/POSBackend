import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ContenidoVenta, Venta } from './entities/venta.entity';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { Producto } from 'src/productos/entities/producto.entity';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,

    @InjectRepository(ContenidoVenta)
    private readonly contenidoVentaRepository: Repository<ContenidoVenta>,

    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(createVentaDto: CreateVentaDto) {
    await this.productoRepository.manager.transaction(
      async (ventaEntityManager) => {
        const venta = new Venta();
        venta.total = createVentaDto.contenido.reduce(
          (total, item) => total + item.cantidad * item.precio,
          0,
        );

        const contenidosVenta: ContenidoVenta[] = [];

        for (const contenido of createVentaDto.contenido) {
          const producto = await ventaEntityManager.findOneBy(Producto, {
            id: contenido.productoId,
          });

          const errores: string[] = [];

          if (!producto) {
            errores.push(
              `El producto con el id: ${contenido.productoId} no existe`,
            );
            throw new NotFoundException(errores);
          }

          if (producto.inventario < contenido.cantidad) {
            errores.push(
              `El artículo ${producto.nombre} excede la cantidad disponible`,
            );
            throw new BadRequestException(errores);
          }

          // Actualiza el inventario
          producto.inventario -= contenido.cantidad;
          await ventaEntityManager.save(producto);

          //  Crear instancia de contenido venta
          const contenidoVenta = new ContenidoVenta();
          contenidoVenta.precio = contenido.precio;
          contenidoVenta.producto = producto;
          contenidoVenta.cantidad = contenido.cantidad;
          contenidoVenta.venta = venta;
          contenidosVenta.push(contenidoVenta);
        }
        // Guarda la transacción solo si todas las validaciones pasaron
        await ventaEntityManager.save(venta);
        await ventaEntityManager.save(contenidosVenta);
      },
    );

    return 'Venta guardada correctamente';
  }

  findAll(fecha?: string) {
    const opciones: FindManyOptions<Venta> = {
      relations: {
        contenido: true,
      },
    };

    if (fecha) {
      const fechaFormateada = parseISO(fecha);

      if (!isValid(fechaFormateada)) {
        throw new BadRequestException('La fecha no es válida');
      }

      const inicio = startOfDay(fechaFormateada);
      const fin = endOfDay(fechaFormateada);

      opciones.where = {
        fecha: Between(inicio, fin),
      };
    }
    return this.ventaRepository.find(opciones);
  }

  async findOne(id: number) {
    const venta = await this.ventaRepository.findOne({
      where: {
        id,
      },
      relations: {
        contenido: true,
      },
    });

    if (!venta) {
      throw new NotFoundException('La venta no existe');
    }

    return venta;
  }

  update(id: number, updateVentaDto: UpdateVentaDto) {
    return `This action updates a #${id} venta`;
  }

  remove(id: number) {
    return `This action removes a #${id} venta`;
  }
}
