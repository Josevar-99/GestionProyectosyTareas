import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { EstadoTarea } from '../enums/estado-tarea.enum.js';
import { PrioridadTarea } from '../enums/prioridad-tarea.enum.js';

export class CreateTareaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  titulo!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  descripcion?: string;

  @IsOptional()
  @IsEnum(EstadoTarea)
  @Transform(({ value }) => value ?? EstadoTarea.PENDIENTE)
  estado: EstadoTarea = EstadoTarea.PENDIENTE;

  @IsOptional()
  @IsEnum(PrioridadTarea)
  @Transform(({ value }) => value ?? PrioridadTarea.MEDIA)
  prioridad: PrioridadTarea = PrioridadTarea.MEDIA;

  @IsOptional()
  @IsDateString()
  fechaLimite?: string;
}