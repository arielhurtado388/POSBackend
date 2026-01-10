import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CuponesService } from './cupones.service';
import { CreateCuponeDto } from './dto/create-cupone.dto';
import { UpdateCuponeDto } from './dto/update-cupone.dto';
import { ValidacionIdPipe } from '../common/pipes/validacion-id/validacion-id.pipe';
import { AplicarCuponDto } from './dto/aplicarCupon.dto';

@Controller('cupones')
export class CuponesController {
  constructor(private readonly cuponesService: CuponesService) {}

  @Post()
  create(@Body() createCuponeDto: CreateCuponeDto) {
    return this.cuponesService.create(createCuponeDto);
  }

  @Get()
  findAll() {
    return this.cuponesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ValidacionIdPipe) id: string) {
    return this.cuponesService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id', ValidacionIdPipe) id: string,
    @Body() updateCuponeDto: UpdateCuponeDto,
  ) {
    return this.cuponesService.update(+id, updateCuponeDto);
  }

  @Delete(':id')
  remove(@Param('id', ValidacionIdPipe) id: string) {
    return this.cuponesService.remove(+id);
  }

  @Post('/aplicar')
  @HttpCode(HttpStatus.OK)
  aplicarCupon(@Body() aplicarCuponDto: AplicarCuponDto) {
    return this.cuponesService.aplicarCupon(aplicarCuponDto.nombre);
  }
}
