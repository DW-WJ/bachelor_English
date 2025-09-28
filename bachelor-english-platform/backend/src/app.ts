import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

// 导入路由
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import vocabularyRoutes from "./routes/vocabulary.routes";
import learningRoutes from "./routes/learning.routes";

// 导入中间件
import { errorHandler } from "./middleware/error.middleware";
import { notFound } from "./middleware/notFound.middleware";

// 加载环境变量
dotenv.config();

const app = express();

// 基础中间件
app.use(helmet()); // 安全头
app.use(morgan("combined")); // 日志
app.use(express.json({ limit: "10mb" })); // JSON解析
app.use(express.urlencoded({ extended: true })); // URL编码解析

// CORS配置
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 健康检查
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API路由
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vocabulary", vocabularyRoutes);
app.use("/api/v1/learning", learningRoutes);

// API文档路由
app.get("/api/v1", (req, res) => {
  res.json({
    message: "Bachelor English Learning Platform API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/v1/auth",
      users: "/api/v1/users",
      vocabulary: "/api/v1/vocabulary",
      learning: "/api/v1/learning",
    },
  });
});

// 错误处理中间件
app.use(notFound);
app.use(errorHandler);

export default app;
