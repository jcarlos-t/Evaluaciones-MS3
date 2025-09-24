// src/config/env.ts
import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().default(3003),
  MONGO_URI: z.string().url().or(z.string().startsWith("mongodb://")),
  CORS_ORIGIN: z.string().optional(),
  SWAGGER_SERVER_URL: z.string().optional(),
});

export const env = schema.parse(process.env);

