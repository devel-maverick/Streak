import express from "express";
import { getAllContests,importContests } from "../controllers/contest.controller";
import { protect } from "../middleware/auth.js";
const router = express.Router();
router.get("/", getAllContests);
router.post("/import", protect, importContests);
export default router;