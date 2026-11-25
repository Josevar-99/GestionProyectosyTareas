import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CambiarEstadoDto } from './dto/cambiar-estado.dto.js';
import { CreateTareaDto } from './dto/create-tarea.dto.js';
import { FiltrosTareaDto } from './dto/filtros-tarea.dto.js';
import { UpdateTareaDto } from './dto/update-tarea.dto.js';
import { TareaService } from './tarea.service.js';

@ApiTags('Tareas')
@Controller('proyectos/:proyectoId/tareas')
export class TareaController {
  constructor(private readonly tareaService: TareaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una tarea en un proyecto (nace pendiente)' })
  @ApiResponse({ status: 201, description: 'Tarea creada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'El proyecto no existe' })
  create(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Body() dto: CreateTareaDto,
  ) {
    return this.tareaService.create(proyectoId, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar las tareas de un proyecto, filtrando por estado y prioridad',
  })
  @ApiResponse({ status: 200, description: 'Lista de tareas' })
  @ApiResponse({ status: 400, description: 'Filtro inválido' })
  @ApiResponse({ status: 404, description: 'El proyecto no existe' })
  findAll(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Query() filtros: FiltrosTareaDto,
  ) {
    return this.tareaService.findAll(proyectoId, filtros);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarea de un proyecto' })
  @ApiResponse({ status: 200, description: 'Tarea encontrada' })
  @ApiResponse({
    status: 404,
    description: 'El proyecto o la tarea no existen',
  })
  findOne(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tareaService.findOne(proyectoId, id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una tarea (el estado se cambia en /:id/estado)',
  })
  @ApiResponse({ status: 200, description: 'Tarea actualizada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({
    status: 404,
    description: 'El proyecto o la tarea no existen',
  })
  update(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTareaDto,
  ) {
    return this.tareaService.update(proyectoId, id, dto);
  }

  @Patch(':id/estado')
  @ApiOperation({
    summary: 'Cambiar el estado de una tarea',
    description:
      'Flujo ordenado: pendiente → en_progreso → completada. No se puede saltar ni retroceder.',
  })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  @ApiResponse({ status: 400, description: 'Estado inválido' })
  @ApiResponse({
    status: 404,
    description: 'El proyecto o la tarea no existen',
  })
  @ApiResponse({ status: 409, description: 'Transición de estado no permitida' })
  cambiarEstado(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CambiarEstadoDto,
  ) {
    return this.tareaService.cambiarEstado(proyectoId, id, dto.estado);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una tarea' })
  @ApiResponse({ status: 204, description: 'Tarea eliminada' })
  @ApiResponse({
    status: 404,
    description: 'El proyecto o la tarea no existen',
  })
  remove(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tareaService.remove(proyectoId, id);
  }
}