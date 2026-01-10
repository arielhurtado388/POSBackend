import { Producto } from 'src/productos/entities/producto.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  total: number;

  @Column({ type: 'varchar', length: 30, nullable: true })
  cupon: string;

  @Column({ type: 'decimal', nullable: true })
  descuento: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  fecha: Date;

  @OneToMany(() => ContenidoVenta, (venta) => venta.venta)
  contenido: ContenidoVenta[];
}

@Entity()
export class ContenidoVenta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  cantidad: number;

  @Column('decimal')
  precio: number;

  @ManyToOne(() => Producto, (producto) => producto.id, {
    eager: true,
    cascade: true,
  })
  producto: Producto;

  @ManyToOne(() => Venta, (venta) => venta.contenido, { cascade: true })
  venta: Venta;
}
