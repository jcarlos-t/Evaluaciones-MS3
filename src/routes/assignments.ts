import { Router } from "express";
import { listAssignments, createAssignment, updateAssignment, deleteAssignment } from "../controllers/assignments";
const r = Router();
r.get("/", listAssignments);
r.post("/", createAssignment);
r.put("/:id", updateAssignment);
r.delete("/:id", deleteAssignment);
export default r;

