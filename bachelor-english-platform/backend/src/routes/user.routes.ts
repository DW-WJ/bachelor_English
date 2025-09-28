import { Router } from "express";
import {
  getProfile,
  updateProfile,
  getProgress,
  getAchievements,
  deleteAccount,
} from "../controllers/user.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validation.middleware";
import { updateProfileSchema } from "../types/user.types";

const router = Router();

// 所有路由都需要认证
router.use(authenticateToken);

// 获取用户资料
router.get("/profile", getProfile);

// 更新用户资料
router.put("/profile", validateRequest(updateProfileSchema), updateProfile);

// 获取学习进度
router.get("/progress", getProgress);

// 获取用户成就
router.get("/achievements", getAchievements);

// 删除账户
router.delete("/account", deleteAccount);

export default router;
