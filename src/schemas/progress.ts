import { z } from "zod";

export const UpsertProgressBody = z.object({
  completedLessons: z.array(z.string()).optional(),
  score: z.object({ current: z.number().int().min(0).max(1000) }).partial().optional()
});

