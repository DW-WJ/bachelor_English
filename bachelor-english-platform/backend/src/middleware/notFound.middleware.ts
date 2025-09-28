import { Request, Response, NextFunction } from "express";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`未找到路由 - ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: {
      message: `未找到路由 - ${req.originalUrl}`,
      statusCode: 404,
    },
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  });
};
