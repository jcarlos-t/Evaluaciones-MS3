import { z } from "zod";

export const CreateActivityBody = z.object({
  actorUid: z.string(),
  type: z.enum(["LESSON_VIEW","QUIZ_ATTEMPT","SUBMISSION_CREATE","ENROLLMENT_STATE"]),
  courseRunUid: z.string(),
  lessonUid: z.string().nullable().optional(),
  meta: z.record(z.any()).default({}),
  at: z.coerce.date().optional()
});

