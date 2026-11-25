import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadoTarea } from '../enums/estado-tarea.enum.js';
import { PrioridadTarea } from '../enums/prioridad-tarea.enum.js';

export class FiltrosTareaDto {
  @ApiPropertyOptional({ enum: EstadoTarea })
  @IsOptional()
  @IsEnum(EstadoTarea)
  estado?: EstadoTarea;

  @ApiPropertyOptional({ enum: PrioridadTarea })
  @IsOptional()
  @IsEnum(PrioridadTarea)
  prioridad?: PrioridadTarea;
}