import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function notFoundHandler(req: Request, res: Response, _next: NextFunction): void {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // Handle JSON parse error (malformed body)
  if ('type' in err && err.type === 'entity.parse.failed') {
    res.status(400).json({
      success: false,
      message: 'Malformed JSON payload in request body',
      error: 'Invalid JSON',
    });
    return;
  }

  // Handle Mongoose CastError (e.g. invalid ObjectId)
  if ('name' in err && err.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: 'Invalid resource identifier format',
      error: 'Invalid ID',
    });
    return;
  }

  // Handle Mongoose ValidationError
  if ('name' in err && err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: 'Database schema validation error',
      error: err.message,
    });
    return;
  }

  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const isProd = env.NODE_ENV === 'production';

  // In production, mask non-operational 500 errors to prevent information disclosure
  let clientMessage: string;
  if (statusCode === 500) {
    clientMessage = isProd ? 'Internal server error' : (err.message || 'Internal server error');
    if (env.NODE_ENV !== 'test') {
      console.error('💥 Unhandled Server Exception:', err);
    }
  } else {
    clientMessage = err.message || 'An error occurred';
  }

  res.status(statusCode).json({
    success: false,
    message: clientMessage,
    ...(!isProd && { stack: err.stack }),
  });
}
