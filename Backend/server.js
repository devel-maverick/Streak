import "dotenv/config";
import express from "express";
import cors from "cors";
import { serve } from "inngest/express";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.routes.js";
import problemRoutes from "./src/routes/problem.routes.js";
import solvedRoutes from "./src/routes/solved.routes.js";
import playgroundRoutes from "./src/routes/playground.routes.js";
import aiRoutes from "./src/routes/ai.routes.js";
import statsRoutes from "./src/routes/stats.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";
import { inngest } from "./src/inngest/client.js";
import { alljobs } from "./src/inngest/functions.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
app.use(
    "/api/inngest",
    serve({
        client: inngest,
        functions: alljobs,
        signingKey: process.env.INNGEST_SIGNING_KEY,
    })
);
app.use("/api/auth", authRoutes)
app.use("/api/problems", problemRoutes)
app.use("/api/solved", solvedRoutes);
app.use("/api/playground", playgroundRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/stats", statsRoutes)
app.use("/api/payment", paymentRoutes)
const staticPath = path.join(__dirname, "../Frontend/dist");
app.use(express.static(staticPath));
app.use((req, res) => {
    const indexPath = path.join(__dirname, "../Frontend/dist/index.html");
    res.sendFile(indexPath);
});




app.listen(port, () => {
    console.log(`Server running on port ${port}`)
}
)
