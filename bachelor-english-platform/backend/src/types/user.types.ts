import { z } from "zod";

// 更新用户资料验证模式
export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, "用户名至少3个字符")
    .max(20, "用户名最多20个字符")
    .regex(/^[a-zA-Z0-9_]+$/, "用户名只能包含字母、数字和下划线")
    .optional(),
  avatar: z.string().url("请输入有效的头像URL").optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
});

// 类型导出
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// 用户资料响应类型
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  level: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 学习进度类型
export interface LearningProgress {
  id: string;
  moduleType: string;
  moduleId: string;
  progress: number;
  completed: boolean;
  score?: number;
  timeSpent?: number;
  createdAt: string;
  updatedAt: string;
}

// 成就类型
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  points: number;
  category: string;
  earnedAt?: string;
}

// 学习统计类型
export interface LearningStats {
  totalWordsLearned: number;
  totalTimeSpent: number;
  averageScore: number;
  streakDays: number;
  achievementsCount: number;
  level: string;
}
