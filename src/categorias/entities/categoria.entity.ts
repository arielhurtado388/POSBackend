import { Producto } from '../../productos/entities/producto.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 60 })
  nombre: string;

  @OneToMany(() => Producto, (producto) => producto.categoria, {
    cascade: true,
  })
  productos: Producto[];
}
