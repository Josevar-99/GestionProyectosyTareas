import { Test, TestingModule } from '@nestjs/testing';
import { TareaController } from './tarea.controller.js';
import { TareaService } from './tarea.service.js';
import { EstadoTarea } from './enums/estado-tarea.enum.js';

describe('TareaController', () => {
  let controller: TareaController;
  let service: any;

  beforeEach(async () => {
    service = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      cambiarEstado: vi.fn(),
      remove: vi.fn(),
    };
    controller = new TareaController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('crea una tarea', () => {
    const dto = { titulo: 'Diseñar modelo' };
    controller.create(5, dto);
    expect(service.create).toHaveBeenCalledWith(5, dto);
  });

  it('lista tareas con filtros', () => {
    const filtros = { estado: EstadoTarea.PENDIENTE };
    controller.findAll(5, filtros);
    expect(service.findAll).toHaveBeenCalledWith(5, filtros);
  });

  it('obtiene una tarea', () => {
    controller.findOne(5, 2);
    expect(service.findOne).toHaveBeenCalledWith(5, 2);
  });

  it('actualiza una tarea', () => {
    const dto = { titulo: 'Nueva descripción' };
    controller.update(5, 2, dto);
    expect(service.update).toHaveBeenCalledWith(5, 2, dto);
  });

  it('cambia el estado de una tarea', () => {
    const dto = { estado: EstadoTarea.EN_PROGRESO };
    controller.cambiarEstado(5, 2, dto);
    expect(service.cambiarEstado).toHaveBeenCalledWith(5, 2, dto.estado);
  });

  it('elimina una tarea', () => {
    controller.remove(5, 2);
    expect(service.remove).toHaveBeenCalledWith(5, 2);
  });
});
