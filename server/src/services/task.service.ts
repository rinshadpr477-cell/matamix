import { Types } from 'mongoose';
import { TaskModel } from '../models/task.model';
import { TaskResponseDTO } from '../types/task.types';
import { AppError } from '../middleware/errorHandler';

export interface TaskDocLike {
  _id?: Types.ObjectId | string;
  id?: string;
  title: string;
  completed: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export class TaskService {
  /**
   * Format Mongoose document or lean object to consistent TaskResponseDTO
   */
  private formatTask(doc: TaskDocLike): TaskResponseDTO {
    const rawId = doc._id !== undefined ? doc._id : doc.id;
    const id = rawId instanceof Types.ObjectId ? rawId.toString() : String(rawId ?? '');

    return {
      id,
      title: doc.title,
      completed: doc.completed,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
      updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : String(doc.updatedAt),
    };
  }

  /**
   * Fetch tasks with bounded query limits and pagination support
   */
  async getAllTasks(limit = 100, skip = 0): Promise<TaskResponseDTO[]> {
    const safeLimit = Math.min(Math.max(limit, 1), 200);
    const safeSkip = Math.max(skip, 0);

    const tasks = await TaskModel.find()
      .sort({ createdAt: -1 })
      .skip(safeSkip)
      .limit(safeLimit)
      .lean();

    return tasks.map((task) => this.formatTask(task as unknown as TaskDocLike));
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
   * Atomically toggle task completion status or update completed state
   * Eliminates read-modify-write race conditions in database engine
   */
  async toggleTaskStatus(id: string, explicitCompleted?: boolean): Promise<TaskResponseDTO> {
    let updatedTask: TaskDocLike | null = null;

    if (explicitCompleted !== undefined) {
      updatedTask = await TaskModel.findByIdAndUpdate(
        id,
        { completed: explicitCompleted },
        { new: true, runValidators: true }
      ).lean();
    } else {
      // Atomic toggle pipeline execution without in-memory state race condition
      updatedTask = await TaskModel.findByIdAndUpdate(
        id,
        [{ $set: { completed: { $not: '$completed' } } }],
        { new: true }
      ).lean();
    }

    if (!updatedTask) {
      throw new AppError('Task not found', 404);
    }

    return this.formatTask(updatedTask as unknown as TaskDocLike);
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
