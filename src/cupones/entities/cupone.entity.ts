import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  nombre: string;

  @Column({ type: 'int' })
  porcentaje: number;

  @Column({ type: 'date' })
  fechaExpiracion: Date;
}
