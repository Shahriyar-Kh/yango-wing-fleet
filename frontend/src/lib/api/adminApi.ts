/**
 * adminApi — all JWT-protected API calls for the admin dashboard.
 * Updated: added full TripBonus CRUD + getDashboardYearly
 */

import { adminGet, adminPost, adminPatch, adminDelete } from "./client";
import { API_BASE_URL, ENDPOINTS } from "./config";
import { tokenStore } from "./tokenStore";
import type {
  DashboardSummary,
  DashboardTrends,
  DashboardDistributions,
  DashboardLatest,
  RegistrationRecord,
  InquiryRecord,
  Offer,
  TripBonus,
  PaginatedResponse,
} from "./types";

function normalizePaginated<T>(payload: unknown): PaginatedResponse<T> {
  if (Array.isArray(payload)) {
    return {
      count: payload.length,
      next: null,
      previous: null,
      results: payload as T[],
    };
  }

  const maybe = payload as Partial<PaginatedResponse<T>> | null;
  if (maybe && Array.isArray(maybe.results)) {
    return {
      count: Number(maybe.count ?? maybe.results.length ?? 0),
      next: maybe.next ?? null,
      previous: maybe.previous ?? null,
      results: maybe.results,
    };
  }

  return { count: 0, next: null, previous: null, results: [] };
}

async function downloadAdminCsv(path: string, filename: string): Promise<void> {
  const access = tokenStore.getAccess();
  const headers: Record<string, string> = {};
  if (access) headers.Authorization = `Bearer ${access}`;

  const response = await fetch(`${API_BASE_URL}${path}`, { headers });
  if (!response.ok) {
    throw new Error(`Failed to export ${filename} (${response.status})`);
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(objectUrl);
}

export const adminApi = {
  // ─── Dashboard ─────────────────────────────────────────────────────────────

  getDashboardSummary: () => adminGet<DashboardSummary>(ENDPOINTS.dashboardSummary),

  getDashboardTrends: (period: "daily" | "weekly" | "monthly" | "yearly" = "daily", limit = 30) =>
    adminGet<DashboardTrends>(`${ENDPOINTS.dashboardTrends}?period=${period}&limit=${limit}`),

  getDashboardDistributions: () =>
    adminGet<DashboardDistributions>(ENDPOINTS.dashboardDistributions),

  getDashboardLatest: (limit = 20) =>
    adminGet<DashboardLatest>(`${ENDPOINTS.dashboardLatest}?limit=${limit}`),

  // ─── Registrations ─────────────────────────────────────────────────────────

  getRegistrations: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return adminGet<PaginatedResponse<RegistrationRecord>>(`${ENDPOINTS.adminRegistrations}${qs}`).then(
      (result) => ({
        ...result,
        data: result.data ? normalizePaginated<RegistrationRecord>(result.data) : null,
      }),
    );
  },

  updateRegistration: (id: number, body: Partial<RegistrationRecord>) =>
    adminPatch<RegistrationRecord>(`${ENDPOINTS.adminRegistrations}${id}/`, body),

  exportRegistrationsCsv: () => downloadAdminCsv(ENDPOINTS.adminRegistrationsExport, "registrations.csv"),

  // ─── Inquiries ─────────────────────────────────────────────────────────────

  getInquiries: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return adminGet<PaginatedResponse<InquiryRecord>>(`${ENDPOINTS.adminInquiries}${qs}`).then(
      (result) => ({
        ...result,
        data: result.data ? normalizePaginated<InquiryRecord>(result.data) : null,
      }),
    );
  },

  updateInquiry: (id: number, body: Partial<InquiryRecord>) =>
    adminPatch<InquiryRecord>(`${ENDPOINTS.adminInquiries}${id}/`, body),

  exportInquiriesCsv: () => downloadAdminCsv(ENDPOINTS.adminInquiriesExport, "inquiries.csv"),

  // ─── Offers ────────────────────────────────────────────────────────────────

  getOffers: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return adminGet<PaginatedResponse<Offer>>(`${ENDPOINTS.adminOffers}${qs}`).then((result) => ({
      ...result,
      data: result.data ? normalizePaginated<Offer>(result.data) : null,
    }));
  },
  createOffer: (body: Partial<Offer>) => adminPost<Offer>(ENDPOINTS.adminOffers, body),
  updateOffer: (id: number, body: Partial<Offer>) =>
    adminPatch<Offer>(`${ENDPOINTS.adminOffers}${id}/`, body),
  deleteOffer: (id: number) => adminDelete(`${ENDPOINTS.adminOffers}${id}/`),

  // ─── Trip Bonuses ──────────────────────────────────────────────────────────

  getTripBonuses: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return adminGet<PaginatedResponse<TripBonus>>(`${ENDPOINTS.adminTripBonuses}${qs}`).then(
      (result) => ({
        ...result,
        data: result.data ? normalizePaginated<TripBonus>(result.data) : null,
      }),
    );
  },
  createTripBonus: (body: Partial<TripBonus>) =>
    adminPost<TripBonus>(ENDPOINTS.adminTripBonuses, body),
  updateTripBonus: (id: number, body: Partial<TripBonus>) =>
    adminPatch<TripBonus>(`${ENDPOINTS.adminTripBonuses}${id}/`, body),
  deleteTripBonus: (id: number) => adminDelete(`${ENDPOINTS.adminTripBonuses}${id}/`),
};