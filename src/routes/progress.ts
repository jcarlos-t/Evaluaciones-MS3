import { Router } from "express";
import { getProgress, upsertProgress } from "../controllers/progress";
// import { auth } from "../middlewares/auth"; // lo agregarás en fase de seguridad
const r = Router();
r.get("/:studentUid/:courseRunUid", /*auth()*/ getProgress);
r.put("/:studentUid/:courseRunUid", /*auth()*/ upsertProgress);
export default r;

