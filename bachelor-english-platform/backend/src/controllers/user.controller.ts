import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { prisma } from "../utils/database";
import { CustomError } from "../middleware/error.middleware";

// 获取用户资料
export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        level: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return next(new CustomError("用户不存在", 404));
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// 更新用户资料
export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const updateData = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        level: true,
        role: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      message: "资料更新成功",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// 获取学习进度
export const getProgress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const progress = await prisma.learningProgress.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

// 获取用户成就
export const getAchievements = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const achievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: { earnedAt: "desc" },
    });

    res.json({
      success: true,
      data: achievements,
    });
  } catch (error) {
    next(error);
  }
};

// 删除账户
export const deleteAccount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({
      success: true,
      message: "账户删除成功",
    });
  } catch (error) {
    next(error);
  }
};
