import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { GetProductoQueryDto } from './dto/get-product.dto';
import { ValidacionIdPipe } from 'src/common/pipes/validacion-id/validacion-id.pipe';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @Get()
  findAll(@Query() query: GetProductoQueryDto) {
    const categoria = query.categoria_id ? query.categoria_id : null;
    const take = query.take ? query.take : 10;
    const skip = query.skip ? query.skip : 0;
    return this.productosService.findAll(categoria, take, skip);
  }

  @Get(':id')
  findOne(@Param('id', ValidacionIdPipe) id: string) {
    return this.productosService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id', ValidacionIdPipe) id: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productosService.update(+id, updateProductoDto);
  }

  @Delete(':id')
  remove(@Param('id', ValidacionIdPipe) id: string) {
    return this.productosService.remove(+id);
  }
}
