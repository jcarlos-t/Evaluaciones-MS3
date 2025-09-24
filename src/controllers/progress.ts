import { Request, Response, NextFunction } from "express";
import Progress from "../models/progress";
import { UpsertProgressBody, UpsertProgressBodyT } from "../schemas/progress";
import { ApiError } from "../middlewares/error";

/**
 * @openapi
 * /progress/{studentUid}/{courseRunUid}:
 *   get:
 *     summary: Get a student's progress in a course run
 *     tags: [Progress]
 *     parameters:
 *       - in: path
 *         name: studentUid
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: path
 *         name: courseRunUid
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Progress document
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/Progress'
 *       404:
 *         description: Progress not found
 *   put:
 *     summary: Create or update a student's progress in a course run
 *     tags: [Progress]
 *     parameters:
 *       - in: path
 *         name: studentUid
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: path
 *         name: courseRunUid
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpsertProgress'
 *     responses:
 *       200:
 *         description: Upserted progress
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/Progress'
 */
export async function getProgress(req: Request, res: Response, next: NextFunction) {
  try {
    const { studentUid, courseRunUid } = req.params;
    const doc = await Progress.findOne({ studentUid, courseRunUid }).lean();
    if (!doc) throw new ApiError("NOT_FOUND", 404, "Progress not found");
    res.json({ ok: true, data: doc });
  } catch (e) {
    next(e as any);
  }
}

export async function upsertProgress(req: Request, res: Response, next: NextFunction) {
  try {
    const { studentUid, courseRunUid } = req.params;
    const body: UpsertProgressBodyT = UpsertProgressBody.parse(req.body);

    const $set: Record<string, unknown> = { lastAccessAt: new Date() };
    if (body.completedLessons) $set.completedLessons = body.completedLessons;
    if (body.score?.current != null) $set["score.current"] = body.score.current;
    if (body.score?.max != null) $set["score.max"] = body.score.max; // ahora permitido por el schema

    const doc = await Progress.findOneAndUpdate(
      { studentUid, courseRunUid },
      { $set },
      { upsert: true, new: true }
    ).lean();

    res.json({ ok: true, data: doc });
  } catch (e) {
    next(e as any);
  }
}

