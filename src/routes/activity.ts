import { Router } from "express";
import { createActivity, listActivity } from "../controllers/activity";
const r = Router();
r.get("/", listActivity);
r.post("/", createActivity);
export default r;

