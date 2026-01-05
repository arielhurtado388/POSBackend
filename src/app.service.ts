import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hola mundo';
  }

  postHello() {
    return 'Desde @Post en el service';
  }
}
