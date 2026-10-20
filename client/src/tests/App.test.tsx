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

    // Check stats
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

    // Mock successful retry
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
