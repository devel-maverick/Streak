import express from "express";
import {  AIChat,
  AnalyzeRoute,
  explainWrongOutputRoute,
  improvementSuggestionsRoute,
  getChatHistoryRoute,
  clearChatHistoryRoute,} from "../controllers/ai.controller.js";
import { Protected } from "../middleware/auth.js";
const router=express.Router();

router.post("/chat",Protected, AIChat);
router.post("/analyze",Protected, AnalyzeRoute);
router.post("/explain-wrong-output",Protected, explainWrongOutputRoute);
router.post("/improvement-suggestions",Protected, improvementSuggestionsRoute);
router.get("/chat-history",Protected, getChatHistoryRoute);
router.delete("/clear-chat-history",Protected, clearChatHistoryRoute);
export default router;