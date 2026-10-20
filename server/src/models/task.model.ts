import { Schema, model } from 'mongoose';
import { ITaskDocument } from '../types/task.types';

const taskSchema = new Schema<ITaskDocument>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [1, 'Task title cannot be empty'],
      maxlength: [200, 'Task title cannot exceed 200 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        const transformed: Record<string, unknown> = { ...ret };
        transformed.id = (ret._id as { toString(): string }).toString();
        delete transformed._id;
        delete transformed.__v;
        return transformed;
      },
    },
  }
);

// Index for performance when sorting or querying completion status
taskSchema.index({ createdAt: -1 });
taskSchema.index({ completed: 1 });

export const TaskModel = model<ITaskDocument>('Task', taskSchema);
