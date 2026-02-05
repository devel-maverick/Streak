import { Protected } from "../middleware/auth";
import express from "express";
import {markSolved,getSolved} from "../controllers/solved.controller.js"

const router=express.Router()

router.post("/:problemId",Protected,markSolved)
router.get("/",Protected,getSolved)
export default router


