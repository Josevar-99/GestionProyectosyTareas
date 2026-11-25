import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tarea } from '../tarea/entities/tarea.entity.js';
import { Proyecto } from './entities/proyecto.entity.js';
import { ProyectoController } from './proyecto.controller.js';
import { ProyectoService } from './proyecto.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto, Tarea])],
  controllers: [ProyectoController],
  providers: [ProyectoService],
  exports: [ProyectoService],
})
export class ProyectoModule {}