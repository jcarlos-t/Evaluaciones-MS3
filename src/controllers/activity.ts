import { Request, Response, NextFunction } from "express";
import Activity from "../models/activityLog";
import { CreateActivityBody } from "../schemas/activity";

export async function createActivity(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = CreateActivityBody.parse(req.body);
    const doc = await Activity.create({ ...payload, at: payload.at ?? new Date() });
    res.status(201).json({ ok: true, data: doc });
  } catch (e) { next(e); }
}

export async function listActivity(req: Request, res: Response, next: NextFunction) {
  try {
    const { studentUid, courseRunUid, from, to, page = "1", limit = "50" } = req.query as Record<string,string>;
    const p = Math.max(parseInt(page), 1), l = Math.min(Math.max(parseInt(limit),1), 200);
    const q: any = {};
    if (studentUid) q.actorUid = studentUid;
    if (courseRunUid) q.courseRunUid = courseRunUid;
    if (from || to) q.at = { ...(from ? { $gte: new Date(from) } : {}), ...(to ? { $lte: new Date(to) } : {}) };

    const [items, total] = await Promise.all([
      Activity.find(q).sort({ at: -1 }).skip((p-1)*l).limit(l).lean(),
      Activity.countDocuments(q)
    ]);
    res.json({ ok: true, data: items, meta: { page: p, limit: l, total, hasNext: p*l < total } });
  } catch (e) { next(e); }
}

