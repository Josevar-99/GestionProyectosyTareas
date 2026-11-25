import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { Proyecto } from '../../proyecto/entities/proyecto.entity.js';
import { EstadoTarea } from '../enums/estado-tarea.enum.js';
import { PrioridadTarea } from '../enums/prioridad-tarea.enum.js';

@Entity('tareas')
export class Tarea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({
    type: 'enum',
    enum: EstadoTarea,
    default: EstadoTarea.PENDIENTE,
  })
  estado: EstadoTarea;

  @Column({
    type: 'enum',
    enum: PrioridadTarea,
    default: PrioridadTarea.MEDIA,
  })
  prioridad: PrioridadTarea;

  @Column({ name: 'fecha_limite', type: 'date', nullable: true })
  fechaLimite?: string;

  @Column({ name: 'proyecto_id' })
  proyectoId: number;

  @ManyToOne(() => Proyecto, (proyecto) => proyecto.tareas, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'proyecto_id' })
  proyecto: Relation<Proyecto>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}