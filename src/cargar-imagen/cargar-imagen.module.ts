import { Module } from '@nestjs/common';
import { CargarImagenService } from './cargar-imagen.service';
import { CargarImagenProvider } from './cargar-imagen';

@Module({
  providers: [CargarImagenService, CargarImagenProvider],
  exports: [CargarImagenService, CargarImagenProvider],
})
export class CargarImagenModule {}
