import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/task.service';
import { ApiResponse, TaskResponseDTO } from '../types/task.types';

export class TaskController {
  /**
   * GET /api/tasks
   * Fetch all tasks from MongoDB
   */
  async getTasks(
    req: Request,
    res: Response<ApiResponse<TaskResponseDTO[]>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const limit = req.query.limit !== undefined ? Number(req.query.limit) : 100;
      const skip = req.query.skip !== undefined ? Number(req.query.skip) : 0;
      const tasks = await taskService.getAllTasks(limit, skip);
      res.status(200).json({
        success: true,
        data: tasks,
        message: 'Tasks retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/tasks
   * Create a new task (completed=false by default)
   */
  async createTask(
    req: Request,
    res: Response<ApiResponse<TaskResponseDTO>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { title, completed } = req.body;
      const createdTask = await taskService.createTask(title, completed);

      res.status(201).json({
        success: true,
        data: createdTask,
        message: 'Task created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/tasks/:id
   * Toggle completion status (or update if explicit boolean provided)
   */
  async toggleTask(
    req: Request,
    res: Response<ApiResponse<TaskResponseDTO>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { completed } = req.body;

      const updatedTask = await taskService.toggleTaskStatus(id, completed);

      res.status(200).json({
        success: true,
        data: updatedTask,
        message: 'Task status updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/tasks/:id
   * Delete task by ObjectId
   */
  async deleteTask(
    req: Request,
    res: Response<ApiResponse<{ id: string; message: string }>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const result = await taskService.deleteTask(id);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Task deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const taskController = new TaskController();
