/**
 * API configuration — central place for all backend URLs and constants.
 */

const LOCALHOST_BASE_URLS = new Set(["http://localhost:8000", "http://127.0.0.1:8000"]);

function normalizeBaseUrl(value: string | undefined): string {
  return value?.trim().replace(/\/+$/, "") ?? "";
}

function isLocalhostBaseUrl(value: string): boolean {
  return LOCALHOST_BASE_URLS.has(value);
}

const configuredApiBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

// Keep localhost as a dev fallback, but never let a production build silently
// target localhost or an empty base URL.
export const API_BASE_URL =
  import.meta.env.DEV
    ? configuredApiBaseUrl || "http://localhost:8000"
    : configuredApiBaseUrl && !isLocalhostBaseUrl(configuredApiBaseUrl)
      ? configuredApiBaseUrl
      : "";

export const API_BASE_URL_SOURCE = configuredApiBaseUrl;

export function getApiBaseUrlError(): string | null {
  if (!import.meta.env.PROD) return null;

  if (!configuredApiBaseUrl) {
    return "Production API base URL is not configured. Set VITE_API_BASE_URL to the Render backend origin.";
  }

  if (isLocalhostBaseUrl(configuredApiBaseUrl)) {
    return "Production API base URL is still pointing to localhost. Update VITE_API_BASE_URL to the Render backend origin.";
  }

  return null;
}

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!API_BASE_URL) return normalizedPath;
  return `${API_BASE_URL}${normalizedPath}`;
}

export const ENDPOINTS = {
  // Public
  health: "/api/health/",
  dynamicSections: "/api/public/dynamic-sections/",
  registrations: "/api/public/registrations/",
  inquiries: "/api/public/inquiries/",

  // Auth
  tokenObtain: "/api/auth/token/",
  tokenRefresh: "/api/auth/token/refresh/",
  passwordResetRequest: "/api/auth/password-reset/request/",
  passwordResetVerify: "/api/auth/password-reset/verify/",
  passwordResetConfirm: "/api/auth/password-reset/confirm/",

  // Admin — content
  adminOffers: "/api/admin/content/offers/",
  adminTripBonuses: "/api/admin/content/trip-bonuses/",

  // Admin — registrations
  adminRegistrations: "/api/admin/registrations/",
  adminRegistrationsExport: "/api/admin/registrations-export.csv",

  // Admin — inquiries
  adminInquiries: "/api/admin/inquiries/",
  adminInquiriesExport: "/api/admin/inquiries-export.csv",

  // Admin — dashboard
  dashboardSummary: "/api/admin/dashboard/summary/",
  dashboardTrends: "/api/admin/dashboard/trends/",
  dashboardDistributions: "/api/admin/dashboard/distributions/",
  dashboardLatest: "/api/admin/dashboard/latest/",
} as const;
