import { Injectable } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ContenidoVenta, Venta } from './entities/venta.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,

    @InjectRepository(ContenidoVenta)
    private readonly contenidoVentaRepository: Repository<ContenidoVenta>,
  ) {}

  async create(createVentaDto: CreateVentaDto) {
    const venta = new Venta();
    venta.total = createVentaDto.total;
    await this.ventaRepository.save(venta);

    for (const contenido of createVentaDto.contenido) {
      await this.contenidoVentaRepository.save({ ...contenido, venta });
    }

    return 'Venta guardada correctamente';
  }

  findAll() {
    return `This action returns all ventas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} venta`;
  }

  update(id: number, updateVentaDto: UpdateVentaDto) {
    return `This action updates a #${id} venta`;
  }

  remove(id: number) {
    return `This action removes a #${id} venta`;
  }
}
