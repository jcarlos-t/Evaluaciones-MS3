import { Request, Response, NextFunction } from "express";
import Progress from "../models/progress";
import { UpsertProgressBody } from "../schemas/progress";
import { ApiError } from "../middlewares/error";

export async function getProgress(req: Request, res: Response, next: NextFunction) {
  try {
    const { studentUid, courseRunUid } = req.params;
    const doc = await Progress.findOne({ studentUid, courseRunUid }).lean();
    if (!doc) throw new ApiError("NOT_FOUND", 404, "Progress not found");
    res.json({ ok: true, data: doc });
  } catch (e) { next(e); }
}

export async function upsertProgress(req: Request, res: Response, next: NextFunction) {
  try {
    const { studentUid, courseRunUid } = req.params;
    const body = UpsertProgressBody.parse(req.body);
    const doc = await Progress.findOneAndUpdate(
      { studentUid, courseRunUid },
      {
        $set: {
          ...(body.completedLessons && { completedLessons: body.completedLessons }),
          ...(body.score?.current != null && { "score.current": body.score.current }),
          lastAccessAt: new Date()
        }
      },
      { upsert: true, new: true }
    );
    res.json({ ok: true, data: doc });
  } catch (e) { next(e); }
}

