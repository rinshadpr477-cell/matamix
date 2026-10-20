import { TaskModel } from '../models/task.model';
import { TaskResponseDTO } from '../types/task.types';
import { AppError } from '../middleware/errorHandler';

export class TaskService {
  /**
   * Format Mongoose document to consistent TaskResponseDTO
   */
  private formatTask(doc: any): TaskResponseDTO {
    return {
      id: doc._id ? doc._id.toString() : doc.id,
      title: doc.title,
      completed: doc.completed,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
      updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : String(doc.updatedAt),
    };
  }

  /**
   * Fetch all tasks, sorted by newest first
   */
  async getAllTasks(): Promise<TaskResponseDTO[]> {
    const tasks = await TaskModel.find().sort({ createdAt: -1 }).lean();
    return tasks.map((task) => this.formatTask(task));
  }

  /**
   * Create a new task with trimmed title and default completed=false
   */
  async createTask(title: string, completed = false): Promise<TaskResponseDTO> {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      throw new AppError('Task title cannot be empty or whitespace only', 400);
    }

    const newTask = await TaskModel.create({
      title: trimmedTitle,
      completed: Boolean(completed),
    });

    return this.formatTask(newTask);
  }

  /**
   * Toggle task completion status or update completed state
   */
  async toggleTaskStatus(id: string, explicitCompleted?: boolean): Promise<TaskResponseDTO> {
    const task = await TaskModel.findById(id);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    if (explicitCompleted !== undefined) {
      task.completed = explicitCompleted;
    } else {
      task.completed = !task.completed;
    }

    await task.save();
    return this.formatTask(task);
  }

  /**
   * Delete a task by ID
   */
  async deleteTask(id: string): Promise<{ id: string; message: string }> {
    const task = await TaskModel.findByIdAndDelete(id);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    return {
      id: task._id.toString(),
      message: 'Task deleted successfully',
    };
  }
}

export const taskService = new TaskService();
