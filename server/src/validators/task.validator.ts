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

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskIdParam = z.infer<typeof taskIdParamSchema>;
