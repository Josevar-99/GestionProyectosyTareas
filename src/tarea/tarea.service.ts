import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProyectoService } from '../proyecto/proyecto.service.js';
import { CreateTareaDto } from './dto/create-tarea.dto.js';
import { UpdateTareaDto } from './dto/update-tarea.dto.js';
import { Tarea } from './entities/tarea.entity.js';

@Injectable()
export class TareaService {
  constructor(
    @InjectRepository(Tarea)
    private readonly tareaRepo: Repository<Tarea>,
    private readonly proyectoService: ProyectoService,
  ) {}

  async create(proyectoId: number, dto: CreateTareaDto): Promise<Tarea> {
    await this.proyectoService.findOne(proyectoId);
    const tarea = this.tareaRepo.create({ ...dto, proyectoId });
    return this.tareaRepo.save(tarea);
  }

  async findAll(proyectoId: number): Promise<Tarea[]> {
    await this.proyectoService.findOne(proyectoId);
    return this.tareaRepo.find({
      where: { proyectoId },
      order: { id: 'ASC' },
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

  async remove(proyectoId: number, id: number): Promise<void> {
    const tarea = await this.findOne(proyectoId, id);
    await this.tareaRepo.remove(tarea);
  }
}