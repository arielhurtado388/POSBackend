import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContenidoVenta, Venta } from './entities/venta.entity';
import { Producto } from '../productos/entities/producto.entity';
import { CuponesModule } from '../cupones/cupones.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venta, ContenidoVenta, Producto]),
    CuponesModule,
  ],
  controllers: [VentasController],
  providers: [VentasService],
})
export class VentasModule {}
