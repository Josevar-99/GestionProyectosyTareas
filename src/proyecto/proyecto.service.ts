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
    const proyecto = this.proyectoRepo.create(dto);
    return this.proyectoRepo.save(proyecto);
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

  private validarFechas(
    inicio: string | Date,
    fin?: string | Date | null,
  ): void {
    if (!fin) return;

    const inicioMs =
      inicio instanceof Date ? inicio.getTime() : Date.parse(`${inicio}T00:00:00Z`);
    const finMs =
      fin instanceof Date ? fin.getTime() : Date.parse(`${fin}T00:00:00Z`);

    if (!Number.isNaN(inicioMs) && !Number.isNaN(finMs) && finMs < inicioMs) {
      throw new BadRequestException(
        'La fecha de finalización no puede ser anterior a la fecha de inicio',
      );
    }
  }
}