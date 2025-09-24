# MS3 - Evaluaciones & Progreso API

Este repositorio contiene el microservicio **Evaluaciones & Progreso** de la plataforma de gestión de cursos. Permite gestionar el progreso de los estudiantes, tareas, entregas, registros de actividad y más.

## Descripción del Proyecto

La API gestiona el progreso de los estudiantes en los cursos, incluyendo la creación y actualización de tareas, envío de trabajos, y la captura de registros de actividad.

## Tecnologías Utilizadas

- **Node.js** con **Express.js** para la API.
- **MongoDB** como base de datos NoSQL.
- **Swagger** para la documentación interactiva de la API.
- **Faker** para la generación de datos de prueba (seed).
- **Docker** para la contenedorización del servicio.

## Endpoints Disponibles

### 1. **GET /progress/{studentUid}/{courseRunUid}**
Obtiene el progreso de un estudiante en un curso específico.

#### Parámetros de la URL:
- `studentUid`: ID único del estudiante (UUID).
- `courseRunUid`: ID único de la edición del curso (UUID).

#### Respuesta Exitosa:
```json
{
  "ok": true,
  "data": {
    "_id": "some_id",
    "studentUid": "student_id",
    "courseRunUid": "course_run_id",
    "completedLessons": ["lesson1", "lesson2"],
    "score": {
      "current": 75,
      "max": 100
    },
    "lastAccessAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-02T12:00:00Z"
  }
}
```

#### Respuesta de Error (404 - No encontrado):

```json
{
  "ok": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Progress not found"
  }
}
```


### 2. **PUT /progress/{studentUid}/{courseRunUid}**

Crea o actualiza el progreso de un estudiante en un curso.

#### Parámetros de la URL:

* `studentUid`: ID único del estudiante (UUID).
* `courseRunUid`: ID único de la edición del curso (UUID).

#### Cuerpo de la Solicitud:

```json
{
  "completedLessons": ["lesson1", "lesson2"],
  "score": {
    "current": 75,
    "max": 100
  }
}
```

#### Respuesta Exitosa:

```json
{
  "ok": true,
  "data": {
    "_id": "some_id",
    "studentUid": "student_id",
    "courseRunUid": "course_run_id",
    "completedLessons": ["lesson1", "lesson2"],
    "score": {
      "current": 75,
      "max": 100
    },
    "lastAccessAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-02T12:00:00Z"
  }
}
```

### 3. **GET /assignments**

Obtiene todas las asignaciones de un curso.

#### Parámetros de Consulta:

* `courseRunUid`: ID único de la edición del curso (UUID).

#### Respuesta Exitosa:

```json
{
  "ok": true,
  "data": [
    {
      "_id": "assignment_id",
      "lessonUid": "lesson_id",
      "title": "Assignment Title",
      "maxScore": 100,
      "dueAt": "2025-12-31T23:59:59Z",
      "rubric": [
        { "criterion": "Complejidad", "weight": 50 },
        { "criterion": "Precisión", "weight": 50 }
      ]
    }
  ]
}
```

### 4. **POST /assignments**

Crea una nueva asignación.

#### Cuerpo de la Solicitud:

```json
{
  "lessonUid": "lesson_id",
  "title": "Assignment Title",
  "maxScore": 100,
  "dueAt": "2025-12-31T23:59:59Z",
  "rubric": [
    { "criterion": "Complejidad", "weight": 50 },
    { "criterion": "Precisión", "weight": 50 }
  ]
}
```

#### Respuesta Exitosa:

```json
{
  "ok": true,
  "data": {
    "_id": "assignment_id",
    "lessonUid": "lesson_id",
    "title": "Assignment Title",
    "maxScore": 100,
    "dueAt": "2025-12-31T23:59:59Z",
    "rubric": [
      { "criterion": "Complejidad", "weight": 50 },
      { "criterion": "Precisión", "weight": 50 }
    ]
  }
}
```

### 5. **POST /submissions**

Envía una nueva entrega de tarea.

#### Cuerpo de la Solicitud:

```json
{
  "assignmentId": "assignment_id",
  "studentUid": "student_id",
  "files": [
    { "name": "tarea1.pdf", "url": "https://example.com/tarea1.pdf" }
  ],
  "submittedAt": "2025-01-01T00:00:00Z"
}
```

#### Respuesta Exitosa:

```json
{
  "ok": true,
  "data": {
    "_id": "submission_id",
    "assignmentId": "assignment_id",
    "studentUid": "student_id",
    "files": [
      { "name": "tarea1.pdf", "url": "https://example.com/tarea1.pdf" }
    ],
    "submittedAt": "2025-01-01T00:00:00Z"
  }
}
```

### 6. **GET /activity**

Obtiene los registros de actividad de un estudiante en un curso.

#### Parámetros de Consulta:

* `studentUid`: ID único del estudiante (UUID).
* `courseRunUid`: ID único de la edición del curso (UUID).

#### Respuesta Exitosa:

```json
{
  "ok": true,
  "data": [
    {
      "_id": "activity_id",
      "actorUid": "student_id",
      "type": "LESSON_VIEW",
      "courseRunUid": "course_run_id",
      "lessonUid": "lesson_id",
      "meta": { "lessonName": "Lesson 1", "score": 75 },
      "at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

## Instalación

### Requisitos:

* **Node.js** (versión 14 o superior)
* **MongoDB** (local o en la nube)

### Pasos para ejecutar:

1. Clona el repositorio:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd evaluaciones-ms3
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea un archivo `.env` con las siguientes variables:

   ```env
   PORT=3003
   MONGO_URI=mongodb://localhost:27017/mi_base_de_datos
   CORS_ORIGIN=http://localhost:3000
   SWAGGER_SERVER_URL=http://localhost:3003
   ```

4. Inicia el servidor:

   ```bash
   npm run dev
   ```

### Ejecutar el script de semillas:

Para generar datos de prueba en la base de datos, ejecuta el siguiente comando:

```bash
ts-node scripts/seed-activity.ts
```

Esto generará ≥20,000 registros de actividad en los últimos 90 días en la colección `activity_logs`.

## Pruebas

Se recomienda usar **Postman** para probar la API. Puedes importar la colección desde el archivo `postman_collection.json` que está incluido en el proyecto.

1. Abre **Postman**.
2. Haz clic en **Import** y selecciona el archivo `postman_collection.json`.
3. Ejecuta las solicitudes de la colección para probar todos los endpoints.

