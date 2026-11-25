import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectoModule } from '../proyecto/proyecto.module.js';
import { Tarea } from './entities/tarea.entity.js';
import { TareaVencidaController } from './tarea-vencida.controller.js';
import { TareaController } from './tarea.controller.js';
import { TareaService } from './tarea.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Tarea]), ProyectoModule],
  controllers: [TareaController, TareaVencidaController],
  providers: [TareaService],
})
export class TareaModule {}