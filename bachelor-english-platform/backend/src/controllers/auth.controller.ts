import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/database";
import { CustomError } from "../middleware/error.middleware";
import { RegisterInput, LoginInput, AuthResponse } from "../types/auth.types";

// 生成JWT令牌
const generateTokens = (payload: any) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  } as jwt.SignOptions);

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  } as jwt.SignOptions);

  return { token, refreshToken };
};

// 用户注册
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, username, password }: RegisterInput = req.body;

    // 检查用户是否已存在
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return next(new CustomError("邮箱或用户名已存在", 400));
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 12);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        level: "beginner",
        role: "student",
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        level: true,
        avatar: true,
        createdAt: true,
      },
    });

    // 生成令牌
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const { token, refreshToken } = generateTokens(payload);

    const response: AuthResponse = {
      success: true,
      message: "注册成功",
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          level: user.level,
          avatar: user.avatar || undefined,
        },
        token,
        refreshToken,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

// 用户登录
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password }: LoginInput = req.body;

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        role: true,
        level: true,
        avatar: true,
        isActive: true,
      },
    });

    if (!user) {
      return next(new CustomError("邮箱或密码错误", 401));
    }

    if (!user.isActive) {
      return next(new CustomError("账户已被禁用", 401));
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new CustomError("邮箱或密码错误", 401));
    }

    // 生成令牌
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const { token, refreshToken } = generateTokens(payload);

    const response: AuthResponse = {
      success: true,
      message: "登录成功",
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          level: user.level,
          avatar: user.avatar || undefined,
        },
        token,
        refreshToken,
      },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

// 用户登出
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 在实际应用中，这里可以将令牌加入黑名单
    res.json({
      success: true,
      message: "登出成功",
    });
  } catch (error) {
    next(error);
  }
};

// 刷新令牌
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new CustomError("刷新令牌不能为空", 401));
    }

    // 验证刷新令牌
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as any;

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        level: true,
        avatar: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return next(new CustomError("用户不存在或已被禁用", 401));
    }

    // 生成新令牌
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const { token, refreshToken: newRefreshToken } = generateTokens(payload);

    res.json({
      success: true,
      message: "令牌刷新成功",
      data: {
        token,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new CustomError("刷新令牌已过期", 401));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new CustomError("无效的刷新令牌", 401));
    }
    return next(error);
  }
};

// 忘记密码
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // 为了安全，不透露用户是否存在
      return res.json({
        success: true,
        message: "如果邮箱存在，重置链接已发送",
      });
    }

    // 在实际应用中，这里应该发送重置邮件
    // 现在只是返回成功消息
    return res.json({
      success: true,
      message: "如果邮箱存在，重置链接已发送",
    });
  } catch (error) {
    return next(error);
  }
};

// 重置密码
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, password } = req.body;

    // 在实际应用中，这里应该验证重置令牌
    // 现在只是返回成功消息
    res.json({
      success: true,
      message: "密码重置成功",
    });
  } catch (error) {
    next(error);
  }
};
