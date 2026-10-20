import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { HistoryView } from '../components/HistoryView';
import { Task } from '../types/task';

describe('HistoryView Component', () => {
  const mockTasks: Task[] = [
    {
      id: 'task-1',
      title: 'Setup Kubernetes Cluster',
      completed: true,
      createdAt: '2026-10-20T10:00:00.000Z',
      updatedAt: '2026-10-20T11:00:00.000Z',
    },
    {
      id: 'task-2',
      title: '=cmd|calc!A0', // Potential CSV injection payload
      completed: false,
      createdAt: '2026-10-20T12:00:00.000Z',
      updatedAt: '2026-10-20T12:30:00.000Z',
    },
  ];

  it('renders history records table and task titles', () => {
    render(
      <HistoryView
        tasks={mockTasks}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('History & Data Export')).toBeInTheDocument();
    expect(screen.getByText('Setup Kubernetes Cluster')).toBeInTheDocument();
    expect(screen.getByText('=cmd|calc!A0')).toBeInTheDocument();
  });

  it('filters records by search query', async () => {
    const user = userEvent.setup();
    render(
      <HistoryView
        tasks={mockTasks}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Search records by title/i);
    await user.type(searchInput, 'Kubernetes');

    expect(screen.getByText('Setup Kubernetes Cluster')).toBeInTheDocument();
    expect(screen.queryByText('=cmd|calc!A0')).not.toBeInTheDocument();
  });

  it('triggers CSV export without crashing and calls URL APIs', async () => {
    const user = userEvent.setup();
    const createObjectURLMock = vi.fn().mockReturnValue('blob:http://localhost:5173/mock-uuid');
    const revokeObjectURLMock = vi.fn();
    window.URL.createObjectURL = createObjectURLMock;
    window.URL.revokeObjectURL = revokeObjectURLMock;
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(
      <HistoryView
        tasks={mockTasks}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const exportBtn = screen.getByRole('button', { name: /Export CSV/i });
    await user.click(exportBtn);

    expect(createObjectURLMock).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
  });
});
