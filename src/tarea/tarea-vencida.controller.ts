import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TareaService } from './tarea.service.js';

@ApiTags('Tareas')
@Controller('tareas')
export class TareaVencidaController {
  constructor(private readonly tareaService: TareaService) {}

  @Get('vencidas')
  @ApiOperation({
    summary: 'Tareas vencidas y no completadas, de todos los proyectos',
    description:
      'Una tarea está vencida si su fecha límite es anterior a hoy y no está completada.',
  })
  @ApiResponse({ status: 200, description: 'Lista de tareas vencidas' })
  findVencidas() {
    return this.tareaService.findVencidas();
  }
}