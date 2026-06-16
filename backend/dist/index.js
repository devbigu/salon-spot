import express, {} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import apiRoutes from "./routes/index.js";
const app = express();
const PORT = env.PORT || 5000;
// Global middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
}));
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
    });
});
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
    });
});
app.use("/api", apiRoutes);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
