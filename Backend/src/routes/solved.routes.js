import express from "express";
import { markSolved, getSolved, removeSolved } from "../controllers/solved.controller.js"
import { Protected } from "../middleware/auth.js";

const router = express.Router()

router.post("/:problemId", Protected, markSolved)
router.delete("/:problemId", Protected, removeSolved)
router.get("/", Protected, getSolved)
export default router


