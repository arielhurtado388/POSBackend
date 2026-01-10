import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { ValidacionIdPipe } from '../common/pipes/validacion-id/validacion-id.pipe';

@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  create(@Body() createVentaDto: CreateVentaDto) {
    return this.ventasService.create(createVentaDto);
  }

  @Get()
  findAll(@Query('fecha') fecha: string) {
    return this.ventasService.findAll(fecha);
  }

  @Get(':id')
  findOne(@Param('id', ValidacionIdPipe) id: string) {
    return this.ventasService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id', ValidacionIdPipe) id: string) {
    return this.ventasService.remove(+id);
  }
}
