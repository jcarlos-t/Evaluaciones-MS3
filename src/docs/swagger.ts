// src/docs/swagger.ts
import swaggerJSDoc, { type Options } from "swagger-jsdoc";
import type { SwaggerUiOptions } from "swagger-ui-express";

const options: Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "MS3 — Evaluaciones & Progreso",
      version: "1.0.0",
      description: "API de progreso, tareas, envíos y activity logs"
    },
    servers: [{ url: "http://localhost:3003", description: "Local" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["src/routes/*.ts", "src/controllers/*.ts"]
};

export const swaggerSpec = swaggerJSDoc(options);
export const swaggerUiOptions: SwaggerUiOptions = { explorer: true };

