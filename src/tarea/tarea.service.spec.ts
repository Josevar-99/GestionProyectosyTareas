import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProyectoService } from '../proyecto/proyecto.service.js';
import { EstadoTarea } from './enums/estado-tarea.enum.js';
import { Tarea } from './entities/tarea.entity.js';
import { TareaService } from './tarea.service.js';

describe('TareaService', () => {
  let service: TareaService;
  let tareaRepo: any;
  let proyectoService: any;

  beforeEach(async () => {
    tareaRepo = {
      create: vi.fn((dto) => dto),
      save: vi.fn(async (entity) => ({ id: 1, ...entity })),
      find: vi.fn(async () => []),
      findOne: vi.fn(async () => null),
      merge: vi.fn((entity, dto) => Object.assign(entity, dto)),
      remove: vi.fn(async () => undefined),
    };
    proyectoService = { findOne: vi.fn(async (id) => ({ id })) };
    service = new TareaService(tareaRepo, proyectoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('crea una tarea en el proyecto', async () => {
    const dto = { titulo: 'Diseñar API' };
    const result = await service.create(5, dto);
    expect(proyectoService.findOne).toHaveBeenCalledWith(5);
    expect(tareaRepo.create).toHaveBeenCalledWith({ titulo: 'Diseñar API', proyectoId: 5 });
    expect(result.proyectoId).toBe(5);
  });

  it('lista tareas sin filtros', async () => {
    tareaRepo.find.mockResolvedValue([{ id: 1 }]);
    await expect(service.findAll(5)).resolves.toEqual([{ id: 1 }]);
    expect(tareaRepo.find).toHaveBeenCalledWith({ where: { proyectoId: 5 }, order: { id: 'ASC' } });
  });

  it('aplica filtros de estado y prioridad', async () => {
    await service.findAll(5, { estado: EstadoTarea.PENDIENTE, prioridad: 'alta' as any });
    expect(tareaRepo.find).toHaveBeenCalledWith(expect.objectContaining({
      where: { proyectoId: 5, estado: EstadoTarea.PENDIENTE, prioridad: 'alta' },
    }));
  });

  it('consulta tareas vencidas', async () => {
    tareaRepo.find.mockResolvedValue([{ id: 3 }]);
    await expect(service.findVencidas()).resolves.toEqual([{ id: 3 }]);
    expect(tareaRepo.find).toHaveBeenCalledWith(expect.objectContaining({ order: { fechaLimite: 'ASC', id: 'ASC' } }));
  });

  it('obtiene una tarea existente', async () => {
    tareaRepo.findOne.mockResolvedValue({ id: 2, proyectoId: 5 });
    await expect(service.findOne(5, 2)).resolves.toEqual({ id: 2, proyectoId: 5 });
  });

  it('lanza 404 si la tarea no existe', async () => {
    await expect(service.findOne(5, 99)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('actualiza una tarea existente', async () => {
    const tarea = { id: 2, proyectoId: 5, titulo: 'Viejo' };
    tareaRepo.findOne.mockResolvedValue(tarea);
    await service.update(5, 2, { titulo: 'Nuevo' });
    expect(tareaRepo.merge).toHaveBeenCalledWith(tarea, { titulo: 'Nuevo' });
    expect(tareaRepo.save).toHaveBeenCalledWith(tarea);
  });

  it('avanza de pendiente a en progreso', async () => {
    const tarea = { id: 2, proyectoId: 5, estado: EstadoTarea.PENDIENTE };
    tareaRepo.findOne.mockResolvedValue(tarea);
    const result = await service.cambiarEstado(5, 2, EstadoTarea.EN_PROGRESO);
    expect(result.estado).toBe(EstadoTarea.EN_PROGRESO);
  });

  it('avanza de en progreso a completada', async () => {
    const tarea = { id: 2, proyectoId: 5, estado: EstadoTarea.EN_PROGRESO };
    tareaRepo.findOne.mockResolvedValue(tarea);
    const result = await service.cambiarEstado(5, 2, EstadoTarea.COMPLETADA);
    expect(result.estado).toBe(EstadoTarea.COMPLETADA);
  });

  it('rechaza retroceder o saltar estados', async () => {
    tareaRepo.findOne.mockResolvedValue({ id: 2, proyectoId: 5, estado: EstadoTarea.PENDIENTE });
    await expect(service.cambiarEstado(5, 2, EstadoTarea.COMPLETADA)).rejects.toBeInstanceOf(ConflictException);
  });

  it('rechaza cambios de una tarea completada', async () => {
    tareaRepo.findOne.mockResolvedValue({ id: 2, proyectoId: 5, estado: EstadoTarea.COMPLETADA });
    await expect(service.cambiarEstado(5, 2, EstadoTarea.PENDIENTE)).rejects.toBeInstanceOf(ConflictException);
  });

  it('elimina una tarea existente', async () => {
    const tarea = { id: 2, proyectoId: 5 };
    tareaRepo.findOne.mockResolvedValue(tarea);
    await service.remove(5, 2);
    expect(tareaRepo.remove).toHaveBeenCalledWith(tarea);
  });

  it('propaga el error si el proyecto no existe al crear', async () => {
    proyectoService.findOne.mockRejectedValue(new NotFoundException());
    await expect(service.create(99, { titulo: 'Tarea' })).rejects.toBeInstanceOf(NotFoundException);
  });
});
