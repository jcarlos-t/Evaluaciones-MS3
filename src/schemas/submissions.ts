import { z } from "zod";

export const CreateSubmissionBody = z.object({
  assignmentId: z.string().min(1),
  studentUid: z.string().min(1),
  files: z.array(z.object({ name: z.string(), url: z.string().url() })).default([]),
  submittedAt: z.coerce.date().optional()
});

