// src/models/assignment.ts
import { Schema, model, InferSchemaType, Types } from "mongoose";

const AssignmentSchema = new Schema(
  {
    lessonUid: { type: String, required: true, trim: true },
    title: { type: String, required: true, maxlength: 200, trim: true },
    maxScore: { type: Number, required: true, min: 1, max: 1000 },
    dueAt: { type: Date, required: true },
    rubric: [{
      criterion: { type: String, trim: true },
      weight: { type: Number, min: 0 }
    }]
  },
  { timestamps: true, versionKey: false }
);

AssignmentSchema.index({ lessonUid: 1 });
AssignmentSchema.index({ dueAt: 1 });

export type AssignmentDoc = InferSchemaType<typeof AssignmentSchema> & { _id: Types.ObjectId };
export default model("assignments", AssignmentSchema, "assignments");

