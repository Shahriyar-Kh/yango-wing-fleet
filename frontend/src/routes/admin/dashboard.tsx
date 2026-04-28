/**
 * routes/admin/dashboard.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * PREMIUM ADMIN CONTROL CENTER — Yango Wing Fleet
 * Full-control dashboard: Analytics · Registrations · Offers · Bonuses · Inquiries
 * Real-time polling · JWT auth · Full CRUD · Premium dark UI
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Users,
  TrendingUp,
  MessageSquare,
  Zap,
  Download,
  LogOut,
  BarChart2,
  MapPin,
  Bike,
  Car,
  Truck,
  Clock,
  RefreshCw,
  CheckCircle,
  Loader2,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Inbox,
  Tag,
  Calendar,
  DollarSign,
  Package,
  Activity,
  Home,
  ChevronDown,
  Save,
  CheckCircle2,
  SlidersHorizontal,
  Circle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { adminApi } from "@/lib/api";
import { notifyPublicSectionsUpdated } from "@/hooks/useDynamicSections";
import type {
  RegistrationRecord,
  RegistrationStatus as ApiRegistrationStatus,
  InquiryRecord,
  Offer,
  TripBonus,
  DashboardSummary,
  DashboardTrends,
  DashboardDistributions,
} from "@/lib/api";

// ─── Route ────────────────────────────────────────────────────────────────────
export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Control Center | Yango Wing Fleet Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDashboard,
});

// ─── Types ────────────────────────────────────────────────────────────────────
type View = "overview" | "registrations" | "offers" | "bonuses" | "inquiries";
type RegistrationStatus = ApiRegistrationStatus;
type InquiryStatus = "new" | "in_progress" | "resolved" | "closed";

interface Notification {
  id: string;
  type: "registration" | "inquiry";
  message: string;
  time: Date;
  read: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const REG_STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  in_progress: "#3b82f6",
  completed: "#10b981",
  active: "#22c55e",
  rejected: "#ef4444",
};

const PIE_COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#06b6d4"];

const VEHICLE_ICONS: Record<string, React.ElementType> = {
  bike: Bike,
  car: Car,
  rickshaw: Truck,
};

// ─── Utility hooks ────────────────────────────────────────────────────────────
function usePolling<T>(
  fetcher: () => Promise<{ data: T | null; error: string | null }>,
  intervalMs = 30000,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastRef = useRef<number>(0);
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const fetch = useCallback(async () => {
    const now = Date.now();
    if (now - lastRef.current < 1000) return;
    lastRef.current = now;
    setError(null);
    const result = await fetcherRef.current();
    setData(result.data);
    if (result.error) setError(result.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
    const id = setInterval(fetch, intervalMs);
    return () => clearInterval(id);
  }, [fetch, intervalMs]);

  return { data, loading, error, refetch: fetch };
}

// ─── Mini components ──────────────────────────────────────────────────────────

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-white/5 ${className}`} />;
}

function StatusBadge({ status, type = "reg" }: { status: string; type?: "reg" | "inquiry" }) {
  const regMap: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    in_progress: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    active: "bg-green-500/15 text-green-400 border-green-500/30",
    rejected: "bg-red-500/15 text-red-400 border-red-500/30",
  };
  const inqMap: Record<string, string> = {
    new: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    in_progress: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    resolved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    closed: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  };
  const map = type === "inquiry" ? inqMap : regMap;
  const cls = map[status] ?? "bg-zinc-500/15 text-zinc-400 border-zinc-500/30";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cls}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

function KpiCard({
  label,
  value,
  sub,
  Icon,
  trend,
  trendUp,
  accent,
  loading,
}: {
  label: string;
  value: string | number;
  sub?: string;
  Icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  accent?: boolean;
  loading?: boolean;
}) {
  if (loading) return <Skeleton className="h-28" />;
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg ${accent ? "border-amber-500/30 bg-amber-500/5" : "border-white/8 bg-white/4"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold uppercase tracking-widest text-white/40">
            {label}
          </p>
          <p className="mt-1.5 text-2xl font-black tabular-nums text-white">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-white/40">{sub}</p>}
          {trend && (
            <div
              className={`mt-2 flex items-center gap-1 text-xs font-semibold ${trendUp ? "text-emerald-400" : "text-red-400"}`}
            >
              {trendUp ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {trend}
            </div>
          )}
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent ? "bg-amber-500/20" : "bg-white/8"}`}
        >
          <Icon className={`h-5 w-5 ${accent ? "text-amber-400" : "text-white/60"}`} />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  Icon,
  action,
}: {
  title: string;
  Icon: React.ElementType;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/15">
          <Icon className="h-4 w-4 text-red-400" />
        </div>
        <h2 className="text-base font-bold text-white">{title}</h2>
      </div>
      {action}
    </div>
  );
}

// ─── Drawer: Registration Detail ──────────────────────────────────────────────
function RegDetailDrawer({
  record,
  onClose,
  onUpdate,
}: {
  record: RegistrationRecord | null;
  onClose: () => void;
  onUpdate: (id: number, status: RegistrationStatus) => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<RegistrationStatus>("pending");

  useEffect(() => {
    if (record) setStatus(record.status as RegistrationStatus);
  }, [record]);

  if (!record) return null;

  const VehicleIcon = VEHICLE_ICONS[record.vehicle_type] ?? Car;

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(record.id, status);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md overflow-y-auto border-l border-white/8 bg-[#0f0f0f] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">Registration Details</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-white/8 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6 rounded-xl bg-white/4 border border-white/8 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/15 text-red-400 font-black text-lg">
            {record.full_name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-white">{record.full_name}</p>
            <p className="text-xs text-white/50">ID #{record.id}</p>
          </div>
          <StatusBadge status={record.status} />
        </div>

        <div className="space-y-3 mb-6">
          {[
            { label: "Phone", value: record.phone },
            { label: "Email", value: record.email || "—" },
            { label: "CNIC", value: record.cnic },
            { label: "City", value: record.city },
            {
              label: "Submitted",
              value: record.created_at ? new Date(record.created_at).toLocaleString() : "—",
            },
          ].map((f) => (
            <div
              key={f.label}
              className="flex items-center justify-between rounded-lg bg-white/3 px-3 py-2.5"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
                {f.label}
              </span>
              <span className="text-sm text-white">{f.value}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-white/8 bg-white/3 p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <VehicleIcon className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-white/40">
              Vehicle
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              ["Type", record.vehicle_type],
              ["Make", record.vehicle_make || "—"],
              ["Model", record.vehicle_model || "—"],
              ["Year", String(record.vehicle_year)],
              ["Color", record.vehicle_color || "—"],
              ["Plate", record.vehicle_number_plate || "—"],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-[10px] text-white/30 uppercase tracking-wider">{k}</p>
                <p className="capitalize font-medium">{v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
            Update Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as RegistrationStatus)}
            className="w-full rounded-xl border border-white/12 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-red-500/50 focus:outline-none"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="active">Active</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/12 py-2.5 text-sm font-semibold hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Status
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Offer Form Modal ─────────────────────────────────────────────────────────
function OfferModal({
  offer,
  onClose,
  onSave,
}: {
  offer: Partial<Offer> | null;
  onClose: () => void;
  onSave: (data: Partial<Offer>) => Promise<void>;
}) {
  const [form, setForm] = useState<Partial<Offer>>(
    offer ?? {
      title: "",
      description: "",
      badge: "",
      priority: 100,
      is_active: true,
      start_date: null,
      end_date: null,
    },
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  };

  const inputCls =
    "w-full rounded-xl border border-white/12 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-red-500/50 focus:outline-none transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold">{offer?.id ? "Edit Offer" : "New Offer"}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-white/8 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-1.5">
              Title *
            </label>
            <input
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputCls}
              placeholder="Offer title..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-1.5">
              Description *
            </label>
            <textarea
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputCls}
              rows={3}
              placeholder="Offer details..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-1.5">
                Badge
              </label>
              <input
                value={form.badge || ""}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className={inputCls}
                placeholder="e.g. New Rider"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-1.5">
                Priority
              </label>
              <input
                type="number"
                value={form.priority ?? 100}
                onChange={(e) => setForm({ ...form, priority: +e.target.value })}
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={form.start_date || ""}
                onChange={(e) => setForm({ ...form, start_date: e.target.value || null })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-1.5">
                End Date
              </label>
              <input
                type="date"
                value={form.end_date || ""}
                onChange={(e) => setForm({ ...form, end_date: e.target.value || null })}
                className={inputCls}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, is_active: !form.is_active })}
              className={`relative h-6 w-11 rounded-full transition-colors ${form.is_active ? "bg-green-500" : "bg-white/20"}`}
            >
              <div
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.is_active ? "translate-x-5" : "translate-x-0.5"}`}
              />
            </button>
            <span className="text-sm font-medium">{form.is_active ? "Active" : "Inactive"}</span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/12 py-2.5 text-sm font-semibold hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !form.title || !form.description}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {offer?.id ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Bonus Form Modal ─────────────────────────────────────────────────────────
function BonusModal({
  bonus,
  onClose,
  onSave,
}: {
  bonus: Partial<TripBonus> | null;
  onClose: () => void;
  onSave: (data: Partial<TripBonus>) => Promise<void>;
}) {
  const [form, setForm] = useState<Partial<TripBonus>>(
    bonus ?? {
      city: "",
      vehicle_type: "bike",
      trip_target: 50,
      bonus_amount: "0",
      notes: "",
      sort_order: 100,
      is_active: true,
    },
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  };

  const inputCls =
    "w-full rounded-xl border border-white/12 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-red-500/50 focus:outline-none transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold">{bonus?.id ? "Edit Bonus" : "New Trip Bonus"}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-white/8 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-1.5">
                City *
              </label>
              <input
                value={form.city || ""}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className={inputCls}
                placeholder="Lahore"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-1.5">
                Vehicle *
              </label>
              <select
                value={form.vehicle_type || "bike"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    vehicle_type: e.target.value as RegistrationRecord["vehicle_type"],
                  })
                }
                className={inputCls}
              >
                <option value="bike">Bike</option>
                <option value="car">Car</option>
                <option value="rickshaw">Rickshaw</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-1.5">
                Trip Target *
              </label>
              <input
                type="number"
                value={form.trip_target || 50}
                onChange={(e) => setForm({ ...form, trip_target: +e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-1.5">
                Bonus (PKR) *
              </label>
              <input
                type="number"
                value={form.bonus_amount || ""}
                onChange={(e) => setForm({ ...form, bonus_amount: e.target.value })}
                className={inputCls}
                placeholder="3000"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-1.5">
              Notes
            </label>
            <input
              value={form.notes || ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className={inputCls}
              placeholder="Optional conditions..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-1.5">
                Sort Order
              </label>
              <input
                type="number"
                value={form.sort_order ?? 100}
                onChange={(e) => setForm({ ...form, sort_order: +e.target.value })}
                className={inputCls}
              />
            </div>
            <div className="flex items-end pb-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, is_active: !form.is_active })}
                  className={`relative h-6 w-11 rounded-full transition-colors ${form.is_active ? "bg-green-500" : "bg-white/20"}`}
                >
                  <div
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.is_active ? "translate-x-5" : "translate-x-0.5"}`}
                  />
                </button>
                <span className="text-sm">{form.is_active ? "Active" : "Off"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/12 py-2.5 text-sm font-semibold hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !form.city || !form.bonus_amount}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {bonus?.id ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Overview / Analytics ─────────────────────────────────────────────────────
function OverviewSection({
  summary,
  trends,
  loading,
}: {
  summary: DashboardSummary | null;
  trends: DashboardTrends | null;
  loading: boolean;
}) {
  // ✅ FIX: Define totals from summary
  const totals = summary?.totals;

  const [trendPeriod, setTrendPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [localTrends, setLocalTrends] = useState<DashboardTrends | null>(trends);
  const [trendLoading, setTrendLoading] = useState(false);

  // Use localTrends for the chart
  const trendData = localTrends;

  useEffect(() => {
    setLocalTrends(trends);
  }, [trends]);

  const refetchTrends = useCallback(async () => {
    setTrendLoading(true);
    const result = await adminApi.getDashboardTrends(
      trendPeriod,
      trendPeriod === "daily" ? 14 : 12,
    );
    if (result.data) setLocalTrends(result.data);
    setTrendLoading(false);
  }, [trendPeriod]);

  useEffect(() => {
    refetchTrends();
  }, [refetchTrends]);

  return (
    <div className="space-y-6">
      {/* KPI Row 1 */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard
          label="Total Registrations"
          value={totals?.registrations ?? 0}
          Icon={Users}
          loading={loading}
        />
        <KpiCard
          label="Today"
          value={totals?.daily_registrations ?? 0}
          sub="registrations"
          Icon={TrendingUp}
          accent
          loading={loading}
        />
        <KpiCard
          label="This Week"
          value={totals?.weekly_registrations ?? 0}
          Icon={Clock}
          loading={loading}
        />
        <KpiCard
          label="This Month"
          value={totals?.monthly_registrations ?? 0}
          Icon={BarChart2}
          loading={loading}
        />
      </div>

      {/* KPI Row 2 */}
      <div className="grid grid-cols-3 gap-3">
        <KpiCard
          label="Active Offers"
          value={totals?.active_offers ?? 0}
          Icon={Zap}
          loading={loading}
        />
        <KpiCard
          label="Active Bonuses"
          value={totals?.active_trip_bonus_records ?? 0}
          Icon={DollarSign}
          loading={loading}
        />
        <KpiCard
          label="Open Inquiries"
          value={totals?.open_inquiries ?? 0}
          Icon={MessageSquare}
          loading={loading}
        />
      </div>

      {/* Trends Chart */}
      <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <SectionHeader title="Registration Trends" Icon={TrendingUp} />
          <div className="flex rounded-xl border border-white/10 overflow-hidden">
            {(["daily", "weekly", "monthly"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setTrendPeriod(p)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  trendPeriod === p
                    ? "bg-red-600 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        {trendLoading ? (
          <Skeleton className="h-52" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData?.registrations ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="bucket"
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                tickFormatter={(v) => {
                  try {
                    return new Date(v).toLocaleDateString("en-PK", {
                      month: "short",
                      day: "numeric",
                    });
                  } catch {
                    return v;
                  }
                }}
              />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                labelFormatter={(v) => {
                  try {
                    return new Date(v).toLocaleDateString();
                  } catch {
                    return v;
                  }
                }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ fill: "#fbbf24", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Distribution charts */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* City bar chart */}
        {(summary?.city_counts?.length ?? 0) > 0 && (
          <div className="rounded-2xl border border-white/8 bg-white/3 p-5 lg:col-span-2">
            <SectionHeader title="By City" Icon={MapPin} />
            <ResponsiveContainer width="100%" height={180} className="mt-4">
              <BarChart data={summary!.city_counts} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="city" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    background: "#111",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="total" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Vehicle pie */}
        {(summary?.vehicle_counts?.length ?? 0) > 0 && (
          <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
            <SectionHeader title="Vehicle Types" Icon={Car} />
            <ResponsiveContainer width="100%" height={180} className="mt-4">
              <PieChart>
                <Pie
                  data={summary!.vehicle_counts.map((v) => ({
                    name: v.vehicle_type as string,
                    value: v.total,
                  }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={65}
                  innerRadius={35}
                >
                  {summary!.vehicle_counts.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#111",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Status bars */}
      {(summary?.status_counts?.length ?? 0) > 0 && (
        <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
          <SectionHeader title="Registration Status Breakdown" Icon={CheckCircle} />
          <div className="mt-5 space-y-3">
            {summary!.status_counts.map((item) => {
              const total = totals?.registrations || 1;
              const pct = Math.round((item.total / total) * 100);
              const color = REG_STATUS_COLORS[item.status as string] ?? "#6b7280";
              return (
                <div key={String(item.status)} className="flex items-center gap-3">
                  <div className="w-24 shrink-0">
                    <StatusBadge status={String(item.status)} />
                  </div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                  <div className="w-16 text-right text-sm font-bold tabular-nums">
                    {item.total}{" "}
                    <span className="text-white/30 font-normal text-xs">({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Latest registrations mini-table */}
      {(summary?.latest_submissions?.length ?? 0) > 0 && (
        <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/6 px-5 py-4">
            <SectionHeader title="Recent Submissions" Icon={Activity} />
            <button
              onClick={() => adminApi.exportRegistrationsCsv()}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/60 hover:text-white hover:border-white/20 transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {["Name", "City", "Vehicle", "Status", "Date"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-white/30"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {summary!.latest_submissions.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-white/4 hover:bg-white/3 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-white">{r.full_name}</td>
                    <td className="px-4 py-3 text-white/60">{r.city}</td>
                    <td className="px-4 py-3 text-white/60 capitalize">{r.vehicle_type}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status ?? "pending"} />
                    </td>
                    <td className="px-4 py-3 text-white/40 text-xs">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Registrations Section ────────────────────────────────────────────────────
function RegistrationsSection() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("");
  const [selected, setSelected] = useState<RegistrationRecord | null>(null);
  const [data, setData] = useState<{ results: RegistrationRecord[]; count: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params: Record<string, string> = { page: String(page), page_size: "20" };
    if (debouncedSearch) params.search = debouncedSearch;
    if (statusFilter) params.status = statusFilter;
    if (cityFilter) params.city = cityFilter;
    if (vehicleFilter) params.vehicle_type = vehicleFilter;
    const result = await adminApi.getRegistrations(params);
    if (result.error) {
      setError(result.error);
    }
    if (result.data) {
      setData({ results: result.data.results, count: result.data.count });
    }
    setLoading(false);
  }, [page, debouncedSearch, statusFilter, cityFilter, vehicleFilter]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, [load]);

  const handleStatusUpdate = async (id: number, status: RegistrationStatus) => {
    const result = await adminApi.updateRegistration(id, { status });
    if (result.error) {
      setError(result.error);
      return;
    }
    load();
  };

  const totalPages = data ? Math.ceil(data.count / 20) : 1;

  return (
    <>
      {selected && (
        <RegDetailDrawer
          record={selected}
          onClose={() => setSelected(null)}
          onUpdate={handleStatusUpdate}
        />
      )}

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search name, phone, city..."
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-red-500/50 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
              showFilters
                ? "border-red-500/50 bg-red-500/10 text-red-400"
                : "border-white/10 text-white/60 hover:border-white/20"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
          <button
            onClick={load}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-sm font-semibold text-white/60 hover:text-white transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => adminApi.exportRegistrationsCsv()}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-sm font-semibold text-white/60 hover:text-white transition-colors"
          >
            <Download className="h-4 w-4" /> Export
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-3 gap-3 rounded-xl border border-white/8 bg-white/3 p-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/30 mb-1.5">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="">All statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="active">Active</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/30 mb-1.5">
                Vehicle
              </label>
              <select
                value={vehicleFilter}
                onChange={(e) => {
                  setVehicleFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="">All vehicles</option>
                <option value="bike">Bike</option>
                <option value="car">Car</option>
                <option value="rickshaw">Rickshaw</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/30 mb-1.5">
                City
              </label>
              <input
                value={cityFilter}
                onChange={(e) => {
                  setCityFilter(e.target.value);
                  setPage(1);
                }}
                placeholder="Filter city..."
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none"
              />
            </div>
          </div>
        )}

        {data && (
          <p className="text-xs text-white/40">
            {data.count} registration{data.count !== 1 ? "s" : ""} found
            {(statusFilter || vehicleFilter || cityFilter || debouncedSearch) && " (filtered)"}
          </p>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/6">
                  {["#", "Name", "Phone", "City", "Vehicle", "Status", "Date", ""].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-white/30"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/4">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : data?.results.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-sm text-white/30">
                      No registrations found
                    </td>
                  </tr>
                ) : (
                  data?.results.map((r) => {
                    const VIcon = VEHICLE_ICONS[r.vehicle_type] ?? Car;
                    return (
                      <tr
                        key={r.id}
                        className="border-b border-white/4 hover:bg-white/3 transition-colors cursor-pointer"
                        onClick={() => setSelected(r)}
                      >
                        <td className="px-4 py-3 text-white/30 text-xs">#{r.id}</td>
                        <td className="px-4 py-3 font-semibold text-white">{r.full_name}</td>
                        <td className="px-4 py-3 text-white/60 font-mono text-xs">{r.phone}</td>
                        <td className="px-4 py-3 text-white/60">{r.city}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <VIcon className="h-3.5 w-3.5 text-amber-400" />
                            <span className="capitalize text-white/70 text-xs">
                              {r.vehicle_type}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={r.status} />
                        </td>
                        <td className="px-4 py-3 text-white/40 text-xs">
                          {r.created_at ? new Date(r.created_at).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelected(r);
                            }}
                            className="rounded-lg p-1.5 hover:bg-white/8 text-white/40 hover:text-white transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-white/6 px-4 py-3">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/60 disabled:opacity-30 hover:border-white/20 transition-colors"
              >
                ← Prev
              </button>
              <span className="text-xs text-white/40">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/60 disabled:opacity-30 hover:border-white/20 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Offers Section ───────────────────────────────────────────────────────────
function OffersSection() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<Partial<Offer> | null | false>(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await adminApi.getOffers();
    if (result.error) {
      setError(result.error);
    }
    if (result.data) setOffers(result.data.results);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (data: Partial<Offer>) => {
    setError(null);
    let result;
    if (data.id) {
      result = await adminApi.updateOffer(data.id, data);
    } else {
      result = await adminApi.createOffer(data);
    }
    if (result?.error) {
      setError(result.error);
      return;
    }
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this offer?")) return;
    setDeleting(id);
    const result = await adminApi.deleteOffer(id);
    setDeleting(null);
    if (result.error) {
      setError(result.error);
      return;
    }
    load();
  };

  const handleToggle = async (offer: Offer) => {
    const result = await adminApi.updateOffer(offer.id, { is_active: !offer.is_active });
    if (result.error) {
      setError(result.error);
      return;
    }
    load();
  };

  return (
    <>
      {modal !== false && (
        <OfferModal offer={modal} onClose={() => setModal(false)} onSave={handleSave} />
      )}

      <div className="space-y-4">
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-sm text-white/40">
            {offers.length} offer{offers.length !== 1 ? "s" : ""} total
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="rounded-xl border border-white/10 p-2.5 text-white/60 hover:text-white transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setModal({})}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold hover:bg-red-700 transition-colors"
            >
              <Plus className="h-4 w-4" /> New Offer
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : offers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
            <Package className="h-8 w-8 text-white/20 mx-auto mb-3" />
            <p className="text-sm text-white/40">No offers yet. Create your first one.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className={`rounded-2xl border p-5 transition-all ${
                  offer.is_active
                    ? "border-white/10 bg-white/3"
                    : "border-white/5 bg-white/1 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate">{offer.title}</h3>
                    {offer.badge && (
                      <span className="inline-flex items-center gap-1 mt-1 rounded-full bg-amber-500/15 border border-amber-500/25 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                        <Tag className="h-2.5 w-2.5" /> {offer.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggle(offer)}
                      className={`rounded-lg p-1.5 transition-colors ${
                        offer.is_active
                          ? "text-green-400 hover:bg-green-500/15"
                          : "text-white/30 hover:bg-white/8"
                      }`}
                    >
                      {offer.is_active ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => setModal(offer)}
                      className="rounded-lg p-1.5 text-white/40 hover:text-white hover:bg-white/8 transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
                      disabled={deleting === offer.id}
                      className="rounded-lg p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30"
                    >
                      {deleting === offer.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-white/50 line-clamp-2">{offer.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-white/30">
                  <span>Priority: {offer.priority}</span>
                  {offer.end_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Ends {offer.end_date}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Trip Bonuses Section ─────────────────────────────────────────────────────
function BonusesSection() {
  const [bonuses, setBonuses] = useState<TripBonus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<Partial<TripBonus> | null | false>(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [cityFilter, setCityFilter] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await adminApi.getTripBonuses();
    if (result.error) {
      setError(result.error);
    }
    if (result.data) setBonuses(result.data.results);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (data: Partial<TripBonus>) => {
    setError(null);
    let result;
    if (data.id) {
      result = await adminApi.updateTripBonus(data.id, data);
    } else {
      result = await adminApi.createTripBonus(data);
    }
    if (result?.error) {
      setError(result.error);
      return;
    }
    load();
    notifyPublicSectionsUpdated();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this bonus?")) return;
    setDeleting(id);
    const result = await adminApi.deleteTripBonus(id);
    setDeleting(null);
    if (result.error) {
      setError(result.error);
      return;
    }
    load();
    notifyPublicSectionsUpdated();
  };

  const handleToggle = async (bonus: TripBonus) => {
    const result = await adminApi.updateTripBonus(bonus.id, {
      is_active: !bonus.is_active,
    });
    if (result.error) {
      setError(result.error);
      return;
    }
    load();
    notifyPublicSectionsUpdated();
  };

  const filtered = useMemo(
    () =>
      bonuses.filter((b) => {
        if (cityFilter && !b.city.toLowerCase().includes(cityFilter.toLowerCase())) return false;
        if (vehicleFilter && b.vehicle_type !== vehicleFilter) return false;
        return true;
      }),
    [bonuses, cityFilter, vehicleFilter],
  );

  const grouped = useMemo(() => {
    const g: Record<string, TripBonus[]> = {};
    filtered.forEach((b) => {
      if (!g[b.city]) g[b.city] = [];
      g[b.city].push(b);
    });
    return g;
  }, [filtered]);

  return (
    <>
      {modal !== false && (
        <BonusModal bonus={modal} onClose={() => setModal(false)} onSave={handleSave} />
      )}

      <div className="space-y-4">
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <input
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            placeholder="Filter by city..."
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-red-500/50 focus:outline-none"
          />
          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:outline-none"
          >
            <option value="">All vehicles</option>
            <option value="bike">Bike</option>
            <option value="car">Car</option>
            <option value="rickshaw">Rickshaw</option>
          </select>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={load}
              className="rounded-xl border border-white/10 p-2.5 text-white/60 hover:text-white transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setModal({})}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold hover:bg-red-700 transition-colors"
            >
              <Plus className="h-4 w-4" /> New Bonus
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
            <DollarSign className="h-8 w-8 text-white/20 mx-auto mb-3" />
            <p className="text-sm text-white/40">No trip bonuses yet.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([city, cityBonuses]) => (
            <div
              key={city}
              className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden"
            >
              <div className="flex items-center gap-2 border-b border-white/6 px-5 py-3">
                <MapPin className="h-4 w-4 text-red-400" />
                <h3 className="font-bold text-white">{city}</h3>
                <span className="text-xs text-white/40">
                  ({cityBonuses.length} rule{cityBonuses.length !== 1 ? "s" : ""})
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      {["Vehicle", "Trip Target", "Bonus (PKR)", "Notes", "Active", ""].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-white/30"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cityBonuses.map((b) => {
                      const VIcon = VEHICLE_ICONS[b.vehicle_type] ?? Car;
                      return (
                        <tr
                          key={b.id}
                          className={`border-b border-white/4 hover:bg-white/3 transition-colors ${
                            !b.is_active ? "opacity-50" : ""
                          }`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <VIcon className="h-3.5 w-3.5 text-amber-400" />
                              <span className="capitalize text-white/80">{b.vehicle_type}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-white">
                            {b.trip_target} trips
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-green-400">
                            PKR {Number(b.bonus_amount).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-white/50 text-xs">{b.notes || "—"}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleToggle(b)}
                              className={`relative h-5 w-9 rounded-full transition-colors ${
                                b.is_active ? "bg-green-500" : "bg-white/20"
                              }`}
                            >
                              <div
                                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                                  b.is_active ? "translate-x-4" : "translate-x-0.5"
                                }`}
                              />
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setModal(b)}
                                className="rounded p-1 text-white/40 hover:text-white hover:bg-white/8 transition-colors"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(b.id)}
                                disabled={deleting === b.id}
                                className="rounded p-1 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30"
                              >
                                {deleting === b.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

// ─── Inquiries Section ────────────────────────────────────────────────────────
function InquiriesSection() {
  const [data, setData] = useState<{ results: InquiryRecord[]; count: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params: Record<string, string> = { page: String(page), page_size: "20" };
    if (debouncedSearch) params.search = debouncedSearch;
    if (typeFilter) params.inquiry_type = typeFilter;
    if (statusFilter) params.status = statusFilter;
    const result = await adminApi.getInquiries(params);
    if (result.error) {
      setError(result.error);
    }
    if (result.data) setData({ results: result.data.results, count: result.data.count });
    setLoading(false);
  }, [page, debouncedSearch, typeFilter, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, [load]);

  const handleStatusChange = async (id: number, status: InquiryStatus) => {
    const result = await adminApi.updateInquiry(id, { status });
    if (result.error) {
      setError(result.error);
      return;
    }
    load();
  };

  const totalPages = data ? Math.ceil(data.count / 20) : 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search name, email, message..."
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-red-500/50 focus:outline-none"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:outline-none"
        >
          <option value="">All types</option>
          <option value="contact">Contact</option>
          <option value="support">Support</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:outline-none"
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <button
          onClick={load}
          className="rounded-xl border border-white/10 p-2.5 text-white/60 hover:text-white transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
        <button
          onClick={() => adminApi.exportInquiriesCsv()}
          className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-sm font-semibold text-white/60 hover:text-white transition-colors"
        >
          <Download className="h-4 w-4" /> Export
        </button>
      </div>

      {data && <p className="text-xs text-white/40">{data.count} inquiry results</p>}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20" />)
        ) : data?.results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
            <Inbox className="h-8 w-8 text-white/20 mx-auto mb-3" />
            <p className="text-sm text-white/40">No inquiries found</p>
          </div>
        ) : (
          data?.results.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border transition-all ${
                item.status === "new"
                  ? "border-amber-500/25 bg-amber-500/5"
                  : "border-white/8 bg-white/3"
              }`}
            >
              <div
                className="flex flex-wrap items-center gap-3 px-4 py-3.5 cursor-pointer"
                onClick={() => setExpanded(expanded === item.id ? null : item.id)}
              >
                <div
                  className={`h-2 w-2 rounded-full shrink-0 ${
                    item.status === "new"
                      ? "bg-amber-400"
                      : item.status === "in_progress"
                        ? "bg-blue-400"
                        : "bg-white/20"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-white text-sm">{item.name}</span>
                    <StatusBadge status={item.status} type="inquiry" />
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        item.inquiry_type === "support"
                          ? "bg-blue-500/15 text-blue-400"
                          : "bg-purple-500/15 text-purple-400"
                      }`}
                    >
                      {item.inquiry_type}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-0.5 truncate">{item.subject}</p>
                </div>
                <div className="text-xs text-white/30 shrink-0">
                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : "—"}
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-white/30 shrink-0 transition-transform ${
                    expanded === item.id ? "rotate-180" : ""
                  }`}
                />
              </div>

              {expanded === item.id && (
                <div className="border-t border-white/6 px-4 py-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {[
                      { label: "Email", value: item.email },
                      { label: "Phone", value: item.phone || "—" },
                    ].map((f) => (
                      <div key={f.label}>
                        <p className="text-white/30 uppercase tracking-wider font-bold mb-1">
                          {f.label}
                        </p>
                        <p className="text-white">{f.value}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-2">
                      Message
                    </p>
                    <p className="text-sm text-white/70 leading-relaxed rounded-lg bg-white/3 border border-white/6 p-3">
                      {item.message}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-white/40 mr-2">Update status:</span>
                    {(["new", "in_progress", "resolved", "closed"] as InquiryStatus[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(item.id, s)}
                        className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
                          item.status === s
                            ? "border-red-500/50 bg-red-500/15 text-red-400"
                            : "border-white/10 text-white/40 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {s.replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/60 disabled:opacity-30 hover:border-white/20 transition-colors"
          >
            ← Prev
          </button>
          <span className="text-xs text-white/40">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/60 disabled:opacity-30 hover:border-white/20 transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
function AdminDashboard() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<View>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [globalSearch, setGlobalSearch] = useState("");
  const prevCountRef = useRef<{ regs: number; inquiries: number }>({ regs: 0, inquiries: 0 });

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/admin/login" });
  }, [isAuthenticated, navigate]);

  const {
    data: summary,
    loading: summaryLoading,
    refetch: refetchSummary,
  } = usePolling(() => adminApi.getDashboardSummary(), 30000);
  const { data: trends } = usePolling(() => adminApi.getDashboardTrends("daily", 14), 60000);
  const { data: distributions } = usePolling(() => adminApi.getDashboardDistributions(), 60000);

  useEffect(() => {
    if (!summary) return;
    const prev = prevCountRef.current;
    const currRegs = summary.totals.registrations;
    const currInq = summary.totals.open_inquiries;

    if (prev.regs > 0 && currRegs > prev.regs) {
      const diff = currRegs - prev.regs;
      setNotifications((n) => [
        {
          id: String(Date.now()),
          type: "registration",
          message: `${diff} new registration${diff > 1 ? "s" : ""} received`,
          time: new Date(),
          read: false,
        },
        ...n.slice(0, 9),
      ]);
    }
    if (prev.inquiries > 0 && currInq > prev.inquiries) {
      const diff = currInq - prev.inquiries;
      setNotifications((n) => [
        {
          id: String(Date.now() + 1),
          type: "inquiry",
          message: `${diff} new inquir${diff > 1 ? "ies" : "y"} submitted`,
          time: new Date(),
          read: false,
        },
        ...n.slice(0, 9),
      ]);
    }
    prevCountRef.current = { regs: currRegs, inquiries: currInq };
  }, [summary]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((n) => n.map((x) => ({ ...x, read: true })));
  };

  if (!isAuthenticated) return null;

  const navItems: { id: View; label: string; Icon: React.ElementType; count?: number }[] = [
    { id: "overview", label: "Overview", Icon: Home },
    {
      id: "registrations",
      label: "Registrations",
      Icon: Users,
      count: summary?.totals.registrations,
    },
    { id: "offers", label: "Offers", Icon: Zap, count: summary?.totals.active_offers },
    {
      id: "bonuses",
      label: "Trip Bonuses",
      Icon: DollarSign,
      count: summary?.totals.active_trip_bonus_records,
    },
    {
      id: "inquiries",
      label: "Inquiries",
      Icon: MessageSquare,
      count: summary?.totals.open_inquiries,
    },
  ];

  const viewTitles: Record<View, string> = {
    overview: "Analytics Overview",
    registrations: "Registration Management",
    offers: "Offers Management",
    bonuses: "Trip Bonuses",
    inquiries: "Contact & Inquiries",
  };

  return (
    <div
      className="flex h-screen overflow-hidden bg-[#0a0a0a] text-white"
      style={{ fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif" }}
    >
      <aside
        className={`flex flex-col border-r border-white/6 bg-[#0d0d0d] transition-all duration-300 ${
          sidebarOpen ? "w-56" : "w-14"
        } shrink-0`}
      >
        <div className="flex h-14 items-center justify-between px-4 border-b border-white/6">
          {sidebarOpen && (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-600">
                <BarChart2 className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black truncate">YWF Admin</p>
                <p className="text-[10px] text-white/30 uppercase tracking-wider">Control Center</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/8 text-white/40 hover:text-white transition-colors shrink-0"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map(({ id, label, Icon, count }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-semibold transition-all ${
                view === id
                  ? "bg-red-600/15 text-red-400 border border-red-500/20"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left truncate">{label}</span>
                  {count !== undefined && count > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                        view === id
                          ? "bg-red-500/25 text-red-400"
                          : "bg-white/10 text-white/40"
                      }`}
                    >
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/6 p-2">
          <button
            onClick={() => {
              logout();
              navigate({ to: "/admin/login" });
            }}
            className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-semibold text-white/40 hover:text-red-400 hover:bg-red-500/8 transition-all"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/6 bg-[#0d0d0d] px-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/30">Control Center</span>
            <ChevronRight className="h-3 w-3 text-white/20" />
            <span className="text-sm font-bold text-white">{viewTitles[view]}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/25" />
              <input
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Quick search..."
                className="w-52 rounded-xl border border-white/8 bg-white/4 pl-9 pr-4 py-2 text-xs text-white placeholder:text-white/25 focus:border-red-500/40 focus:outline-none transition-all"
              />
            </div>

            <button
              onClick={refetchSummary}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/8 text-white/40 hover:text-white hover:border-white/15 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>

            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-white/8 text-white/40 hover:text-white hover:border-white/15 transition-colors"
              >
                <Bell className="h-3.5 w-3.5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-10 z-50 w-72 rounded-2xl border border-white/10 bg-[#111] shadow-2xl overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
                    <span className="text-sm font-bold">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-white/30">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`flex items-start gap-3 border-b border-white/5 px-4 py-3 ${
                            !n.read ? "bg-white/3" : ""
                          }`}
                        >
                          <div
                            className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
                              n.type === "registration" ? "bg-red-500" : "bg-amber-500"
                            }`}
                          />
                          <div className="min-w-0">
                            <p className="text-xs text-white">{n.message}</p>
                            <p className="text-[10px] text-white/30 mt-0.5">
                              {n.time.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 rounded-xl border border-green-500/20 bg-green-500/8 px-2.5 py-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">
                Live
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5">
          <div className="mx-auto max-w-7xl">
            <div className="mb-5">
              <h1 className="text-xl font-black text-white">{viewTitles[view]}</h1>
              {view === "overview" && summary && (
                <p className="text-xs text-white/40 mt-1">
                  Last updated {new Date().toLocaleTimeString()} · Auto-refreshes every 30s
                </p>
              )}
            </div>

            {view === "overview" && (
              <OverviewSection
                summary={summary}
                trends={trends}
                loading={summaryLoading}
              />
            )}
            {view === "registrations" && <RegistrationsSection />}
            {view === "offers" && <OffersSection />}
            {view === "bonuses" && <BonusesSection />}
            {view === "inquiries" && <InquiriesSection />}
          </div>
        </main>
      </div>

      {notifOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setNotifOpen(false)} />
      )}
    </div>
  );
}