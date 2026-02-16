import express from "express";
import { createSubscription, webhookHandler, getSubscriptionStatus, cancelSubscription, verifySubscription } from "../controllers/payment.controller.js";
import { Protected } from "../middleware/auth.js";
const router = express.Router();

router.post("/create-subscription", Protected, createSubscription);
router.get("/get-subscription-status", Protected, getSubscriptionStatus);
router.post("/cancel-subscription", Protected, cancelSubscription);
router.post("/verify", Protected, verifySubscription);
router.post("/webhook", webhookHandler);
export default router;