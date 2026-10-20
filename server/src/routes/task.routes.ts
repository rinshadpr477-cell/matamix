import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { validateBody, validateParams } from '../middleware/validateRequest';
import {
  createTaskSchema,
  taskIdParamSchema,
  updateTaskSchema,
} from '../validators/task.validator';
import { mutationLimiter } from '../middleware/rateLimiter';

const router = Router();

// GET /api/tasks - Retrieve all tasks
router.get('/', (req, res, next) => taskController.getTasks(req, res, next));

// POST /api/tasks - Create a new task
router.post(
  '/',
  mutationLimiter,
  validateBody(createTaskSchema),
  (req, res, next) => taskController.createTask(req, res, next)
);

// PATCH /api/tasks/:id - Toggle or update task completion
router.patch(
  '/:id',
  mutationLimiter,
  validateParams(taskIdParamSchema),
  validateBody(updateTaskSchema),
  (req, res, next) => taskController.toggleTask(req, res, next)
);

// DELETE /api/tasks/:id - Remove task by id
router.delete(
  '/:id',
  mutationLimiter,
  validateParams(taskIdParamSchema),
  (req, res, next) => taskController.deleteTask(req, res, next)
);

export default router;
