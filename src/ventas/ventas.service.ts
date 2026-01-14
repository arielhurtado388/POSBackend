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
import { Producto } from '../productos/entities/producto.entity';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';
import { CuponesService } from '../cupones/cupones.service';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,

    @InjectRepository(ContenidoVenta)
    private readonly contenidoVentaRepository: Repository<ContenidoVenta>,

    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,

    private readonly cuponService: CuponesService,
  ) {}

  async create(createVentaDto: CreateVentaDto) {
    await this.productoRepository.manager.transaction(
      async (ventaEntityManager) => {
        const venta = new Venta();
        const total = createVentaDto.contenido.reduce(
          (total, item) => total + item.cantidad * item.precio,
          0,
        );
        venta.total = total;

        if (createVentaDto.cupon) {
          const cupon = await this.cuponService.aplicarCupon(
            createVentaDto.cupon,
          );
          const descuento = +((cupon.porcentaje / 100) * total).toFixed(3);
          venta.descuento = descuento;
          venta.cupon = cupon.nombre;
          venta.total -= descuento;
        }

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

    return { message: 'Venta guardada correctamente' };
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

  async remove(id: number) {
    const venta = await this.findOne(id);

    for (const contenidos of venta.contenido) {
      const producto = await this.productoRepository.findOneBy({
        id: contenidos.producto.id,
      });
      if (!producto) {
        throw new NotFoundException('El producto no existe');
      }

      producto.inventario += contenidos.cantidad;
      await this.productoRepository.save(producto);

      const contenidoVenta = await this.contenidoVentaRepository.findOneBy({
        id: contenidos.id,
      });

      if (contenidoVenta) {
        await this.contenidoVentaRepository.remove(contenidoVenta);
      }
    }

    // Elimina todos los contenidos de la transacción en una sola operación
    // await this.contenidoVentaRepository.remove(venta.contenido);

    // Elimina la transacción principal
    await this.ventaRepository.remove(venta);
    return { message: 'Venta eliminada' };
  }
}
