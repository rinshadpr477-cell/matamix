import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import taskRoutes from './routes/task.routes';
import healthRoutes from './routes/health.routes';
import { errorHandler, notFoundHandler, AppError } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';

export function createApp(): Express {
  const app = express();

  // 1. Trust proxy for accurate client IP resolution behind load balancers/reverse proxies
  app.set('trust proxy', env.TRUST_PROXY);

  // 2. Security Headers via Helmet
  app.use(helmet());

  // 3. CORS configuration with explicit origin checking & 403 error mapping
  const allowedOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());
  const hasWildcard = allowedOrigins.includes('*');

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (hasWildcard) {
          // Allow all origins when wildcard is explicitly configured
          return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new AppError(`Origin ${origin} not permitted by CORS policy`, 403));
      },
      credentials: !hasWildcard,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // 3. Body parsing with strict size limits (guards against payload exhaustion attacks)
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));

  // 4. Request Logging (sanitized, omitted in test environment)
  if (env.NODE_ENV !== 'test') {
    app.use((req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
      });
      next();
    });
  }

  // 5. Global Rate Limiter
  app.use('/api', apiLimiter);

  // 6. Application Routes
  app.use('/health', healthRoutes);
  app.use('/api/tasks', taskRoutes);

  // 7. Not Found and Centralized Error Handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
