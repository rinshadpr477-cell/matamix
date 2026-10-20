import { request } from './apiClient';
import { Task } from '../types/task';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');

export interface GetTasksOptions {
  search?: string;
  completed?: 'true' | 'false' | 'all';
  limit?: number;
  skip?: number;
}

export const taskService = {
  /**
   * Fetch tasks with optional server-side search, completion filter, and pagination
   */
  async getTasks(options?: GetTasksOptions): Promise<Task[]> {
    const params = new URLSearchParams();
    if (options?.limit) params.set('limit', String(options.limit));
    if (options?.skip) params.set('skip', String(options.skip));
    if (options?.search) params.set('search', options.search);
    if (options?.completed && options.completed !== 'all') {
      params.set('completed', options.completed);
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request<Task[]>(`${API_BASE_URL}/tasks${queryString}`);
  },

  /**
   * Create a new task with given title
   */
  async createTask(title: string): Promise<Task> {
    return request<Task>(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  },

  /**
   * Toggle or set completion status
   */
  async toggleTask(id: string, completed?: boolean): Promise<Task> {
    const body = completed !== undefined ? JSON.stringify({ completed }) : JSON.stringify({});
    return request<Task>(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PATCH',
      body,
    });
  },

  /**
   * Delete a task by ID
   */
  async deleteTask(id: string): Promise<{ id: string; message: string }> {
    return request<{ id: string; message: string }>(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Atomically purge all completed tasks
   */
  async purgeCompletedTasks(): Promise<{ deletedCount: number; message: string }> {
    return request<{ deletedCount: number; message: string }>(`${API_BASE_URL}/tasks/completed`, {
      method: 'DELETE',
    });
  },
};
