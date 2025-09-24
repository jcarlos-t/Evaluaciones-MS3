// src/app.ts
import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec, swaggerUiOptions } from "./docs/swagger";
import routes from "./routes"; // asegúrate de exponer tus rutas aquí
import { requestId } from "./middlewares/requestId";
import { errorHandler } from "./middlewares/error";

const app = express();

// Middlewares base
app.use(requestId);
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan(":method :url :status - rid=:req[x-request-id] - :response-time ms"));

// Healthcheck sencillo
app.get("/health", (_req, res) => res.json({ ok: true, status: "healthy" }));

// Swagger (UI + spec) — sin JWT
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

/**
 * @openapi
 * tags:
 *   - name: Progress
 *   - name: Assignments
 *   - name: Submissions
 *   - name: Activity
 *
 * components:
 *   schemas:
 *     Progress:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         studentUid: { type: string, format: uuid }
 *         courseRunUid: { type: string, format: uuid }
 *         completedLessons:
 *           type: array
 *           items: { type: string }
 *         score:
 *           type: object
 *           properties:
 *             current: { type: number }
 *             max: { type: number }
 *         lastAccessAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *     UpsertProgress:
 *       type: object
 *       properties:
 *         completedLessons:
 *           type: array
 *           items: { type: string }
 *         score:
 *           type: object
 *           properties:
 *             current: { type: number }
 *             max: { type: number }
 *     Assignment:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         lessonUid: { type: string }
 *         title: { type: string }
 *         maxScore: { type: number }
 *         dueAt: { type: string, format: date-time }
 *         rubric:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               criterion: { type: string }
 *               weight: { type: number }
 *     AssignmentInput:
 *       allOf:
 *         - $ref: '#/components/schemas/Assignment'
 *     AssignmentUpdate:
 *       type: object
 *       properties:
 *         title: { type: string }
 *         maxScore: { type: number }
 *         dueAt: { type: string, format: date-time }
 *         rubric:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               criterion: { type: string }
 *               weight: { type: number }
 *     Submission:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         assignmentId: { type: string }
 *         studentUid: { type: string, format: uuid }
 *         files:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               url: { type: string, format: uri }
 *         submittedAt: { type: string, format: date-time }
 *         grade:
 *           type: object
 *           properties:
 *             value: { type: number }
 *             gradedAt: { type: string, format: date-time }
 *             graderUid: { type: string, format: uuid }
 *         feedback: { type: string }
 *     SubmissionInput:
 *       type: object
 *       required: [assignmentId, studentUid]
 *       properties:
 *         assignmentId: { type: string }
 *         studentUid: { type: string, format: uuid }
 *         files:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               url: { type: string, format: uri }
 *         submittedAt: { type: string, format: date-time }
 *     ActivityLog:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         actorUid: { type: string, format: uuid }
 *         type: { type: string }
 *         courseRunUid: { type: string, format: uuid }
 *         lessonUid: { type: string }
 *         meta: { type: object, additionalProperties: true }
 *         at: { type: string, format: date-time }
 *     ActivityLogInput:
 *       type: object
 *       required: [actorUid, type]
 *       properties:
 *         actorUid: { type: string, format: uuid }
 *         type: { type: string }
 *         courseRunUid: { type: string, format: uuid }
 *         lessonUid: { type: string }
 *         meta: { type: object, additionalProperties: true }
 *         at: { type: string, format: date-time }
 */

// Rutas de la API (versionable con /api/v1 si deseas)
app.use("/", routes);

// Manejo de errores (al final)
app.use(errorHandler);

export default app;

