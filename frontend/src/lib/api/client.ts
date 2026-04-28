/**
 * Core HTTP client.
 * - Attaches Bearer token to admin requests automatically.
 * - Silently refreshes expired access tokens using the refresh token.
 * - Wraps all responses in a consistent { data, error } shape.
 */

import { API_BASE_URL, buildApiUrl, ENDPOINTS, getApiBaseUrlError } from "./config";
import { tokenStore } from "./tokenStore";

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  errors?: Record<string, string[]>; // field-level validation errors
  status: number;
}

// ─── Internal fetch wrapper ───────────────────────────────────────────────────

async function rawFetch(url: string, options: RequestInit = {}): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Cache-Control": "no-cache",
      ...(options.headers ?? {}),
    },
  });
}

function buildNetworkErrorMessage(method: string, path: string): string {
  const configError = getApiBaseUrlError();
  if (configError) return configError;

  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return "You appear to be offline. Check your connection and try again.";
  }

  return `Unable to reach the backend at ${API_BASE_URL} while requesting ${method} ${path}. Check the backend status, HTTPS, and CORS settings.`;
}

async function safeJson(res: Response): Promise<Record<string, unknown> | null> {
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

// ─── Token refresh ────────────────────────────────────────────────────────────

async function refreshAccessToken(): Promise<boolean> {
  const refresh = tokenStore.getRefresh();
  if (!refresh) return false;

  try {
    const res = await rawFetch(buildApiUrl(ENDPOINTS.tokenRefresh), {
      method: "POST",
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) {
      tokenStore.clear();
      return false;
    }
    const json = (await safeJson(res)) as { access?: string | null; refresh?: string | null } | null;
    if (typeof json?.access === "string") {
      tokenStore.setAccess(json.access);
    }
    if (typeof json?.refresh === "string") {
      tokenStore.setRefresh(json.refresh);
    }
    return true;
  } catch {
    tokenStore.clear();
    return false;
  }
}

// ─── Authenticated fetch (retries once after refresh) ─────────────────────────

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const access = tokenStore.getAccess();
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) ?? {}),
  };
  if (access) headers["Authorization"] = `Bearer ${access}`;

  let res = await rawFetch(url, { ...options, headers });

  if (res.status === 401) {
    const ok = await refreshAccessToken();
    if (ok) {
      const newAccess = tokenStore.getAccess();
      if (newAccess) headers["Authorization"] = `Bearer ${newAccess}`;
      res = await rawFetch(url, { ...options, headers });
    }
  }

  return res;
}

// ─── Generic request helpers ──────────────────────────────────────────────────

async function parseResponse<T>(res: Response): Promise<ApiResponse<T>> {
  const json = await safeJson(res);

  if (!json) {
    if (res.ok) {
      return { data: null, error: null, status: res.status };
    }

    return {
      data: null,
      error: `Unexpected non-JSON response (${res.status})`,
      status: res.status,
    };
  }

  if (res.ok) {
    return {
      data: (json.data ?? json) as T,
      error: null,
      status: res.status,
    };
  }

  const fieldErrors = Object.fromEntries(
    Object.entries(json).filter(
      ([key, value]) =>
        key !== "success" &&
        key !== "message" &&
        key !== "detail" &&
        key !== "data" &&
        key !== "errors" &&
        (Array.isArray(value) || typeof value === "string"),
    ),
  );

  return {
    data: null,
    error:
      (json.message as string) ??
      (json.detail as string) ??
      (json.error as string) ??
      "An error occurred",
    errors:
      (json.errors as Record<string, string[]> | undefined) ??
      (Object.keys(fieldErrors).length > 0 ? (fieldErrors as Record<string, string[]>) : undefined),
    status: res.status,
  };
}

async function request<T>(
  method: string,
  path: string,
  options: RequestInit = {},
  authenticated = false,
): Promise<ApiResponse<T>> {
  const apiBaseError = getApiBaseUrlError();
  if (apiBaseError) {
    return { data: null, error: apiBaseError, status: 0 };
  }

  try {
    const url = buildApiUrl(path);
    const res = authenticated ? await authFetch(url, { ...options, method }) : await rawFetch(url, { ...options, method });
    return parseResponse<T>(res);
  } catch {
    return { data: null, error: buildNetworkErrorMessage(method, path), status: 0 };
  }
}

// ─── Public (unauthenticated) requests ────────────────────────────────────────

export async function publicGet<T = unknown>(path: string): Promise<ApiResponse<T>> {
  return request<T>("GET", path);
}

export async function publicPost<T = unknown>(
  path: string,
  body: unknown,
): Promise<ApiResponse<T>> {
  return request<T>("POST", path, { body: JSON.stringify(body) });
}

// ─── Authenticated (admin) requests ──────────────────────────────────────────

export async function adminGet<T = unknown>(path: string): Promise<ApiResponse<T>> {
  return request<T>("GET", path, {}, true);
}

export async function adminPost<T = unknown>(path: string, body: unknown): Promise<ApiResponse<T>> {
  return request<T>("POST", path, { body: JSON.stringify(body) }, true);
}

export async function adminPatch<T = unknown>(
  path: string,
  body: unknown,
): Promise<ApiResponse<T>> {
  return request<T>("PATCH", path, { body: JSON.stringify(body) }, true);
}

export async function adminDelete<T = unknown>(path: string): Promise<ApiResponse<T>> {
  return request<T>("DELETE", path, {}, true);
}
