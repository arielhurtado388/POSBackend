import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContenidoVenta, Venta } from './entities/venta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venta, ContenidoVenta])],
  controllers: [VentasController],
  providers: [VentasService],
})
export class VentasModule {}
