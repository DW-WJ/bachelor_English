import { z } from "zod";

// 注册验证模式
export const registerSchema = z
  .object({
    email: z.string().email("请输入有效的邮箱地址"),
    username: z
      .string()
      .min(3, "用户名至少3个字符")
      .max(20, "用户名最多20个字符")
      .regex(/^[a-zA-Z0-9_]+$/, "用户名只能包含字母、数字和下划线"),
    password: z
      .string()
      .min(8, "密码至少8个字符")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "密码必须包含大小写字母和数字"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "密码不匹配",
    path: ["confirmPassword"],
  });

// 登录验证模式
export const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(1, "请输入密码"),
});

// 忘记密码验证模式
export const forgotPasswordSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
});

// 重置密码验证模式
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "重置令牌不能为空"),
    password: z
      .string()
      .min(8, "密码至少8个字符")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "密码必须包含大小写字母和数字"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "密码不匹配",
    path: ["confirmPassword"],
  });

// 类型导出
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// JWT载荷类型
export interface JWTPayload {
  id: string;
  email: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

// 认证响应类型
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      username: string;
      role: string;
      level: string;
      avatar?: string;
    };
    token: string;
    refreshToken: string;
  };
}
