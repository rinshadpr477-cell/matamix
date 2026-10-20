import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import { taskService } from '../services/taskService';
import { ApiError } from '../services/apiClient';

vi.mock('../services/taskService', () => ({
  taskService: {
    getTasks: vi.fn(),
    createTask: vi.fn(),
    toggleTask: vi.fn(),
    deleteTask: vi.fn(),
  },
}));

describe('App Full Integration Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially, then empty state when no tasks exist', async () => {
    vi.mocked(taskService.getTasks).mockResolvedValueOnce([]);

    render(<App />);

    expect(screen.getByText(/Loading tasks.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Your task list is clean and clear!/i)).toBeInTheDocument();
  });

  it('renders tasks when fetched from API', async () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Implement Authentication',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Review Pull Request',
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    vi.mocked(taskService.getTasks).mockResolvedValueOnce(mockTasks);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Implement Authentication')).toBeInTheDocument();
      expect(screen.getByText('Review Pull Request')).toBeInTheDocument();
    });

    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
  });

  it('allows user to create a new task and adds it to the list', async () => {
    const user = userEvent.setup();
    vi.mocked(taskService.getTasks).mockResolvedValueOnce([]);
    vi.mocked(taskService.createTask).mockResolvedValueOnce({
      id: '3',
      title: 'Setup Redis Caching',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Add a new task/i);
    await user.type(input, 'Setup Redis Caching');

    const addBtn = screen.getByRole('button', { name: /Add Task/i });
    await user.click(addBtn);

    await waitFor(() => {
      expect(screen.getByText('Setup Redis Caching')).toBeInTheDocument();
    });
  });

  it('toggles task completion and updates the UI only after successful API response', async () => {
    const user = userEvent.setup();
    const initialTask = {
      id: 'task-10',
      title: 'Config rate limiting',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    vi.mocked(taskService.getTasks).mockResolvedValueOnce([initialTask]);
    vi.mocked(taskService.toggleTask).mockResolvedValueOnce({
      ...initialTask,
      completed: true,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Config rate limiting')).toBeInTheDocument();
    });

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    await user.click(checkbox);

    await waitFor(() => {
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
    });
  });

  it('deletes a task and removes it from the UI upon successful API response', async () => {
    const user = userEvent.setup();
    const taskToDelete = {
      id: 'task-del',
      title: 'Obsolete task',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    vi.mocked(taskService.getTasks).mockResolvedValueOnce([taskToDelete]);
    vi.mocked(taskService.deleteTask).mockResolvedValueOnce({
      id: 'task-del',
      message: 'Task deleted successfully',
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Obsolete task')).toBeInTheDocument();
    });

    const deleteBtn = screen.getByRole('button', { name: /Delete task/i });
    await user.click(deleteBtn);

    await waitFor(() => {
      expect(screen.queryByText('Obsolete task')).not.toBeInTheDocument();
    });
  });

  it('displays action error banner when task mutation fails', async () => {
    const user = userEvent.setup();
    const taskItem = {
      id: 'task-fail',
      title: 'Failing toggle',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    vi.mocked(taskService.getTasks).mockResolvedValueOnce([taskItem]);
    vi.mocked(taskService.toggleTask).mockRejectedValueOnce(
      new ApiError('Failed to update task status.', 500)
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Failing toggle')).toBeInTheDocument();
    });

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    await waitFor(() => {
      expect(screen.getByText(/Failed to update task status./i)).toBeInTheDocument();
    });
  });

  it('displays error banner and retry option when API fetch fails', async () => {
    const user = userEvent.setup();
    vi.mocked(taskService.getTasks).mockRejectedValueOnce(
      new ApiError('Unable to connect to the server.', 503)
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Unable to connect to the server./i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Retry Connection/i })).toBeInTheDocument();
    });

    vi.mocked(taskService.getTasks).mockResolvedValueOnce([
      {
        id: '99',
        title: 'Recovered Task',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    await user.click(screen.getByRole('button', { name: /Retry Connection/i }));

    await waitFor(() => {
      expect(screen.getByText('Recovered Task')).toBeInTheDocument();
    });
  });
});
