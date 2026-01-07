import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  ParseIntPipe,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ValidacionIdPipe extends ParseIntPipe {
  constructor() {
    super({
      exceptionFactory: () => new BadRequestException('El id no es válido'),
    });
  }
}
