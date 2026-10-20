import { ApiResponse } from '../types/task';

export class ApiError extends Error {
  public statusCode: number;
  public details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

const DEFAULT_TIMEOUT_MS = 10000;

export async function request<T>(
  url: string,
  options: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Link caller signal if provided so component unmount or manual abort propagates
  if (options.signal) {
    if (options.signal.aborted) {
      controller.abort();
    } else {
      options.signal.addEventListener('abort', () => controller.abort(), { once: true });
    }
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let data: ApiResponse<T> | null = null;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      const errorMessage =
        data?.error ||
        data?.message ||
        `HTTP Error ${response.status}: ${response.statusText}`;
      throw new ApiError(errorMessage, response.status, data?.details);
    }

    if (!data || !data.success) {
      throw new ApiError(data?.message || 'Request failed without success flag', response.status);
    }

    return data.data as T;
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof ApiError) {
      throw err;
    }

    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('Request timed out. Please check your network and try again.', 408);
    }

    if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
      throw new ApiError(
        'Unable to connect to the server. Please verify the backend is running.',
        503
      );
    }

    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    throw new ApiError(message, 500);
  }
}
