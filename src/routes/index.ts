import { Router } from "express";
import progress from "./progress";
import assignments from "./assignments";
import submissions from "./submissions";
import activity from "./activity";

const router = Router();
router.get("/health", (_req, res) => res.json({ ok: true, data: { status: "ok" } }));

router.use("/progress", progress);
router.use("/assignments", assignments);
router.use("/submissions", submissions);
router.use("/activity", activity);

export default router;

