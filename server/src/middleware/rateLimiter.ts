import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.NODE_ENV === 'test' ? 10000 : env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});

export const mutationLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.NODE_ENV === 'test' ? 10000 : env.MUTATION_RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many creation or modification requests. Please slow down.',
  },
});
