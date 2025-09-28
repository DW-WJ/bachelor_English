import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { prisma } from "../utils/database";
import { CustomError } from "../middleware/error.middleware";

// 获取词汇列表
export const getVocabulary = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 20, difficulty, partOfSpeech } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (difficulty) where.difficulty = Number(difficulty);
    if (partOfSpeech) where.partOfSpeech = partOfSpeech;

    const [vocabulary, total] = await Promise.all([
      prisma.vocabulary.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.vocabulary.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        vocabulary,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// 获取特定词汇
export const getVocabularyById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const vocabulary = await prisma.vocabulary.findUnique({
      where: { id },
    });

    if (!vocabulary) {
      return next(new CustomError("词汇不存在", 404));
    }

    res.json({
      success: true,
      data: vocabulary,
    });
  } catch (error) {
    next(error);
  }
};

// 学习词汇
export const studyVocabulary = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { vocabularyId, masteryLevel } = req.body;

    // 查找或创建用户词汇记录
    const userVocabulary = await prisma.userVocabulary.upsert({
      where: {
        userId_vocabularyId: {
          userId,
          vocabularyId,
        },
      },
      update: {
        masteryLevel,
        reviewCount: { increment: 1 },
        lastReviewed: new Date(),
        isLearned: masteryLevel >= 80,
      },
      create: {
        userId,
        vocabularyId,
        masteryLevel,
        reviewCount: 1,
        lastReviewed: new Date(),
        isLearned: masteryLevel >= 80,
      },
    });

    res.json({
      success: true,
      message: "学习记录已保存",
      data: userVocabulary,
    });
  } catch (error) {
    next(error);
  }
};

// 复习词汇
export const reviewVocabulary = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { vocabularyIds } = req.body;

    // 获取需要复习的词汇
    const vocabulary = await prisma.vocabulary.findMany({
      where: {
        id: { in: vocabularyIds },
      },
    });

    res.json({
      success: true,
      data: vocabulary,
    });
  } catch (error) {
    next(error);
  }
};

// 词汇测试
export const testVocabulary = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { testData } = req.body;

    // 保存测试记录
    const testRecord = await prisma.testRecord.create({
      data: {
        userId,
        testType: "vocabulary",
        testId: testData.testId,
        score: testData.score,
        totalQuestions: testData.totalQuestions,
        correctAnswers: testData.correctAnswers,
        timeSpent: testData.timeSpent,
        answers: testData.answers,
      },
    });

    res.json({
      success: true,
      message: "测试记录已保存",
      data: testRecord,
    });
  } catch (error) {
    next(error);
  }
};

// 获取词汇学习进度
export const getVocabularyProgress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const progress = await prisma.userVocabulary.findMany({
      where: { userId },
      include: {
        vocabulary: true,
      },
      orderBy: { lastReviewed: "desc" },
    });

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};
