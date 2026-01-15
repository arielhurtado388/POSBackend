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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { GetProductoQueryDto } from './dto/get-product.dto';
import { ValidacionIdPipe } from '../common/pipes/validacion-id/validacion-id.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { CargarImagenService } from 'src/cargar-imagen/cargar-imagen.service';

@Controller('productos')
export class ProductosController {
  constructor(
    private readonly productosService: ProductosService,
    private readonly cargarImagenService: CargarImagenService,
  ) {}

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

  @Post('cargar-imagen')
  @UseInterceptors(FileInterceptor('file'))
  cargarImagen(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('La imagen es obligatoria');
    }
    return this.cargarImagenService.subirArchivo(file);
  }
}
