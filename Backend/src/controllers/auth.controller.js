import prisma from "../config/db.js"
import GenerateToken from "../utils/GenerateToken.js"
import bcrypt from "bcrypt"
import axios from "axios"
import { isValidName, isValidEmail, isValidPassword } from "../utils/validator.js"
export const Register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!isValidName(name)) {
            return res.status(400).json({ message: "Invalid name" })
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email" })
        }
        if (!isValidPassword(password)) {
            return res.status(400).json({ message: "Invalid password" })
        }
        const user = await prisma.user.findUnique({ where: { email: email } })
        if (user) {
            return res.status(400).json({ message: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })
        GenerateToken(newUser, res)
        return res.status(201).json({ message: "User created successfully" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email" })
        }
        if (!isValidPassword(password)) {
            return res.status(400).json({ message: "Invalid password" })
        }
        const user = await prisma.user.findUnique({ where: { email: email } })
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" })
        }
        GenerateToken(user, res)
        return res.status(200).json({ message: "User logged in successfully" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const Logout = (req, res) => {
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        path: "/",
    });
    res.json({ message: "Logged out successfully" });
}

export const Me = async (req, res) => {
    try {
        console.log('[Auth] accessing Me endpoint with user:', req.user);
        const user = await prisma.user.findUnique({ where: { id: req.user.id } })
        if (!user) {
            console.log('[Auth] User not found during Me check');
            return res.status(400).json({ message: "User not found" })
        }
        return res.status(200).json({ message: "User found successfully", user })
    } catch (err) {
        console.error('[Auth] Error in Me endpoint:', err);
        res.status(500).json({ message: err.message })
    }
}



{/* Google Oauth */ }

export const googleAuthRedirect = (req, res) => {
    const url =
        "https://accounts.google.com/o/oauth2/v2/auth?" +
        new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            redirect_uri: process.env.GOOGLE_CALLBACK_URL,
            response_type: "code",
            scope: "openid email profile",
        });

    res.redirect(url);
};

export const googleCallback = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.status(400).json({ message: "Authorization code not found" })
        }
        const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            code,
            redirect_uri: process.env.GOOGLE_CALLBACK_URL,
            grant_type: "authorization_code",
        });

        const { access_token } = tokenRes.data;

        const profileRes = await axios.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            {
                headers: { Authorization: `Bearer ${access_token}` },
            }
        );

        const { email, name, picture, id } = profileRes.data;

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    avatar: picture,
                    googleId: id,
                    authProvider: "GOOGLE",
                },
            });
        }

        const token = GenerateToken(user, res);
        console.log(token);

        // In production, backend serves frontend, so relative path works and keeps us on the same domain.
        // In dev, frontend is on a different port (5173), so we need the full URL.
        const isProduction = process.env.NODE_ENV === "production";
        const redirectUrl = isProduction
            ? `/oauth-success?token=${token}`
            : `${process.env.FRONTEND_URL}/oauth-success?token=${token}`;

        res.redirect(redirectUrl);
    } catch (err) {
        console.error("Google OAuth Error:", err.message);
        res.status(500).json({ message: "Google OAuth failed" });
    }
};


import { syncUserStats } from "./stats.controller.js";

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            name,
            codeforcesUsername,
            leetcodeUsername,
            codechefUsername,
            atcoderUsername,
            csesUsername,
            githubUrl,
            linkedinUrl
        } = req.body;

        // First update the profile details
        await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                codeforcesUsername,
                leetcodeUsername,
                codechefUsername,
                atcoderUsername,
                csesUsername,
                githubUrl,
                linkedinUrl
            }
        });
        try {
            console.log(`[Profile Update] Triggering stats sync for user ${userId}`);
            await syncUserStats(userId);
        } catch (syncError) {
            console.error('[Profile Update] Stats sync failed:', syncError.message);
        }

        const finalUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        res.json({ message: "Profile updated successfully", user: finalUser });
    } catch (err) {
        console.error("Profile Update Error:", err.message);
        res.status(500).json({ message: "Failed to update profile" });
    }
}

