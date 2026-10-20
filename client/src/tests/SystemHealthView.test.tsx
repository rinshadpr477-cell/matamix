import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SystemHealthView } from '../components/SystemHealthView';

describe('SystemHealthView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches /health and renders operational Express server and connected MongoDB status', async () => {
    const mockHealthResponse = {
      status: 'healthy',
      uptime: 3600,
      timestamp: new Date().toISOString(),
      database: {
        status: 'connected',
        readyState: 1,
      },
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockHealthResponse,
    } as Response);

    render(<SystemHealthView />);

    await waitFor(() => {
      expect(screen.getByText('Operational')).toBeInTheDocument();
      expect(screen.getByText('Connected')).toBeInTheDocument();
    });

    expect(screen.getByText(/Mongoose readyState: 1/i)).toBeInTheDocument();
    expect(screen.getByText('System Health & API Specifications')).toBeInTheDocument();
  });
});
