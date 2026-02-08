import express from "express";
import { getAllContests, importContests } from "../controllers/contest.controller.js";
import { Protected } from "../middleware/auth.js";
const router = express.Router();
router.get("/", getAllContests);
router.post("/import", Protected, importContests);
export default router;
