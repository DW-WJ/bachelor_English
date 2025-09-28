import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { statusCode = 500, message } = error;

  // 处理Prisma错误
  if (error.name === "PrismaClientKnownRequestError") {
    statusCode = 400;
    message = "数据库操作失败";
  }

  // 处理JWT错误
  if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "无效的访问令牌";
  }

  if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "访问令牌已过期";
  }

  // 处理验证错误
  if (error.name === "ZodError") {
    statusCode = 400;
    message = "请求数据验证失败";
  }

  // 开发环境显示详细错误
  const isDevelopment = process.env.NODE_ENV === "development";

  const errorResponse = {
    success: false,
    error: {
      message,
      ...(isDevelopment && { stack: error.stack, details: error }),
    },
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  };

  console.error("❌ 错误详情:", {
    message: error.message,
    stack: error.stack,
    statusCode,
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json(errorResponse);
};
