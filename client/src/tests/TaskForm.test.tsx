import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TaskForm } from '../components/TaskForm';

describe('TaskForm Component', () => {
  it('renders input and submit button', () => {
    const handleAdd = vi.fn().mockResolvedValue(true);
    render(<TaskForm onAddTask={handleAdd} isCreating={false} />);

    expect(
      screen.getByPlaceholderText(/Add a new task/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Task/i })).toBeInTheDocument();
  });

  it('rejects empty submission and shows validation message', async () => {
    const user = userEvent.setup();
    const handleAdd = vi.fn().mockResolvedValue(true);
    render(<TaskForm onAddTask={handleAdd} isCreating={false} />);

    const input = screen.getByPlaceholderText(/Add a new task/i);
    await user.type(input, '   ');
    // Button is disabled when input is only whitespace
    expect(screen.getByRole('button', { name: /Add Task/i })).toBeDisabled();
    expect(handleAdd).not.toHaveBeenCalled();
  });

  it('submits trimmed title and clears input upon success', async () => {
    const user = userEvent.setup();
    const handleAdd = vi.fn().mockResolvedValue(true);
    render(<TaskForm onAddTask={handleAdd} isCreating={false} />);

    const input = screen.getByPlaceholderText(/Add a new task/i);
    await user.type(input, '  New Architecture Design  ');

    const submitBtn = screen.getByRole('button', { name: /Add Task/i });
    expect(submitBtn).toBeEnabled();
    await user.click(submitBtn);

    expect(handleAdd).toHaveBeenCalledTimes(1);
    expect(handleAdd).toHaveBeenCalledWith('New Architecture Design');
    expect(input).toHaveValue('');
  });

  it('disables input and displays loading indicator while creating', () => {
    const handleAdd = vi.fn();
    render(<TaskForm onAddTask={handleAdd} isCreating={true} />);

    expect(screen.getByPlaceholderText(/Add a new task/i)).toBeDisabled();
    expect(screen.getByText(/Adding.../i)).toBeInTheDocument();
  });
});
