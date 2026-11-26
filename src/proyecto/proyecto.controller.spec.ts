import { Test, TestingModule } from '@nestjs/testing';
import { ProyectoController } from './proyecto.controller.js';
import { ProyectoService } from './proyecto.service.js';

describe('ProyectoController', () => {
  let controller: ProyectoController;
  let service: any;

  beforeEach(async () => {
    service = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      obtenerProgreso: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    };
    controller = new ProyectoController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('crea un proyecto', () => {
    const dto = { nombre: 'API', fechaInicio: '2026-01-01' };
    controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('lista proyectos', () => {
    controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('obtiene un proyecto', () => {
    controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('consulta el progreso', () => {
    controller.progreso(1);
    expect(service.obtenerProgreso).toHaveBeenCalledWith(1);
  });

  it('actualiza un proyecto', () => {
    const dto = { nombre: 'Nuevo' };
    controller.update(1, dto);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('elimina un proyecto', () => {
    controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
