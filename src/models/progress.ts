// src/models/progress.ts
import { Schema, model, InferSchemaType } from "mongoose";

const ProgressSchema = new Schema(
  {
    studentUid: { type: String, required: true, trim: true },
    courseRunUid: { type: String, required: true, trim: true },
    completedLessons: { type: [String], default: [] },
    score: {
      current: { type: Number, default: 0, min: 0 },
      max: { type: Number, default: 100, min: 1 }
    },
    lastAccessAt: { type: Date, default: Date.now }
  },
  { timestamps: { createdAt: false, updatedAt: true }, versionKey: false }
);

ProgressSchema.index({ studentUid: 1, courseRunUid: 1 }, { unique: true });
ProgressSchema.index({ lastAccessAt: -1 });

export type ProgressDoc = InferSchemaType<typeof ProgressSchema>;
export default model("progress", ProgressSchema, "progress");

