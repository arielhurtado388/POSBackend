import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCuponeDto } from './dto/create-cupone.dto';
import { UpdateCuponeDto } from './dto/update-cupone.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cupon } from './entities/cupone.entity';
import { Repository } from 'typeorm';
import { endOfDay, isAfter } from 'date-fns';

@Injectable()
export class CuponesService {
  constructor(
    @InjectRepository(Cupon)
    private readonly cuponRepository: Repository<Cupon>,
  ) {}

  create(createCuponeDto: CreateCuponeDto) {
    return this.cuponRepository.save(createCuponeDto);
  }

  findAll() {
    return this.cuponRepository.find();
  }

  async findOne(id: number) {
    const cupon = await this.cuponRepository.findOneBy({ id });

    if (!cupon) {
      throw new NotFoundException(`El cupón con el id: ${id} no existe`);
    }

    return cupon;
  }

  async update(id: number, updateCuponeDto: UpdateCuponeDto) {
    const cupon = await this.findOne(id);
    Object.assign(cupon, updateCuponeDto);
    return await this.cuponRepository.save(cupon);
  }

  async remove(id: number) {
    const cupon = await this.findOne(id);
    await this.cuponRepository.remove(cupon);
    return 'Cupón eliminado';
  }

  async aplicarCupon(nombre: string) {
    const cupon = await this.cuponRepository.findOneBy({
      nombre,
    });

    if (!cupon) {
      throw new NotFoundException('El cupón no existe');
    }

    const fechaActual = new Date();
    const fechaExpiracion = endOfDay(cupon.fechaExpiracion);

    if (isAfter(fechaActual, fechaExpiracion)) {
      throw new UnprocessableEntityException('El cupón ya expiró');
    }

    return {
      message: 'El cupón es válido',
      ...cupon,
    };
  }
}
