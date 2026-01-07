import { Categoria } from '../../categorias/entities/categoria.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 60 })
  nombre: string;

  @Column({
    type: 'varchar',
    length: 120,
    nullable: true,
    default: 'default.svg',
  })
  imagen: string;

  @Column({ type: 'decimal' })
  precio: number;

  @Column({ type: 'int' })
  inventario: number;

  @ManyToOne(() => Categoria)
  categoria: Categoria;
}
