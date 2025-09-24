import { Router } from "express";
import { createSubmission, listSubmissions } from "../controllers/submissions";
const r = Router();
r.get("/", listSubmissions);
r.post("/", createSubmission);
export default r;

