import { z } from "zod";

export const CreateAssignmentBody = z.object({
  lessonUid: z.string().min(1),
  title: z.string().min(1).max(200),
  maxScore: z.number().int().min(1).max(1000),
  dueAt: z.coerce.date(),
  rubric: z.array(z.object({ criterion: z.string(), weight: z.number().min(0) })).default([])
});

export const UpdateAssignmentBody = CreateAssignmentBody.partial();

