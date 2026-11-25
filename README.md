# Gestión de Proyectos y Tareas

API REST para crear y administrar proyectos y las tareas asociadas a cada uno. Está construida con NestJS, TypeScript, TypeORM y PostgreSQL.

Repositorio: [Josevar-99/GestionProyectosyTareas](https://github.com/Josevar-99/GestionProyectosyTareas)

## Requisitos

- Node.js y npm
- PostgreSQL

## Instalación

Clona el repositorio, instala las dependencias y crea una base de datos PostgreSQL para la aplicación:

```bash
git clone https://github.com/Josevar-99/GestionProyectosyTareas.git
cd GestionProyectosyTareas
npm install
```

Crea un archivo `.env` en la raíz del proyecto y configura la conexión:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=tu_contraseña
DB_NAME=gestion_proyectos_tareas
DB_SYNC=true
```

`DB_USER`, `DB_PASS` y `DB_NAME` deben corresponder a un usuario y una base de datos existentes en PostgreSQL. `DB_SYNC=true` permite que TypeORM sincronice el esquema automáticamente; úsalo para desarrollo. En producción, configúralo como `false` y gestiona los cambios de esquema mediante migraciones.

## Ejecución

```bash
# Desarrollo con recarga automática
npm run start:dev

# Compilar
npm run build

# Ejecutar la versión compilada
npm run start:prod
```

Por defecto, la API escucha en `http://localhost:3000`. Puedes cambiar el puerto con la variable `PORT`.

La documentación interactiva de Swagger está disponible en [http://localhost:3000/docs](http://localhost:3000/docs).

## API

Todos los cuerpos y respuestas usan JSON. Los identificadores son enteros.

| Método   | Ruta                                | Descripción                      |
| -------- | ----------------------------------- | -------------------------------- |
| `POST`   | `/proyectos`                        | Crear un proyecto                |
| `GET`    | `/proyectos`                        | Listar proyectos                 |
| `GET`    | `/proyectos/:id`                    | Obtener un proyecto              |
| `PATCH`  | `/proyectos/:id`                    | Actualizar un proyecto           |
| `DELETE` | `/proyectos/:id`                    | Eliminar un proyecto             |
| `POST`   | `/proyectos/:proyectoId/tareas`     | Crear una tarea en un proyecto   |
| `GET`    | `/proyectos/:proyectoId/tareas`     | Listar las tareas de un proyecto |
| `GET`    | `/proyectos/:proyectoId/tareas/:id` | Obtener una tarea                |
| `PATCH`  | `/proyectos/:proyectoId/tareas/:id` | Actualizar una tarea             |
| `DELETE` | `/proyectos/:proyectoId/tareas/:id` | Eliminar una tarea               |

La eliminación de un proyecto devuelve `409 Conflict` si todavía contiene tareas pendientes o en progreso. La eliminación de una tarea y la de un proyecto se responden con `204 No Content` cuando tienen éxito.

### Crear un proyecto

`nombre` y `fechaInicio` son obligatorios. `fechaFinalizacion` debe ser igual o posterior a `fechaInicio`.

```bash
curl -X POST http://localhost:3000/proyectos \
  -H 'Content-Type: application/json' \
  -d '{
    "nombre": "Rediseño web",
    "descripcion": "Actualizar el sitio de la empresa",
    "fechaInicio": "2026-01-15",
    "fechaFinalizacion": "2026-04-30"
  }'
```

### Crear una tarea

```bash
curl -X POST http://localhost:3000/proyectos/1/tareas \
  -H 'Content-Type: application/json' \
  -d '{
    "titulo": "Preparar propuesta visual",
    "descripcion": "Crear los primeros diseños",
    "estado": "pendiente",
    "prioridad": "alta",
    "fechaLimite": "2026-02-01"
  }'
```

Los estados permitidos son `pendiente`, `en_progreso` y `completada`. Las prioridades permitidas son `baja`, `media` y `alta`. Si se omiten, se asignan `pendiente` y `media`, respectivamente.

## Pruebas

```bash
# Pruebas unitarias
npm test

# Pruebas end-to-end
npm run test:e2e

# Cobertura
npm run test:cov
```
