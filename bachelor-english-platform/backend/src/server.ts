import app from "./app";
import { connectDatabase } from "./utils/database";

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // 连接数据库
    await connectDatabase();
    console.log("✅ 数据库连接成功");

    // 启动服务器
    app.listen(PORT, () => {
      console.log(`🚀 服务器运行在端口 ${PORT}`);
      console.log(`📚 Bachelor English Learning Platform API`);
      console.log(`🌍 环境: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 API文档: http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error("❌ 服务器启动失败:", error);
    process.exit(1);
  }
}

// 优雅关闭
process.on("SIGTERM", () => {
  console.log("🛑 收到SIGTERM信号，正在关闭服务器...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 收到SIGINT信号，正在关闭服务器...");
  process.exit(0);
});

// 启动服务器
startServer();
