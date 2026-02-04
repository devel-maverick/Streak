import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.routes.js";
const app = express()
const port = process.env.PORT || 3000
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:5173",
    credentials: true,
  }
))
app.use("/api/auth", authRoutes)
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
}
)