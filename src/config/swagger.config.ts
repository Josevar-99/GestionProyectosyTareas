import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const SWAGGER_PATH = 'docs';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('API de Proyectos y Tareas')
    .setDescription(
      'API REST para gestionar proyectos y sus tareas (relación 1:N).',
    )
    .setVersion('1.0')
    .addTag('Proyectos')
    .addTag('Tareas')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, documentFactory);
}