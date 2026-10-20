import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const statusCode = dbStatus === 'connected' ? 200 : 503;

  res.status(statusCode).json({
    status: statusCode === 200 ? 'healthy' : 'degraded',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      readyState: mongoose.connection.readyState,
    },
    services: {
      database: {
        status: dbStatus,
        readyState: mongoose.connection.readyState,
      },
    },
  });
});

export default router;
