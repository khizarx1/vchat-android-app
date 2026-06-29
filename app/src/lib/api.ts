/**
 * The single HTTP client for talking to the backend.
 *
 * Responsibilities the screens should NEVER have to think about:
 *   - prefix every path with the API base URL
 *   - attach the access token as a Bearer header
 *   - parse JSON and surface a clean ApiError on failure
 *   - when the access token has expired (401), refresh it ONCE and retry
 *
 * Screens just call `api.get('/users')` / `api.post('/auth/login', body)`.
 */
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from './storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error('EXPO_PUBLIC_API_URL is not set — add it to app/.env and restart expo.');
}

/** An HTTP error carrying the status code and the server's message. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  /** Attach the access token + enable auto-refresh. False for login/register. */
  auth?: boolean;
};

// Single-flight refresh: if several requests get a 401 at once, they all await
// the SAME refresh instead of each firing one.
let refreshing: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return false;

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    await clearTokens();
    return false;
  }

  const data = (await res.json()) as { accessToken: string; refreshToken: string };
  await saveTokens(data.accessToken, data.refreshToken);
  return true;
}

function ensureRefreshed(): Promise<boolean> {
  if (!refreshing) {
    refreshing = refreshTokens().finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
}

async function request<T>(path: string, options: RequestOptions = {}, isRetry = false): Promise<T> {
  const { method = 'GET', body, auth = true } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = await getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Access token expired -> refresh once, then replay the original request.
  if (res.status === 401 && auth && !isRetry) {
    const refreshed = await ensureRefreshed();
    if (refreshed) return request<T>(path, options, true);
  }

  if (!res.ok) {
    throw new ApiError(res.status, await extractMessage(res));
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

async function extractMessage(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return data.message ?? data.error ?? res.statusText;
  } catch {
    return res.statusText;
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
