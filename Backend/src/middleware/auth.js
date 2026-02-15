import jwt from "jsonwebtoken"
import prisma from "../config/db.js"

// Optional authentication - won't block request if no token, just sets req.user to null
export const OptionalAuth = async (req, res, next) => {
    try {
        let token = req.cookies?.token
        if (!token && req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1]
        }

        if (!token) {
            req.user = null;
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            req.user = null;
            return next();
        }

        req.user = decoded;

        next();
    } catch (err) {
        console.error('[OptionalAuth] Token verification failed:', err.message);
        req.user = null;
        next();
    }
};

export const Protected = async (req, res, next) => {
    try {
        let token = req.cookies?.token
        if (!token && req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1]
        }
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        console.error('[Auth Middleware] Error:', err);
        res.status(500).json({ message: "Internal server error during authentication" })
    }
}

