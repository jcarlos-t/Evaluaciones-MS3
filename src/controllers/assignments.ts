import { Request, Response, NextFunction } from "express";
import { CreateAssignmentBody, UpdateAssignmentBody } from "../schemas/assignments";
import Assignment from "../models/assignment";
import { ApiError } from "../middlewares/error";

export async function listAssignments(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseRunUid, page = "1", limit = "20" } = req.query as Record<string,string>;
    const p = Math.max(parseInt(page), 1), l = Math.min(Math.max(parseInt(limit),1), 100);
    const q: any = {};
    if (courseRunUid) q["lessonUid"] = { $regex: courseRunUid as string }; // ajusta si tienes mapping lección↔run

    const [items, total] = await Promise.all([
      Assignment.find(q).sort({ dueAt: 1 }).skip((p-1)*l).limit(l).lean(),
      Assignment.countDocuments(q)
    ]);
    res.json({ ok: true, data: items, meta: { page: p, limit: l, total, hasNext: p*l < total } });
  } catch (e) { next(e); }
}

export async function createAssignment(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = CreateAssignmentBody.parse(req.body);
    const doc = await Assignment.create(payload);
    res.status(201).json({ ok: true, data: doc });
  } catch (e) { next(e); }
}

export async function updateAssignment(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = UpdateAssignmentBody.parse(req.body);
    const doc = await Assignment.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!doc) throw new ApiError("NOT_FOUND", 404, "Assignment not found");
    res.json({ ok: true, data: doc });
  } catch (e) { next(e); }
}

export async function deleteAssignment(req: Request, res: Response, next: NextFunction) {
  try {
    const r = await Assignment.findByIdAndDelete(req.params.id);
    if (!r) throw new ApiError("NOT_FOUND", 404, "Assignment not found");
    res.status(204).send();
  } catch (e) { next(e); }
}

