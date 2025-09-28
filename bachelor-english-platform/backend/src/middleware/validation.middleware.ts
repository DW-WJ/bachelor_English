import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";
import { CustomError } from "./error.middleware";

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // 验证请求体
      if (req.body && Object.keys(req.body).length > 0) {
        req.body = schema.parse(req.body) as any;
      }

      // 验证查询参数
      if (req.query && Object.keys(req.query).length > 0) {
        req.query = schema.parse(req.query) as any;
      }

      // 验证路径参数
      if (req.params && Object.keys(req.params).length > 0) {
        req.params = schema.parse(req.params) as any;
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return next(new CustomError("请求数据验证失败", 400));
      }
      return next(error);
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query) as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new CustomError("查询参数验证失败", 400));
      }
      return next(error);
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params) as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new CustomError("路径参数验证失败", 400));
      }
      return next(error);
    }
  };
};
