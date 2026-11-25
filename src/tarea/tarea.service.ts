import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Not, Repository, type FindOptionsWhere } from 'typeorm';
import { ProyectoService } from '../proyecto/proyecto.service.js';
import { CreateTareaDto } from './dto/create-tarea.dto.js';
import { FiltrosTareaDto } from './dto/filtros-tarea.dto.js';
import { UpdateTareaDto } from './dto/update-tarea.dto.js';
import { Tarea } from './entities/tarea.entity.js';
import { EstadoTarea } from './enums/estado-tarea.enum.js';

// Flujo ordenado: cada estado solo puede avanzar al siguiente
const SIGUIENTE_ESTADO: Record<EstadoTarea, EstadoTarea | null> = {
  [EstadoTarea.PENDIENTE]: EstadoTarea.EN_PROGRESO,
  [EstadoTarea.EN_PROGRESO]: EstadoTarea.COMPLETADA,
  [EstadoTarea.COMPLETADA]: null,
};

@Injectable()
export class TareaService {
  constructor(
    @InjectRepository(Tarea)
    private readonly tareaRepo: Repository<Tarea>,
    private readonly proyectoService: ProyectoService,
  ) {}

  async create(proyectoId: number, dto: CreateTareaDto): Promise<Tarea> {
    await this.proyectoService.findOne(proyectoId);
    return this.tareaRepo.save(this.tareaRepo.create({ ...dto, proyectoId }));
  }

  async findAll(
    proyectoId: number,
    filtros: FiltrosTareaDto = {},
  ): Promise<Tarea[]> {
    await this.proyectoService.findOne(proyectoId);

    const where: FindOptionsWhere<Tarea> = { proyectoId };
    if (filtros.estado) where.estado = filtros.estado;
    if (filtros.prioridad) where.prioridad = filtros.prioridad;

    return this.tareaRepo.find({ where, order: { id: 'ASC' } });
  }

  findVencidas(): Promise<Tarea[]> {
    // Fecha local del servidor (YYYY-MM-DD), no UTC
    const hoy = new Date().toLocaleDateString('en-CA');

    return this.tareaRepo.find({
      where: {
        fechaLimite: LessThan(hoy),
        estado: Not(EstadoTarea.COMPLETADA),
      },
      order: { fechaLimite: 'ASC', id: 'ASC' },
    });
  }

  async findOne(proyectoId: number, id: number): Promise<Tarea> {
    await this.proyectoService.findOne(proyectoId);
    const tarea = await this.tareaRepo.findOne({ where: { id, proyectoId } });
    if (!tarea) {
      throw new NotFoundException(
        `La tarea ${id} no existe en el proyecto ${proyectoId}`,
      );
    }
    return tarea;
  }

  async update(
    proyectoId: number,
    id: number,
    dto: UpdateTareaDto,
  ): Promise<Tarea> {
    const tarea = await this.findOne(proyectoId, id);
    this.tareaRepo.merge(tarea, dto);
    return this.tareaRepo.save(tarea);
  }

  async cambiarEstado(
    proyectoId: number,
    id: number,
    nuevoEstado: EstadoTarea,
  ): Promise<Tarea> {
    const tarea = await this.findOne(proyectoId, id);
    const permitido = SIGUIENTE_ESTADO[tarea.estado];

    if (nuevoEstado !== permitido) {
      throw new ConflictException(
        permitido
          ? `La tarea está "${tarea.estado}" y solo puede pasar a "${permitido}"`
          : 'La tarea ya está completada y no admite más cambios de estado',
      );
    }

    tarea.estado = nuevoEstado;
    return this.tareaRepo.save(tarea);
  }

  async remove(proyectoId: number, id: number): Promise<void> {
    const tarea = await this.findOne(proyectoId, id);
    await this.tareaRepo.remove(tarea);
  }
}