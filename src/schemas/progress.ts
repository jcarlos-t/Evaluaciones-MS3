import { z } from "zod";

export const UpsertProgressBody = z.object({
  completedLessons: z.array(z.string()).optional(),
  score: z
    .object({
      current: z.number().optional(),
      max: z.number().optional(), // <-- añadir max como opcional
    })
    .optional(),
});

export type UpsertProgressBodyT = z.infer<typeof UpsertProgressBody>;

