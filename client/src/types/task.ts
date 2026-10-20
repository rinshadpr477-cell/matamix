export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: unknown;
}

export type FilterStatus = 'all' | 'active' | 'completed';
