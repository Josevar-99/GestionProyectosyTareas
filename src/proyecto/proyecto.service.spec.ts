import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Proyecto } from './entities/proyecto.entity.js';
import { Tarea } from '../tarea/entities/tarea.entity.js';
import { EstadoTarea } from '../tarea/enums/estado-tarea.enum.js';
import { ProyectoService } from './proyecto.service.js';

describe('ProyectoService', () => {
  let service: ProyectoService;
  let proyectoRepo: any;
  let tareaRepo: any;

  beforeEach(async () => {
    proyectoRepo = {
      create: vi.fn((dto) => dto),
      save: vi.fn(async (entity) => ({ id: 1, ...entity })),
      find: vi.fn(async () => []),
      findOne: vi.fn(async () => null),
      merge: vi.fn((entity, dto) => Object.assign(entity, dto)),
      remove: vi.fn(async () => undefined),
    };
    tareaRepo = {
      count: vi.fn(async () => 0),
    };
    service = new ProyectoService(proyectoRepo, tareaRepo);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('crea un proyecto válido', async () => {
    const dto = { nombre: 'API', fechaInicio: '2026-01-01', fechaFinalizacion: '2026-02-01' };
    const result = await service.create(dto);
    expect(proyectoRepo.create).toHaveBeenCalledWith(dto);
    expect(proyectoRepo.save).toHaveBeenCalled();
    expect(result.nombre).toBe('API');
  });

  it('rechaza una fecha final anterior', async () => {
    await expect(service.create({ nombre: 'API', fechaInicio: '2026-02-01', fechaFinalizacion: '2026-01-01' })).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lista proyectos', async () => {
    proyectoRepo.find.mockResolvedValue([{ id: 1 }]);
    await expect(service.findAll()).resolves.toEqual([{ id: 1 }]);
  });

  it('obtiene un proyecto existente', async () => {
    proyectoRepo.findOne.mockResolvedValue({ id: 1 });
    await expect(service.findOne(1)).resolves.toEqual({ id: 1 });
  });

  it('lanza 404 al buscar un proyecto inexistente', async () => {
    await expect(service.findOne(99)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('calcula progreso sin tareas', async () => {
    proyectoRepo.findOne.mockResolvedValue({ id: 1 });
    await expect(service.obtenerProgreso(1)).resolves.toEqual({ proyectoId: 1, total: 0, completadas: 0, porcentaje: 0 });
  });

  it('calcula progreso con tareas completadas', async () => {
    proyectoRepo.findOne.mockResolvedValue({ id: 1 });
    tareaRepo.count.mockResolvedValueOnce(4).mockResolvedValueOnce(3);
    await expect(service.obtenerProgreso(1)).resolves.toEqual({ proyectoId: 1, total: 4, completadas: 3, porcentaje: 75 });
  });

  it('actualiza un proyecto existente', async () => {
    const proyecto = { id: 1, nombre: 'Viejo', fechaInicio: '2026-01-01' };
    proyectoRepo.findOne.mockResolvedValue(proyecto);
    await service.update(1, { nombre: 'Nuevo' });
    expect(proyectoRepo.merge).toHaveBeenCalledWith(proyecto, { nombre: 'Nuevo' });
    expect(proyectoRepo.save).toHaveBeenCalledWith(proyecto);
  });

  it('bloquea eliminar un proyecto con tareas abiertas', async () => {
    proyectoRepo.findOne.mockResolvedValue({ id: 1 });
    tareaRepo.count.mockResolvedValue(2);
    await expect(service.remove(1)).rejects.toBeInstanceOf(ConflictException);
  });

  it('elimina un proyecto sin tareas abiertas', async () => {
    const proyecto = { id: 1 };
    proyectoRepo.findOne.mockResolvedValue(proyecto);
    tareaRepo.count.mockResolvedValue(0);
    await service.remove(1);
    expect(proyectoRepo.remove).toHaveBeenCalledWith(proyecto);
  });

  it('actualiza fechas inválidas al modificar el proyecto', async () => {
    proyectoRepo.findOne.mockResolvedValue({ id: 1, fechaInicio: '2026-02-01', fechaFinalizacion: '2026-03-01' });
    await expect(service.update(1, { fechaFinalizacion: '2026-01-01' })).rejects.toBeInstanceOf(BadRequestException);
  });

  it('usa el filtro de estados abiertos al eliminar', async () => {
    proyectoRepo.findOne.mockResolvedValue({ id: 1 });
    tareaRepo.count.mockResolvedValue(0);
    await service.remove(1);
    expect(tareaRepo.count).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ estado: expect.anything() }) }));
  });
});
