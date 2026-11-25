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
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProyectoDto } from './dto/create-proyecto.dto.js';
import { UpdateProyectoDto } from './dto/update-proyecto.dto.js';
import { ProyectoService } from './proyecto.service.js';

@ApiTags('Proyectos')
@Controller('proyectos')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un proyecto' })
  @ApiResponse({ status: 201, description: 'Proyecto creado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() dto: CreateProyectoDto) {
    return this.proyectoService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los proyectos' })
  @ApiResponse({ status: 200, description: 'Lista de proyectos' })
  findAll() {
    return this.proyectoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un proyecto por id' })
  @ApiResponse({ status: 200, description: 'Proyecto encontrado' })
  @ApiResponse({ status: 404, description: 'El proyecto no existe' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.proyectoService.findOne(id);
  }

  @Get(':id/progreso')
  @ApiOperation({
    summary: 'Porcentaje de avance según las tareas completadas',
    description:
      'Devuelve total, completadas y porcentaje. Un proyecto sin tareas devuelve 0% con total 0.',
  })
  @ApiResponse({ status: 200, description: 'Avance del proyecto' })
  @ApiResponse({ status: 404, description: 'El proyecto no existe' })
  progreso(@Param('id', ParseIntPipe) id: number) {
    return this.proyectoService.obtenerProgreso(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un proyecto' })
  @ApiResponse({ status: 200, description: 'Proyecto actualizado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'El proyecto no existe' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProyectoDto,
  ) {
    return this.proyectoService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un proyecto',
    description:
      'Se bloquea si el proyecto tiene tareas pendientes o en progreso.',
  })
  @ApiResponse({ status: 204, description: 'Proyecto eliminado' })
  @ApiResponse({ status: 404, description: 'El proyecto no existe' })
  @ApiResponse({
    status: 409,
    description: 'El proyecto tiene tareas sin completar',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.proyectoService.remove(id);
  }
}