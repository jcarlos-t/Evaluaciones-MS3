import { Schema, model, InferSchemaType, Types } from "mongoose";

const AssignmentSchema = new Schema(
  {
    lessonUid: { type: String, required: true },
    title: { type: String, required: true, maxlength: 200 },
    maxScore: { type: Number, required: true, min: 1, max: 1000 },
    dueAt: { type: Date, required: true },
    rubric: [{ criterion: String, weight: Number }]
  },
  { timestamps: true, versionKey: false }
);

AssignmentSchema.index({ lessonUid: 1 });
AssignmentSchema.index({ dueAt: 1 });

export type AssignmentDoc = InferSchemaType<typeof AssignmentSchema> & { _id: Types.ObjectId };
export default model("assignments", AssignmentSchema, "assignments");

