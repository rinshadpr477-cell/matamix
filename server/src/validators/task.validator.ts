import { z } from 'zod';

export const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const taskIdParamSchema = z
  .object({
    id: z
      .string({ required_error: 'Task ID is required' })
      .regex(objectIdRegex, 'Invalid MongoDB ObjectId format'),
  })
  .strict();

export const createTaskSchema = z
  .object({
    title: z
      .string({ required_error: 'Title is required' })
      .trim()
      .min(1, 'Title cannot be empty or contain only whitespace')
      .max(200, 'Title cannot exceed 200 characters'),
    completed: z.boolean().optional(),
  })
  .strict();

export const updateTaskSchema = z
  .object({
    completed: z.boolean().optional(),
  })
  .strict();

export const getTasksQuerySchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(200).default(100),
    skip: z.coerce.number().int().min(0).default(0),
    search: z.string().trim().max(100).optional(),
    completed: z.enum(['true', 'false', 'all']).optional(),
  })
  .strict();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskIdParam = z.infer<typeof taskIdParamSchema>;
export type GetTasksQueryInput = z.infer<typeof getTasksQuerySchema>;
