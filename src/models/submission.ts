// src/models/submission.ts
import { Schema, model, InferSchemaType, Types } from "mongoose";

const SubmissionSchema = new Schema(
  {
    assignmentId: { type: Schema.Types.ObjectId, required: true, ref: "assignments" },
    studentUid: { type: String, required: true, trim: true },
    files: [{ name: String, url: String }],
    submittedAt: { type: Date, default: Date.now },
    grade: {
      value: { type: Number, min: 0, max: 100, default: null },
      gradedAt: { type: Date, default: null },
      graderUid: { type: String, default: null }
    },
    feedback: { type: String, default: "" }
  },
  { timestamps: true, versionKey: false }
);

SubmissionSchema.index({ assignmentId: 1, studentUid: 1 }, { unique: true });
SubmissionSchema.index({ submittedAt: -1 });

export type SubmissionDoc = InferSchemaType<typeof SubmissionSchema> & { _id: Types.ObjectId };
export default model("submissions", SubmissionSchema, "submissions");

