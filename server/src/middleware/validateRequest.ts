import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export function validateBody(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = req.body ?? {};
      req.body = await schema.parseAsync(payload);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.errors.map((err) => ({
          field: err.path.join('.') || 'body',
          message: err.message,
        }));
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          error: issues[0]?.message || 'Invalid request body',
          details: issues,
        });
        return;
      }
      next(error);
    }
  };
}

export function validateParams(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.params = await schema.parseAsync(req.params ?? {});
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.errors.map((err) => ({
          field: err.path.join('.') || 'params',
          message: err.message,
        }));
        res.status(400).json({
          success: false,
          message: 'Invalid URL parameter',
          error: issues[0]?.message || 'Invalid URL parameter',
          details: issues,
        });
        return;
      }
      next(error);
    }
  };
}
