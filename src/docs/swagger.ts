// src/docs/swagger.ts
import swaggerJSDoc, { type Options } from "swagger-jsdoc";
import type { SwaggerUiOptions } from "swagger-ui-express";

const serverUrl =
  process.env.SWAGGER_SERVER_URL || `http://localhost:${process.env.PORT || 3003}`;

const options: Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "MS3 — Evaluaciones & Progreso",
      version: "1.0.0",
      description: "API de progreso, tareas, envíos y activity logs",
    },
    servers: [{ url: serverUrl, description: "Current environment" }],
    // ⚠️ Sin auth por decisión del proyecto (no añadir securitySchemes / security)
  },
  // Escanea controladores/rutas para @openapi
  apis: ["src/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
export const swaggerUiOptions: SwaggerUiOptions = {
  explorer: true,
  customSiteTitle: "MS3 — Evaluaciones & Progreso",
  swaggerOptions: {
    persistAuthorization: false, // útil si luego activas auth
  },
};

