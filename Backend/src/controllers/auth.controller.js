import prisma from "../config/db.js"
import GenerateToken from "../utils/GenerateToken.js"
import bcrypt from "bcrypt"
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
        const user = await prisma.user.findUnique({ where: { id: req.user.id } })
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        return res.status(200).json({ message: "User found successfully", user })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}