import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PrioridadTarea } from '../enums/prioridad-tarea.enum.js';

export class CreateTareaDto {
  @ApiProperty({ example: 'Diseñar el modelo de datos', maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  titulo: string;

  @ApiPropertyOptional({
    example: 'Definir entidades y relaciones en PostgreSQL',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;

  @ApiPropertyOptional({
    enum: PrioridadTarea,
    default: PrioridadTarea.MEDIA,
  })
  @IsOptional()
  @IsEnum(PrioridadTarea)
  prioridad?: PrioridadTarea;

  @ApiPropertyOptional({
    example: '2026-12-15',
    description: 'Formato YYYY-MM-DD',
  })
  @IsOptional()
  @IsDateString()
  fechaLimite?: string;
}