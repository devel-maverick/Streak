import razorpay from "razorpay";
import crypto from "crypto";
import prisma from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


export const createSubscription = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        })
        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }
        if (user.subscriptionPlan === "PRO") {
            return res.status(400).json({
                message: "user is already a pro"
            })
        }
        const subscription = await razorpayInstance.subscriptions.create({
            plan_id: process.env.RAZORPAY_PLAN_ID,
            customer_notify: 1,
            quantity: 1,
            total_count: 1,
            notes: {
                userId: user.id,
                email: user.email
            }
        })
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                razorpaySubscriptionId: subscription.id,
            }
        })
        return res.status(200).json({
            message: "subscription created successfully",
            subscriptionId: subscription.id
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "failed to create subscription"
        })
    }
}


export const webhookHandler = async (req, res) => {
    try {
        const signature = req.headers["x-razorpay-signature"];
        // Verify that the secret exists
        if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
            console.error("RAZORPAY_WEBHOOK_SECRET is missing");
            return res.status(500).json({ message: "Server configuration error" });
        }

        const expected = crypto
            .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(JSON.stringify(req.body))
            .digest("hex");

        if (signature !== expected) {
            return res.status(400).json({
                message: "invalid signature"
            })
        }
        const event = req.body.event;
        const payload = req.body.payload?.subscription?.entity ||
            req.body.payload?.payment?.entity;

        if (event === "subscription.activated") {
            const userId = payload.notes?.userId;
            const endDate = Date.now(payload.current_period_end * 1000)
            await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    subscriptionPlan: "PRO",
                    subscriptionEndDate: endDate,
                    razorpayCustomerId: payload.customer_id,
                }
            })
        }
        if (event === "subscription.cancelled") {
            const userId = payload.notes?.userId;
            await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    subscriptionPlan: "FREE",
                    subscriptionEndDate: null,
                    razorpayCustomerId: null,
                }
            })
        }

        return res.status(200).json({
            received: true
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "webhook failed"
        })
    }
}


export const getSubscriptionStatus = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                subscriptionPlan: true,
                subscriptionEndDate: true,
                razorpayCustomerId: true,
            }
        })

        let razorpayStatus = null;
        if (user.razorpaySubscriptionId) {
            try {
                const subscription = await razorpayInstance.subscriptions.fetch(user.razorpaySubscriptionId);
                razorpayStatus = {
                    id: subscription.id,
                    status: subscription.status,
                    currentStart: new Date(subscription.current_start * 1000),
                    currentEnd: new Date(subscription.current_end * 1000),
                };
            } catch (err) {
                console.log(err);
                razorpayStatus = "failed";
            }

        }
        return res.status(200).json({
            subscriptionPlan: user.subscriptionPlan,
            subscriptionEndDate: user.subscriptionEndDate,
        })


    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "failed to get subscription status"
        })
    }
}

export const cancelSubscription = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
        });

        if (!user.razorpaySubscriptionId) {
            return res.status(400).json({ message: "No active subscription" });
        }

        await razorpay.subscriptions.cancel(user.razorpaySubscriptionId, {
            cancel_at_cycle_end: 1,
        });

        return res.json({
            message: "Subscription will cancel at billing end",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Cancel failed" });
    }
};