import { Module } from '@nestjs/common';
import { CuponesService } from './cupones.service';
import { CuponesController } from './cupones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cupon } from './entities/cupone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cupon])],
  controllers: [CuponesController],
  providers: [CuponesService],
  exports: [CuponesService],
})
export class CuponesModule {}
