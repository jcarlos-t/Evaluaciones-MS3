¡de una! aquí tienes una **guía de ruta** (roadmap) para implementar el **MS3 – Evaluaciones & Progreso (Node.js + MongoDB)**. Está pensada para avanzar de 0→prod con entregables medibles.

---

## Fase 0 — Preparación (½ día)

**Objetivo:** entorno listo y decisiones base.

* Elegir **JS o TS** (recomiendo TS).
* Definir estándares: formato de errores, paginación, naming, commit lint.
* Crear repo y proyecto.

**Acciones rápidas**

```bash
npm init -y
npm i express mongoose zod dotenv cors morgan jsonwebtoken swagger-ui-express swagger-jsdoc
npm i -D typescript ts-node nodemon @types/{node,express,jsonwebtoken,cors,morgan}
npx tsc --init
```

---

## Fase 1 — Andamiaje (1 día)

**Objetivo:** servicio levantando, estructura y Docker de Mongo.

**Estructura**

```
src/
  app.ts, server.ts, db/mongo.ts, config/env.ts
  middlewares/{auth.ts,error.ts,requestId.ts,rateLimit.ts}
  models/{progress.ts,assignment.ts,submission.ts,activityLog.ts}
  schemas/{progress.ts,assignment.ts,submission.ts,activity.ts}
  controllers/{progress.ts,assignments.ts,submissions.ts,activity.ts}
  routes/{index.ts,progress.ts,assignments.ts,submissions.ts,activity.ts}
  docs/swagger.ts
scripts/seed-activity.ts
docker-compose.yml
.env.example
```

**Docker mínimo**

```yaml
services:
  mongo:
    image: mongo:7
    ports: ["27017:27017"]
    volumes: [mongo-data:/data/db]
volumes: { mongo-data: {} }
```

---

## Fase 2 — Modelado & Esquemas (1 día)

**Objetivo:** colecciones y **índices** listos con Mongoose.

* `progress`: índice **único** `{ studentUid:1, courseRunUid:1 }`.
* `assignments`: por `lessonUid` (+ `dueAt`).
* `submissions`: índice **único** `{ assignmentId:1, studentUid:1 }`.
* `activity_logs`: `{ actorUid:1, at:-1 }`, `{ courseRunUid:1, at:-1 }` (TTL opcional).

**Validación** con **Zod** para payloads de `POST/PUT`.

**Criterios de aceptación**

* `db.collection.getIndexes()` muestra indices esperados.
* Schemas rechazan datos inválidos → `422`.

---

## Fase 3 — Endpoints CRUD (1–1.5 días)

**Objetivo:** API funcional y consistente.

**Progreso**

* `GET /progress/:studentUid/:courseRunUid`
* `PUT /progress/:studentUid/:courseRunUid` (**upsert** + idempotencia)

**Tareas**

* `GET /assignments?courseRunUid=&page=&limit=`
* `POST /assignments` · `PUT /assignments/:id` · `DELETE /assignments/:id`

**Submissions**

* `POST /submissions` (409 si ya existe `(assignmentId,studentUid)`)
* `GET /submissions?assignmentId=&studentUid=`

**Actividad**

* `POST /activity` (rate-limit básico)
* `GET /activity?studentUid=&courseRunUid=&from=&to=&page=&limit=`

**Errores estándar**

* 401 (auth), 403 (permiso), 404, 409 (duplicado), 422 (validación), 429 (rate).

---

## Fase 4 — Seguridad & Doc (½ día)

**Objetivo:** auth, CORS y documentación.

* **JWT RS256**: middleware `auth` (lee `sub` y `role` del token emitido por MS1).
* **Autorización**:

  * STUDENT solo ve/edita su progreso y envíos.
  * INSTRUCTOR/ADMIN por `courseRunUid`.
* **CORS** limitado al dominio de Amplify.
* **Swagger-UI** en `/docs` (esquemas + ejemplos).

---

## Fase 5 — Datos masivos (½ día)

**Objetivo:** cumplir la rúbrica (≥20k).

* Script `scripts/seed-activity.ts` con faker: **≥20 000** docs en `activity_logs` (últimos 90 días).
* Evidencia: `countDocuments()` y captura de consola.

---

## Fase 6 — Integración con Orquestador (½ día)

**Objetivo:** flujos completos de negocio.

* Reutilizar `PUT /progress/:studentUid/:courseRunUid` como **inicialización** tras matrícula.
* Asegurar `GET /progress` y `GET /activity` para paneles.
* Alinear **contratos** (nombres de campos) con MS4.

---

## Fase 7 — Calidad, Observabilidad y Empaque (1 día)

**Objetivo:** listo para prod.

* **Logging** con `morgan` + `X-Request-ID` (middleware `requestId`).
* **Rate limit** en `POST /activity`.
* **Tests mínimos** (supertest) para 3 rutas críticas.
* **Dockerfile** multi-stage + `docker-compose.yml` para MS3+Mongo.
* **README** reproducible: setup, env, seed, endpoints, ejemplos cURL, códigos de error.

---

## Variables de entorno (sugeridas)

```
PORT=3003
MONGO_URI=mongodb://mongo:27017/ms3
JWT_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----
CORS_ORIGIN=https://<tu-app>.amplifyapp.com
LOG_LEVEL=info
RATE_LIMIT_RPS=10
```

---

## Reglas clave (resumen)

* **Idempotencia** en `PUT /progress`.
* **Un envío** por `(assignmentId,studentUid)` (o soportar `attempt` explícito).
* **courseRunUid** como ID lógico común (no FK física).
* **Paginación** y **proyección** en listados (no devolver blobs grandes).

---

## Criterios de “Hecho”

* [ ] Swagger completo en `/docs`.
* [ ] Índices creados; `activity_logs` ≥ 20k.
* [ ] Auth/roles funcionando (pruebas con tokens).
* [ ] Orquestador puede inicializar y leer progreso/actividad.
* [ ] Docker levanta MS3+Mongo y README permite demo en <15 min.

---

## Siguientes plus (opcional)

* TTL de `activity_logs` para cursos cerrados.
* Métricas Prometheus (latencias por ruta).
* Circuit-breaker para llamadas salientes (si aplica).
* Feature flags para cambios de esquema.

---

Si quieres, te lo convierto ahora en un **README del repo** con snippets de código base (TS), colección de Postman y los comandos exactos de seed. ¿Lo genero en TypeScript o prefieres JavaScript?
