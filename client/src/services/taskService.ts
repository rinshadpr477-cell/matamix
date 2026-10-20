import { request } from './apiClient';
import { Task } from '../types/task';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const taskService = {
  /**
   * Fetch all tasks
   */
  async getTasks(): Promise<Task[]> {
    return request<Task[]>(`${API_BASE_URL}/tasks`);
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
};
