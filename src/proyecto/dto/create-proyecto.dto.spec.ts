import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateProyectoDto } from './create-proyecto.dto.js';

describe('CreateProyectoDto', () => {
  it('acepta datos válidos y elimina espacios del nombre', async () => {
    const dto = plainToInstance(CreateProyectoDto, {
      nombre: '  Proyecto web  ',
      descripcion: '  Desarrollo  ',
      fechaInicio: '2026-01-15',
      fechaFinalizacion: '2026-04-30',
    });

    expect(dto.nombre).toBe('Proyecto web');
    expect(dto.descripcion).toBe('Desarrollo');
    expect(await validate(dto)).toHaveLength(0);
  });

  it('rechaza nombre vacío', async () => {
    const dto = plainToInstance(CreateProyectoDto, {
      nombre: '   ',
      fechaInicio: '2026-01-15',
    });

    expect(await validate(dto)).not.toHaveLength(0);
  });

  it('rechaza fecha final anterior a la inicial', async () => {
    const dto = plainToInstance(CreateProyectoDto, {
      nombre: 'Proyecto',
      fechaInicio: '2026-04-30',
      fechaFinalizacion: '2026-01-15',
    });

    expect(await validate(dto)).not.toHaveLength(0);
  });

  it('permite omitir fecha final', async () => {
    const dto = plainToInstance(CreateProyectoDto, {
      nombre: 'Proyecto',
      fechaInicio: '2026-01-15',
    });

    expect(await validate(dto)).toHaveLength(0);
  });
});
