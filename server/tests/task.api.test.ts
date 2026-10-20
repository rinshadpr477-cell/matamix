import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/app';
import { TaskModel } from '../src/models/task.model';

const app = createApp();

describe('Task Manager REST API', () => {
  describe('GET /api/tasks', () => {
    it('should return an empty array when no tasks exist', async () => {
      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.message).toBe('Tasks retrieved successfully');
    });

    it('should return all existing tasks sorted by newest first', async () => {
      const task1 = await TaskModel.create({
        title: 'Task 1',
        completed: false,
        createdAt: new Date(Date.now() - 5000),
      });
      const task2 = await TaskModel.create({
        title: 'Task 2',
        completed: true,
        createdAt: new Date(),
      });

      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].id).toBe(task2._id.toString());
      expect(response.body.data[0].title).toBe('Task 2');
      expect(response.body.data[0].completed).toBe(true);
      expect(response.body.data[1].id).toBe(task1._id.toString());
      expect(response.body.data[1].title).toBe('Task 1');
      expect(response.body.data[1].completed).toBe(false);
    });

    it('should support pagination with limit and skip query parameters', async () => {
      for (let i = 1; i <= 5; i++) {
        await TaskModel.create({
          title: `Task ${i}`,
          completed: false,
          createdAt: new Date(Date.now() + i * 1000),
        });
      }

      // Fetch with limit 2, skip 1
      const response = await request(app).get('/api/tasks?limit=2&skip=1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].title).toBe('Task 4');
      expect(response.body.data[1].title).toBe('Task 3');
    });

    it('should reject invalid query parameters with 400 Bad Request', async () => {
      const response = await request(app).get('/api/tasks?limit=0');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid query parameters');
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a valid task with completed=false by default and trim whitespace', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: '   Buy fresh groceries   ' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Buy fresh groceries');
      expect(response.body.data.completed).toBe(false);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.createdAt).toBeDefined();

      const dbTask = await TaskModel.findById(response.body.data.id);
      expect(dbTask).not.toBeNull();
      expect(dbTask?.title).toBe('Buy fresh groceries');
      expect(dbTask?.completed).toBe(false);
    });

    it('should reject missing title with 400 Bad Request', async () => {
      const response = await request(app).post('/api/tasks').send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should reject empty title with 400 Bad Request', async () => {
      const response = await request(app).post('/api/tasks').send({ title: '' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject whitespace-only title with 400 Bad Request', async () => {
      const response = await request(app).post('/api/tasks').send({ title: '     ' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject excessively long title (> 200 characters) with 400 Bad Request', async () => {
      const longTitle = 'a'.repeat(201);
      const response = await request(app).post('/api/tasks').send({ title: longTitle });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('cannot exceed 200 characters');
    });

    it('should reject unexpected fields (mass assignment prevention) with 400 Bad Request', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Valid Task', admin: true, role: 'superuser' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    it('should toggle completed from false to true when body is empty', async () => {
      const task = await TaskModel.create({ title: 'Complete testing', completed: false });

      const response = await request(app)
        .patch(`/api/tasks/${task._id.toString()}`)
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.completed).toBe(true);

      const updated = await TaskModel.findById(task._id);
      expect(updated?.completed).toBe(true);
    });

    it('should handle completely bodyless PATCH request gracefully and toggle status', async () => {
      const task = await TaskModel.create({ title: 'Bodyless Toggle', completed: false });

      const response = await request(app).patch(`/api/tasks/${task._id.toString()}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.completed).toBe(true);
    });

    it('should toggle completed from true to false', async () => {
      const task = await TaskModel.create({ title: 'Complete testing', completed: true });

      const response = await request(app)
        .patch(`/api/tasks/${task._id.toString()}`)
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.completed).toBe(false);

      const updated = await TaskModel.findById(task._id);
      expect(updated?.completed).toBe(false);
    });

    it('should accept explicit completed status in body', async () => {
      const task = await TaskModel.create({ title: 'Explicit status', completed: false });

      const response = await request(app)
        .patch(`/api/tasks/${task._id.toString()}`)
        .send({ completed: true });

      expect(response.status).toBe(200);
      expect(response.body.data.completed).toBe(true);
    });

    it('should reject unexpected fields on PATCH with 400 Bad Request', async () => {
      const task = await TaskModel.create({ title: 'Guard test', completed: false });

      const response = await request(app)
        .patch(`/api/tasks/${task._id.toString()}`)
        .send({ title: 'Attempted Title Modification', extra: 'not allowed' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should return 404 if the task does not exist', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .patch(`/api/tasks/${nonExistentId}`)
        .send({});

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });

    it('should return 400 for invalid MongoDB ObjectId', async () => {
      const response = await request(app)
        .patch('/api/tasks/not-a-valid-id')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid MongoDB ObjectId format');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete an existing task and return success response', async () => {
      const task = await TaskModel.create({ title: 'Task to be deleted', completed: false });

      const response = await request(app).delete(`/api/tasks/${task._id.toString()}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(task._id.toString());
      expect(response.body.data.message).toBe('Task deleted successfully');

      const dbTask = await TaskModel.findById(task._id);
      expect(dbTask).toBeNull();
    });

    it('should return 404 if task to delete does not exist', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const response = await request(app).delete(`/api/tasks/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });

    it('should return 400 for invalid MongoDB ObjectId on delete', async () => {
      const response = await request(app).delete('/api/tasks/123-invalid');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid MongoDB ObjectId format');
    });
  });

  describe('Security and Edge Cases', () => {
    it('should return 404 for unknown endpoints', async () => {
      const response = await request(app).get('/api/unknown-endpoint');
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should return 200 for health check', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body.database.status).toBe('connected');
    });

    it('should return 403 Forbidden for disallowed CORS origin', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Origin', 'http://malicious-site.com');

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not permitted by CORS policy');
    });

    it('should allow whitelisted CORS origin with 200 OK', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Origin', 'http://localhost:5173');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    });
  });
});
