import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { prisma } from "../utils/database";
import { CustomError } from "../middleware/error.middleware";

// 获取学习模块
export const getLearningModules = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const modules = [
      {
        id: "vocabulary",
        name: "词汇学习",
        description: "学习英语单词和短语",
        icon: "📚",
        progress: 0,
        totalLessons: 100,
      },
      {
        id: "grammar",
        name: "语法学习",
        description: "掌握英语语法规则",
        icon: "📝",
        progress: 0,
        totalLessons: 50,
      },
      {
        id: "reading",
        name: "阅读理解",
        description: "提高阅读理解能力",
        icon: "📖",
        progress: 0,
        totalLessons: 30,
      },
      {
        id: "writing",
        name: "写作练习",
        description: "提升英语写作水平",
        icon: "✍️",
        progress: 0,
        totalLessons: 20,
      },
      {
        id: "translation",
        name: "翻译练习",
        description: "中英翻译练习",
        icon: "🔄",
        progress: 0,
        totalLessons: 25,
      },
    ];

    res.json({
      success: true,
      data: modules,
    });
  } catch (error) {
    next(error);
  }
};

// 获取模块进度
export const getModuleProgress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { moduleType } = req.params;

    const progress = await prisma.learningProgress.findMany({
      where: {
        userId,
        moduleType,
      },
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

// 更新模块进度
export const updateModuleProgress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { moduleType } = req.params;
    const { moduleId, progress, completed, score, timeSpent } = req.body;

    const learningProgress = await prisma.learningProgress.upsert({
      where: {
        userId_moduleType_moduleId: {
          userId,
          moduleType,
          moduleId,
        },
      },
      update: {
        progress,
        completed,
        score,
        timeSpent,
        updatedAt: new Date(),
      },
      create: {
        userId,
        moduleType,
        moduleId,
        progress,
        completed,
        score,
        timeSpent,
      },
    });

    res.json({
      success: true,
      message: "进度更新成功",
      data: learningProgress,
    });
  } catch (error) {
    next(error);
  }
};

// 获取学习分析
export const getLearningAnalytics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    // 获取学习统计
    const [totalProgress, testRecords, achievements] = await Promise.all([
      prisma.learningProgress.findMany({
        where: { userId },
      }),
      prisma.testRecord.findMany({
        where: { userId },
        orderBy: { completedAt: "desc" },
        take: 10,
      }),
      prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
      }),
    ]);

    // 计算统计数据
    const totalModules = totalProgress.length;
    const completedModules = totalProgress.filter((p) => p.completed).length;
    const averageScore =
      testRecords.length > 0
        ? testRecords.reduce((sum, record) => sum + record.score, 0) /
          testRecords.length
        : 0;

    const analytics = {
      totalModules,
      completedModules,
      completionRate:
        totalModules > 0 ? (completedModules / totalModules) * 100 : 0,
      averageScore: Math.round(averageScore),
      totalAchievements: achievements.length,
      recentTests: testRecords.slice(0, 5),
      achievements: achievements.slice(0, 10),
    };

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};

// 获取学习推荐
export const getRecommendations = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    // 基于用户进度推荐学习内容
    const recommendations = [
      {
        type: "vocabulary",
        title: "继续学习词汇",
        description: "基于您的进度，建议继续学习中级词汇",
        priority: "high",
      },
      {
        type: "grammar",
        title: "语法练习",
        description: "完成时态语法练习",
        priority: "medium",
      },
      {
        type: "reading",
        title: "阅读理解",
        description: "尝试阅读新闻文章",
        priority: "low",
      },
    ];

    res.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};
