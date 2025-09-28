import { Router } from "express";
import {
  getLearningModules,
  getModuleProgress,
  updateModuleProgress,
  getLearningAnalytics,
  getRecommendations,
} from "../controllers/learning.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// 所有路由都需要认证
router.use(authenticateToken);

// 获取学习模块
router.get("/modules", getLearningModules);

// 获取模块进度
router.get("/progress/:moduleType", getModuleProgress);

// 更新模块进度
router.put("/progress/:moduleType", updateModuleProgress);

// 获取学习分析
router.get("/analytics", getLearningAnalytics);

// 获取学习推荐
router.get("/recommendations", getRecommendations);

export default router;
