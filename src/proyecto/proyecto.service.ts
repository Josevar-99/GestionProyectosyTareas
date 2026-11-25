import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Tarea } from '../tarea/entities/tarea.entity.js';
import { EstadoTarea } from '../tarea/enums/estado-tarea.enum.js';
import { CreateProyectoDto } from './dto/create-proyecto.dto.js';
import { UpdateProyectoDto } from './dto/update-proyecto.dto.js';
import { Proyecto } from './entities/proyecto.entity.js';

export interface ProgresoProyecto {
  proyectoId: number;
  total: number;
  completadas: number;
  porcentaje: number;
}

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepo: Repository<Proyecto>,
    @InjectRepository(Tarea)
    private readonly tareaRepo: Repository<Tarea>,
  ) {}

  async create(dto: CreateProyectoDto): Promise<Proyecto> {
    this.validarFechas(dto.fechaInicio, dto.fechaFinalizacion);
    return this.proyectoRepo.save(this.proyectoRepo.create(dto));
  }

  findAll(): Promise<Proyecto[]> {
    return this.proyectoRepo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Proyecto> {
    const proyecto = await this.proyectoRepo.findOne({ where: { id } });
    if (!proyecto) {
      throw new NotFoundException(`El proyecto con id ${id} no existe`);
    }
    return proyecto;
  }

  async obtenerProgreso(id: number): Promise<ProgresoProyecto> {
    await this.findOne(id);

    const [total, completadas] = await Promise.all([
      this.tareaRepo.count({ where: { proyectoId: id } }),
      this.tareaRepo.count({
        where: { proyectoId: id, estado: EstadoTarea.COMPLETADA },
      }),
    ]);

    const porcentaje =
      total === 0 ? 0 : Math.round((completadas / total) * 10000) / 100;

    return { proyectoId: id, total, completadas, porcentaje };
  }

  async update(id: number, dto: UpdateProyectoDto): Promise<Proyecto> {
    const proyecto = await this.findOne(id);
    this.proyectoRepo.merge(proyecto, dto);
    this.validarFechas(proyecto.fechaInicio, proyecto.fechaFinalizacion);
    return this.proyectoRepo.save(proyecto);
  }

  async remove(id: number): Promise<void> {
    const proyecto = await this.findOne(id);

    const abiertas = await this.tareaRepo.count({
      where: {
        proyectoId: id,
        estado: In([EstadoTarea.PENDIENTE, EstadoTarea.EN_PROGRESO]),
      },
    });

    if (abiertas > 0) {
      throw new ConflictException(
        `No se puede eliminar el proyecto ${id}: tiene ${abiertas} tarea(s) sin completar`,
      );
    }

    await this.proyectoRepo.remove(proyecto);
  }

  private validarFechas(inicio: string, fin?: string | null): void {
    if (fin && new Date(fin) < new Date(inicio)) {
      throw new BadRequestException(
        'La fecha de finalización no puede ser anterior a la fecha de inicio',
      );
    }
  }
}