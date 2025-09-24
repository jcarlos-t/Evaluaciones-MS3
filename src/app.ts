import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec, swaggerUiOptions } from "./docs/swagger";
import routes from "./routes";
import { requestId } from "./middlewares/requestId";
import { errorHandler } from "./middlewares/error";

const app = express();

// Middlewares base
app.use(requestId);
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan(":method :url :status - rid=:req[x-request-id] - :response-time ms"));

// Swagger (UI + spec)
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Rutas de la API (puedes versionar con /api/v1 si quieres)
app.use("/", routes);

// Manejo de errores (al final)
app.use(errorHandler);

export default app;

