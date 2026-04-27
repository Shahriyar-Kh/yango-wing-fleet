/**
 * API configuration — central place for all backend URLs and constants.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export const ENDPOINTS = {
  // Public
  health: "/api/health/",
  dynamicSections: "/api/public/dynamic-sections/",
  registrations: "/api/public/registrations/",
  inquiries: "/api/public/inquiries/",

  // Auth
  tokenObtain: "/api/auth/token/",
  tokenRefresh: "/api/auth/token/refresh/",

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
