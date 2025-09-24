import { Request, Response, NextFunction } from "express";
import Activity from "../models/activityLog";
import { CreateActivityBody } from "../schemas/activity";

/**
 * @openapi
 * /activity:
 *   post:
 *     summary: Record an activity event
 *     tags: [Activity]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActivityLogInput'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 data: { $ref: '#/components/schemas/ActivityLog' }
 *   get:
 *     summary: List activity events
 *     tags: [Activity]
 *     parameters:
 *       - in: query
 *         name: studentUid
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: courseRunUid
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: from
 *         description: ISO date lower bound (inclusive)
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: to
 *         description: ISO date upper bound (inclusive)
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 200, default: 50 }
 *     responses:
 *       200:
 *         description: Paginated list of activity events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/ActivityLog' }
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     total: { type: integer }
 *                     hasNext: { type: boolean }
 */
export async function createActivity(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = CreateActivityBody.parse(req.body);
    const doc = await Activity.create({ ...payload, at: payload.at ?? new Date() });
    res.status(201).json({ ok: true, data: doc });
  } catch (e) { next(e as any); }
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
  } catch (e) { next(e as any); }
}

