import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.routes.js";
const app = express()
const port = process.env.PORT || 3000
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use("/api/auth", authRoutes)
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
}
)