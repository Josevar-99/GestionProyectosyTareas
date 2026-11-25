import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import databaseConfig from './config/database.config.js';
import { envSchema } from './config/env.config.js';
import { ProyectoModule } from './proyecto/proyecto.module.js';
import { TareaModule } from './tarea/tarea.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envSchema }),
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
    ProyectoModule,
    TareaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}