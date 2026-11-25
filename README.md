# Gestión de Proyectos y Tareas

API REST para crear y administrar proyectos y las tareas asociadas a cada uno. Está construida con NestJS, TypeScript, TypeORM y PostgreSQL.

Repositorio: [Josevar-99/GestionProyectosyTareas](https://github.com/Josevar-99/GestionProyectosyTareas)

## Requisitos

- Node.js y npm
- Docker Compose (recomendado) o PostgreSQL instalado

## Instalación

Clona el repositorio e instala las dependencias:

```bash
git clone https://github.com/Josevar-99/GestionProyectosyTareas.git
cd GestionProyectosyTareas
npm install
```

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
API_PREFIX=v1
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=tu_contraseña
DB_NAME=gestion_proyectos_tareas
DB_SYNC=true
```

Inicia PostgreSQL con Docker Compose:

```bash
docker compose up -d db
```

Compose usa `DB_USER`, `DB_PASS` y `DB_NAME` del archivo `.env`; el volumen `postgres_data` conserva los datos entre reinicios. Si usas una instancia de PostgreSQL instalada localmente, asegúrate de crear la base de datos y el usuario indicados. `DB_SYNC=true` permite que TypeORM sincronice el esquema automáticamente; úsalo para desarrollo. En producción, configúralo como `false` y gestiona los cambios de esquema mediante migraciones.

## Ejecución

```bash
# Desarrollo con recarga automática
npm run start:dev

# Compilar
npm run build

# Ejecutar la versión compilada
npm run start:prod
```

Por defecto, la API escucha en `http://localhost:3000` y usa el prefijo `/v1` para sus rutas. Puedes cambiar el puerto con `PORT` y el prefijo con `API_PREFIX`.

La documentación interactiva de Swagger está disponible en [http://localhost:3000/docs](http://localhost:3000/docs).

## API

Todos los cuerpos y respuestas usan JSON. Los identificadores son enteros.

Todas las rutas de la API llevan el prefijo `/v1` por defecto. Los filtros son opcionales y se pueden combinar.

| Método   | Ruta                                      | Descripción                                       |
| -------- | ----------------------------------------- | ------------------------------------------------- |
| `POST`   | `/v1/proyectos`                           | Crear un proyecto                                 |
| `GET`    | `/v1/proyectos`                           | Listar proyectos                                  |
| `GET`    | `/v1/proyectos/:id`                       | Obtener un proyecto                               |
| `GET`    | `/v1/proyectos/:id/progreso`              | Consultar el progreso de un proyecto              |
| `PATCH`  | `/v1/proyectos/:id`                       | Actualizar un proyecto                            |
| `DELETE` | `/v1/proyectos/:id`                       | Eliminar un proyecto                              |
| `POST`   | `/v1/proyectos/:proyectoId/tareas`        | Crear una tarea en un proyecto                    |
| `GET`    | `/v1/proyectos/:proyectoId/tareas`        | Listar tareas, opcionalmente filtradas            |
| `GET`    | `/v1/proyectos/:proyectoId/tareas/:id`    | Obtener una tarea                                 |
| `PATCH`  | `/v1/proyectos/:proyectoId/tareas/:id`    | Actualizar título, descripción, prioridad o fecha |
| `PATCH`  | `/v1/proyectos/:proyectoId/tareas/:id/estado` | Avanzar el estado de una tarea                |
| `DELETE` | `/v1/proyectos/:proyectoId/tareas/:id`    | Eliminar una tarea                                |
| `GET`    | `/v1/tareas/vencidas`                     | Listar tareas vencidas no completadas             |

La eliminación de un proyecto devuelve `409 Conflict` si todavía contiene tareas pendientes o en progreso. La eliminación de una tarea y la de un proyecto se responden con `204 No Content` cuando tienen éxito.

### Crear un proyecto

`nombre` y `fechaInicio` son obligatorios. `fechaFinalizacion` debe ser igual o posterior a `fechaInicio`.

```bash
curl -X POST http://localhost:3000/v1/proyectos \
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
curl -X POST http://localhost:3000/v1/proyectos/1/tareas \
  -H 'Content-Type: application/json' \
  -d '{
    "titulo": "Preparar propuesta visual",
    "descripcion": "Crear los primeros diseños",
    "prioridad": "alta",
    "fechaLimite": "2026-02-01"
  }'
```

Las tareas se crean en estado `pendiente`. Los estados permitidos son `pendiente`, `en_progreso` y `completada`; las prioridades son `baja`, `media` y `alta`. Si se omite la prioridad, se asigna `media`.

### Filtrar tareas

Se pueden consultar todas las tareas o aplicar uno o ambos filtros:

```bash
# Por estado
curl 'http://localhost:3000/v1/proyectos/1/tareas?estado=en_progreso'

# Por prioridad
curl 'http://localhost:3000/v1/proyectos/1/tareas?prioridad=alta'

# Por estado y prioridad
curl 'http://localhost:3000/v1/proyectos/1/tareas?estado=pendiente&prioridad=alta'
```

Los valores de los filtros deben coincidir con los estados y prioridades permitidos. Un filtro inválido devuelve `400 Bad Request`.

### Cambiar el estado de una tarea

El estado solo puede avanzar en este orden: `pendiente` → `en_progreso` → `completada`. No se permite saltar estados, retroceder ni cambiar una tarea que ya está completada. Una transición no permitida devuelve `409 Conflict`.

```bash
curl -X PATCH http://localhost:3000/v1/proyectos/1/tareas/1/estado \
  -H 'Content-Type: application/json' \
  -d '{"estado": "en_progreso"}'
```

### Consultar el progreso y las tareas vencidas

```bash
# Avance de un proyecto: total, completadas y porcentaje
curl http://localhost:3000/v1/proyectos/1/progreso

# Tareas cuya fecha límite ya pasó y que no están completadas
curl http://localhost:3000/v1/tareas/vencidas
```

## Pruebas

```bash
# Pruebas unitarias
npm test

# Pruebas end-to-end
npm run test:e2e

# Cobertura
npm run test:cov
```
