import React from 'react';
import { Task } from '../types/task';
import { TaskItem } from './TaskItem';
import { EmptyState } from './EmptyState';

interface TaskListProps {
  tasks: Task[];
  allTasksCount: number;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  updatingIds: Set<string>;
  deletingIds: Set<string>;
  isFiltered: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  allTasksCount,
  onToggle,
  onDelete,
  updatingIds,
  deletingIds,
  isFiltered,
}) => {
  if (tasks.length === 0) {
    return <EmptyState isSearchOrFilter={isFiltered && allTasksCount > 0} />;
  }

  return (
    <div
      role="list"
      aria-label="Tasks list"
      className="space-y-2"
    >
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          isUpdating={updatingIds.has(task.id)}
          isDeleting={deletingIds.has(task.id)}
        />
      ))}
    </div>
  );
};
