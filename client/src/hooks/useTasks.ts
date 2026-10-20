import { useState, useEffect, useCallback, useRef } from 'react';
import { Task } from '../types/task';
import { taskService } from '../services/taskService';
import { ApiError } from '../services/apiClient';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await taskService.getTasks();
      if (isMountedRef.current) {
        setTasks(data);
      }
    } catch (err: unknown) {
      if (isMountedRef.current) {
        const message =
          err instanceof ApiError ? err.message : 'Failed to fetch tasks from server.';
        setFetchError(message);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (title: string): Promise<boolean> => {
    const trimmed = title.trim();
    if (!trimmed) {
      setActionError('Task title cannot be empty.');
      return false;
    }
    if (trimmed.length > 200) {
      setActionError('Task title cannot exceed 200 characters.');
      return false;
    }

    setIsCreating(true);
    setActionError(null);
    try {
      const newTask = await taskService.createTask(trimmed);
      if (isMountedRef.current) {
        // Prepend the new task to UI list only after successful backend response
        setTasks((prev) => [newTask, ...prev]);
      }
      return true;
    } catch (err: unknown) {
      if (isMountedRef.current) {
        const message =
          err instanceof ApiError ? err.message : 'Failed to create task.';
        setActionError(message);
      }
      return false;
    } finally {
      if (isMountedRef.current) {
        setIsCreating(false);
      }
    }
  };

  const toggleTask = async (id: string): Promise<void> => {
    // Prevent simultaneous actions on the same item
    if (updatingIds.has(id) || deletingIds.has(id)) return;

    setUpdatingIds((prev) => new Set(prev).add(id));
    setActionError(null);
    try {
      const updated = await taskService.toggleTask(id);
      if (isMountedRef.current) {
        // Update UI only after successful response
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updated : task))
        );
      }
    } catch (err: unknown) {
      if (isMountedRef.current) {
        const message =
          err instanceof ApiError ? err.message : 'Failed to update task status.';
        setActionError(message);
      }
    } finally {
      if (isMountedRef.current) {
        setUpdatingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    }
  };

  const deleteTask = async (id: string): Promise<void> => {
    if (deletingIds.has(id) || updatingIds.has(id)) return;

    setDeletingIds((prev) => new Set(prev).add(id));
    setActionError(null);
    try {
      await taskService.deleteTask(id);
      if (isMountedRef.current) {
        // Remove from UI only after successful response
        setTasks((prev) => prev.filter((task) => task.id !== id));
      }
    } catch (err: unknown) {
      if (isMountedRef.current) {
        const message =
          err instanceof ApiError ? err.message : 'Failed to delete task.';
        setActionError(message);
      }
    } finally {
      if (isMountedRef.current) {
        setDeletingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    }
  };

  const clearActionError = () => {
    setActionError(null);
  };

  return {
    tasks,
    isLoading,
    isCreating,
    updatingIds,
    deletingIds,
    fetchError,
    actionError,
    fetchTasks,
    addTask,
    toggleTask,
    deleteTask,
    clearActionError,
  };
}
