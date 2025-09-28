import { Router } from "express";
import {
  getVocabulary,
  getVocabularyById,
  studyVocabulary,
  reviewVocabulary,
  testVocabulary,
  getVocabularyProgress,
} from "../controllers/vocabulary.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// 所有路由都需要认证
router.use(authenticateToken);

// 获取词汇列表
router.get("/", getVocabulary);

// 获取特定词汇
router.get("/:id", getVocabularyById);

// 学习词汇
router.post("/study", studyVocabulary);

// 复习词汇
router.post("/review", reviewVocabulary);

// 词汇测试
router.post("/test", testVocabulary);

// 获取词汇学习进度
router.get("/progress/:userId", getVocabularyProgress);

export default router;
