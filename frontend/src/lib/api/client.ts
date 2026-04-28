/**
 * Core HTTP client.
 * - Attaches Bearer token to admin requests automatically.
 * - Silently refreshes expired access tokens using the refresh token.
 * - Wraps all responses in a consistent { data, error } shape.
 */

import { API_BASE_URL, ENDPOINTS } from "./config";
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
      "Cache-Control": "no-cache",
      ...(options.headers ?? {}),
    },
  });
}

// ─── Token refresh ────────────────────────────────────────────────────────────

async function refreshAccessToken(): Promise<boolean> {
  const refresh = tokenStore.getRefresh();
  if (!refresh) return false;

  try {
    const res = await rawFetch(`${API_BASE_URL}${ENDPOINTS.tokenRefresh}`, {
      method: "POST",
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) {
      tokenStore.clear();
      return false;
    }
    const json = await res.json();
    tokenStore.setAccess(json.access ?? null);
    if (json.refresh) tokenStore.setRefresh(json.refresh);
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
  let json: Record<string, unknown> = {};
  try {
    json = await res.json();
  } catch {
    // Non-JSON success (e.g. 204) should not be treated as an error.
    if (res.ok) {
      return { data: null, error: null, status: res.status };
    }
    return { data: null, error: "Unexpected response", status: res.status };
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
    error: (json.message as string) ?? (json.detail as string) ?? "An error occurred",
    errors:
      (json.errors as Record<string, string[]> | undefined) ??
      (Object.keys(fieldErrors).length > 0 ? (fieldErrors as Record<string, string[]>) : undefined),
    status: res.status,
  };
}

// ─── Public (unauthenticated) requests ────────────────────────────────────────

export async function publicGet<T = unknown>(path: string): Promise<ApiResponse<T>> {
  try {
    const res = await rawFetch(`${API_BASE_URL}${path}`);
    return parseResponse<T>(res);
  } catch {
    return { data: null, error: "Network error. Please check your connection.", status: 0 };
  }
}

export async function publicPost<T = unknown>(
  path: string,
  body: unknown,
): Promise<ApiResponse<T>> {
  try {
    const res = await rawFetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return parseResponse<T>(res);
  } catch {
    return { data: null, error: "Network error. Please check your connection.", status: 0 };
  }
}

// ─── Authenticated (admin) requests ──────────────────────────────────────────

export async function adminGet<T = unknown>(path: string): Promise<ApiResponse<T>> {
  try {
    const res = await authFetch(`${API_BASE_URL}${path}`);
    return parseResponse<T>(res);
  } catch {
    return { data: null, error: "Network error. Please check your connection.", status: 0 };
  }
}

export async function adminPost<T = unknown>(path: string, body: unknown): Promise<ApiResponse<T>> {
  try {
    const res = await authFetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return parseResponse<T>(res);
  } catch {
    return { data: null, error: "Network error. Please check your connection.", status: 0 };
  }
}

export async function adminPatch<T = unknown>(
  path: string,
  body: unknown,
): Promise<ApiResponse<T>> {
  try {
    const res = await authFetch(`${API_BASE_URL}${path}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    return parseResponse<T>(res);
  } catch {
    return { data: null, error: "Network error. Please check your connection.", status: 0 };
  }
}

export async function adminDelete<T = unknown>(path: string): Promise<ApiResponse<T>> {
  try {
    const res = await authFetch(`${API_BASE_URL}${path}`, { method: "DELETE" });
    return parseResponse<T>(res);
  } catch {
    return { data: null, error: "Network error. Please check your connection.", status: 0 };
  }
}
