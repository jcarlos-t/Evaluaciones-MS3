import { Router } from "express";
import * as assignments from "../controllers/assignments";
import * as activity from "../controllers/activity";
import * as submissions from "../controllers/submissions";
import * as progress from "../controllers/progress";

const router = Router();

/**
 * @openapi
 * /:
 *   get:
 *     summary: API root
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Returns service info
 */
router.get("/", (_req, res) => {
  res.json({ ok: true, service: "MS3 — Evaluaciones & Progreso" });
});

// Assignments
router.get("/assignments", assignments.listAssignments);
router.post("/assignments", assignments.createAssignment);
router.put("/assignments/:id", assignments.updateAssignment);
router.delete("/assignments/:id", assignments.deleteAssignment);

// Activity
router.get("/activity", activity.listActivity);
router.post("/activity", activity.createActivity);

// Submissions
router.get("/submissions", submissions.listSubmissions);
router.post("/submissions", submissions.createSubmission);

// Progress
router.get("/progress/:studentUid/:courseRunUid", progress.getProgress);
router.put("/progress/:studentUid/:courseRunUid", progress.upsertProgress);

export default router;

