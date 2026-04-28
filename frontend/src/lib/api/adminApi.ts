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
    return adminGet<PaginatedResponse<RegistrationRecord>>(`${ENDPOINTS.adminRegistrations}${qs}`);
  },

  updateRegistration: (id: number, body: Partial<RegistrationRecord>) =>
    adminPatch<RegistrationRecord>(`${ENDPOINTS.adminRegistrations}${id}/`, body),

  exportRegistrationsCsv: () => {
    const access = tokenStore.getAccess();
    const url = `${API_BASE_URL}${ENDPOINTS.adminRegistrationsExport}`;
    const a = document.createElement("a");
    a.href = access ? `${url}?token=${access}` : url;
    a.download = "registrations.csv";
    a.click();
  },

  // ─── Inquiries ─────────────────────────────────────────────────────────────

  getInquiries: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return adminGet<PaginatedResponse<InquiryRecord>>(`${ENDPOINTS.adminInquiries}${qs}`);
  },

  updateInquiry: (id: number, body: Partial<InquiryRecord>) =>
    adminPatch<InquiryRecord>(`${ENDPOINTS.adminInquiries}${id}/`, body),

  exportInquiriesCsv: () => {
    const access = tokenStore.getAccess();
    const url = `${API_BASE_URL}${ENDPOINTS.adminInquiriesExport}`;
    const a = document.createElement("a");
    a.href = access ? `${url}?token=${access}` : url;
    a.download = "inquiries.csv";
    a.click();
  },

  // ─── Offers ────────────────────────────────────────────────────────────────

  getOffers: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return adminGet<PaginatedResponse<Offer>>(`${ENDPOINTS.adminOffers}${qs}`);
  },
  createOffer: (body: Partial<Offer>) => adminPost<Offer>(ENDPOINTS.adminOffers, body),
  updateOffer: (id: number, body: Partial<Offer>) =>
    adminPatch<Offer>(`${ENDPOINTS.adminOffers}${id}/`, body),
  deleteOffer: (id: number) => adminDelete(`${ENDPOINTS.adminOffers}${id}/`),

  // ─── Trip Bonuses ──────────────────────────────────────────────────────────

  getTripBonuses: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return adminGet<PaginatedResponse<TripBonus>>(`${ENDPOINTS.adminTripBonuses}${qs}`);
  },
  createTripBonus: (body: Partial<TripBonus>) =>
    adminPost<TripBonus>(ENDPOINTS.adminTripBonuses, body),
  updateTripBonus: (id: number, body: Partial<TripBonus>) =>
    adminPatch<TripBonus>(`${ENDPOINTS.adminTripBonuses}${id}/`, body),
  deleteTripBonus: (id: number) => adminDelete(`${ENDPOINTS.adminTripBonuses}${id}/`),
};