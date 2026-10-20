import { Document, Types } from 'mongoose';

export interface ITask {
  _id: Types.ObjectId;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ITaskDocument = ITask & Document;

export interface TaskResponseDTO {
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
