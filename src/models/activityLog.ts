// src/models/activityLog.ts
import { Schema, model, InferSchemaType } from "mongoose";

const ActivityLogSchema = new Schema(
  {
    actorUid: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["LESSON_VIEW", "QUIZ_ATTEMPT", "SUBMISSION_CREATE", "ENROLLMENT_STATE"],
      required: true
    },
    courseRunUid: { type: String, required: true, trim: true },
    lessonUid: { type: String, default: null },
    meta: { type: Schema.Types.Mixed, default: {} },
    at: { type: Date, default: Date.now }
  },
  { timestamps: false, versionKey: false }
);

ActivityLogSchema.index({ actorUid: 1, at: -1 });
ActivityLogSchema.index({ courseRunUid: 1, at: -1 });

export type ActivityLogDoc = InferSchemaType<typeof ActivityLogSchema>;
export default model("activity_logs", ActivityLogSchema, "activity_logs");

