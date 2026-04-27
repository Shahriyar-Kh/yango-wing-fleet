/**
 * TypeScript types mirroring Django model fields from the backend.
 */

// ─── Public content ───────────────────────────────────────────────────────────

export interface Offer {
  id: number;
  title: string;
  description: string;
  badge: string;
  image: string | null;
  priority: number;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export type VehicleType = "bike" | "car" | "rickshaw";

export interface TripBonus {
  id: number;
  city: string;
  vehicle_type: VehicleType;
  trip_target: number;
  bonus_amount: string; // Decimal serialized as string
  notes: string;
  sort_order: number;
  is_active: boolean;
}

export interface DynamicSections {
  offers: Offer[];
  trip_bonuses: TripBonus[];
}

// ─── Registration ─────────────────────────────────────────────────────────────

export type RegistrationStatus = "pending" | "in_progress" | "completed" | "active";

/**
 * Updated RegistrationSubmitPayload — mirrors POST /api/public/registrations/
 *
 * Drop this into your existing types file (e.g. @/lib/api/types.ts) and
 * replace the old RegistrationSubmitPayload definition.
 *
 * All new fields introduced in 2026-04:
 *   Rider  : cnic_issue_date, cnic_expiry_date
 *   Vehicle: vehicle_number_plate, vehicle_make, vehicle_model, vehicle_color
 */

export interface RegistrationSubmitPayload {
  // ── Rider details ──────────────────────────────────────────────────────────
  full_name: string;
  cnic: string;
  /** ISO date string — "YYYY-MM-DD" */
  cnic_issue_date: string;
  /** ISO date string — "YYYY-MM-DD" */
  cnic_expiry_date: string;
  phone: string;
  email?: string;
  city: string;

  // ── Vehicle details ────────────────────────────────────────────────────────
  vehicle_type: "bike" | "car" | "rickshaw";
  vehicle_number_plate: string;
  vehicle_make: string;
  /** Required for cars; optional for bikes & rickshaws. */
  vehicle_model?: string;
  vehicle_year: number;
  vehicle_color: string;

  // ── Misc ──────────────────────────────────────────────────────────────────
  notes?: string;
}
export interface RegistrationSubmitResponse {
  id: number;
  status: RegistrationStatus;
}

export interface RegistrationRecord {
  id: number;
  // ── Rider details ──────────────────────────────────────────────────────────
  full_name: string;
  cnic: string;
  /** ISO date string — "YYYY-MM-DD" */
  cnic_issue_date: string;
  /** ISO date string — "YYYY-MM-DD" */
  cnic_expiry_date: string;
  phone: string;
  email?: string;
  city: string;

  // ── Vehicle details ────────────────────────────────────────────────────────
  vehicle_type: "bike" | "car" | "rickshaw";
  vehicle_number_plate: string;
  vehicle_make: string;
  /** Required for cars; optional for bikes & rickshaws. */
  vehicle_model?: string;
  vehicle_year: number;
  vehicle_color: string;

  // ── Misc ──────────────────────────────────────────────────────────────────
  notes?: string;

  status: RegistrationStatus;
  source_ip: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Inquiry ──────────────────────────────────────────────────────────────────

export type InquiryType = "contact" | "support";
export type InquiryStatus = "new" | "in_progress" | "resolved" | "closed";

export interface InquirySubmitPayload {
  inquiry_type: InquiryType;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  website?: string; // honeypot — always empty
}

export interface InquirySubmitResponse {
  id: number;
  status: InquiryStatus;
}

export interface InquiryRecord {
  id: number;
  inquiry_type: InquiryType;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
  updated_at: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardSummaryTotals {
  registrations: number;
  daily_registrations: number;
  weekly_registrations: number;
  monthly_registrations: number;
  active_offers: number;
  active_trip_bonus_records: number;
  open_inquiries: number;
}

export interface CountRecord {
  [key: string]: string | number;
  total: number;
}

export interface DashboardSummary {
  totals: DashboardSummaryTotals;
  city_counts: CountRecord[];
  vehicle_counts: CountRecord[];
  status_counts: CountRecord[];
  latest_submissions: Partial<RegistrationRecord>[];
}

export interface TrendBucket {
  bucket: string;
  total: number;
}

export interface DashboardTrends {
  period: string;
  registrations: TrendBucket[];
  inquiries: TrendBucket[];
}

export interface DashboardDistributions {
  registrations: {
    city: CountRecord[];
    vehicle: CountRecord[];
    status: CountRecord[];
  };
  inquiries: {
    type: CountRecord[];
    status: CountRecord[];
  };
}

export interface DashboardLatest {
  latest_registrations: Partial<RegistrationRecord>[];
  latest_inquiries: Partial<InquiryRecord>[];
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface TokenPair {
  access: string;
  refresh: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
