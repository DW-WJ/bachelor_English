import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller";
import { validateRequest } from "../middleware/validation.middleware";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../types/auth.types";

const router = Router();

// 用户注册
router.post("/register", validateRequest(registerSchema), register);

// 用户登录
router.post("/login", validateRequest(loginSchema), login);

// 用户登出
router.post("/logout", logout);

// 刷新令牌
router.post("/refresh", refreshToken);

// 忘记密码
router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  forgotPassword
);

// 重置密码
router.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  resetPassword
);

export default router;
