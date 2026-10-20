import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TaskItem } from '../components/TaskItem';
import { Task } from '../types/task';

describe('TaskItem Component', () => {
  const mockTask: Task = {
    id: '60d5ecb8b487343568912345',
    title: 'Deploy to Cloud',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('renders title and unchecked status', () => {
    const handleToggle = vi.fn();
    const handleDelete = vi.fn();

    render(
      <TaskItem
        task={mockTask}
        onToggle={handleToggle}
        onDelete={handleDelete}
        isUpdating={false}
        isDeleting={false}
      />
    );

    expect(screen.getByText('Deploy to Cloud')).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  it('calls onToggle when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn().mockResolvedValue(undefined);
    const handleDelete = vi.fn().mockResolvedValue(undefined);

    render(
      <TaskItem
        task={mockTask}
        onToggle={handleToggle}
        onDelete={handleDelete}
        isUpdating={false}
        isDeleting={false}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(handleToggle).toHaveBeenCalledWith(mockTask.id);
  });

  it('calls onDelete when trash button is clicked', async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();
    const handleDelete = vi.fn().mockResolvedValue(undefined);

    render(
      <TaskItem
        task={mockTask}
        onToggle={handleToggle}
        onDelete={handleDelete}
        isUpdating={false}
        isDeleting={false}
      />
    );

    const deleteBtn = screen.getByRole('button', { name: /Delete task/i });
    await user.click(deleteBtn);

    expect(handleDelete).toHaveBeenCalledTimes(1);
    expect(handleDelete).toHaveBeenCalledWith(mockTask.id);
  });

  it('renders completed styling and checked state when completed=true', () => {
    const completedTask = { ...mockTask, completed: true };

    render(
      <TaskItem
        task={completedTask}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        isUpdating={false}
        isDeleting={false}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    const titleElement = screen.getByText('Deploy to Cloud');
    expect(titleElement).toHaveClass('line-through');
  });
});
