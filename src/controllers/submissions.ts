import { Request, Response, NextFunction } from "express";
import Submission from "../models/submission";
import { CreateSubmissionBody } from "../schemas/submissions";
import { ApiError } from "../middlewares/error";
import mongoose from "mongoose";

/**
 * @openapi
 * /submissions:
 *   get:
 *     summary: List submissions
 *     tags: [Submissions]
 *     parameters:
 *       - in: query
 *         name: assignmentId
 *         schema: { type: string }
 *       - in: query
 *         name: studentUid
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: List of submissions
 *   post:
 *     summary: Create a submission
 *     tags: [Submissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SubmissionInput' }
 *     responses:
 *       201:
 *         description: Created
 *       409:
 *         description: Submission already exists
 */
export async function createSubmission(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = CreateSubmissionBody.parse(req.body);
    const assignmentId = new mongoose.Types.ObjectId(payload.assignmentId);
    const exists = await Submission.findOne({ assignmentId, studentUid: payload.studentUid }).lean();
    if (exists) throw new ApiError("DUPLICATE", 409, "Submission already exists");
    const doc = await Submission.create({ ...payload, assignmentId, submittedAt: payload.submittedAt ?? new Date() });
    res.status(201).json({ ok: true, data: doc });
  } catch (e) { next(e as any); }
}

export async function listSubmissions(req: Request, res: Response, next: NextFunction) {
  try {
    const { assignmentId, studentUid } = req.query as Record<string,string>;
    const q: any = {};
    if (assignmentId) q.assignmentId = new mongoose.Types.ObjectId(assignmentId);
    if (studentUid) q.studentUid = studentUid;
    const items = await Submission.find(q).sort({ submittedAt: -1 }).lean();
    res.json({ ok: true, data: items });
  } catch (e) { next(e as any); }
}

