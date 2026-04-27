/**
 * routes/admin/dashboard.tsx — private analytics dashboard (JWT required).
 */

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
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
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import {
  useDashboardDistributions,
  useDashboardLatest,
  useDashboardSummary,
  useDashboardTrends,
} from "@/hooks/useDashboard";
import { adminApi } from "@/lib/api";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [{ title: "Admin Dashboard | Yango Wing Fleet" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminDashboard,
});

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  Icon,
  accent = false,
}: {
  label: string;
  value: string | number;
  sub?: string;
  Icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div className={`glass rounded-2xl p-5 ${accent ? "border-gold/30" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="mt-1.5 text-3xl font-bold">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent ? "bg-gradient-gold shadow-gold-glow" : "bg-gradient-primary"}`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400",
    in_progress: "bg-blue-500/20 text-blue-400",
    active: "bg-green-500/20 text-green-400",
    completed: "bg-emerald-500/20 text-emerald-400",
    new: "bg-yellow-500/20 text-yellow-400",
    resolved: "bg-green-500/20 text-green-400",
    closed: "bg-zinc-500/20 text-zinc-400",
  };
  const cls = map[status] ?? "bg-zinc-500/20 text-zinc-400";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${cls}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-5 h-28" />
        ))}
      </div>
      <div className="glass rounded-2xl p-5 h-64" />
      <div className="glass rounded-2xl p-5 h-48" />
      <div className="glass rounded-2xl p-5 h-64" />
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

function AdminDashboard() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const {
    data: summary,
    loading: summaryLoading,
    error: summaryError,
    refetch,
  } = useDashboardSummary();
  const { data: trends, loading: trendsLoading } = useDashboardTrends("daily", 14);
  const { data: distributions, loading: distributionsLoading } = useDashboardDistributions();
  const { data: latestActivity, loading: latestLoading } = useDashboardLatest(10);

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/admin/login" });
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const totals = summary?.totals;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 glass-strong border-b border-border/60">
        <div className="container-x flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart2 className="h-5 w-5 text-gold" />
            <span className="text-sm font-bold">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refetch}
              className="flex h-9 w-9 items-center justify-center rounded-full glass hover:border-gold/40 transition-colors"
              title="Refresh data"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                logout();
                navigate({ to: "/admin/login" });
              }}
              className="flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs font-semibold hover:border-gold/40 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container-x py-8 space-y-8">
        {/* ── Error state ── */}
        {summaryError && (
          <div className="flex items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>Failed to load dashboard: {summaryError}</span>
          </div>
        )}

        {summaryLoading ? (
          <DashboardSkeleton />
        ) : (
          totals && (
            <>
              {/* ── Stat cards ── */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
                  Overview
                </h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <StatCard label="Total Registrations" value={totals.registrations} Icon={Users} />
                  <StatCard
                    label="Today"
                    value={totals.daily_registrations}
                    sub="registrations"
                    Icon={TrendingUp}
                    accent
                  />
                  <StatCard
                    label="This Week"
                    value={totals.weekly_registrations}
                    sub="registrations"
                    Icon={Clock}
                  />
                  <StatCard
                    label="This Month"
                    value={totals.monthly_registrations}
                    sub="registrations"
                    Icon={BarChart2}
                  />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <StatCard label="Active Offers" value={totals.active_offers} Icon={Zap} />
                  <StatCard
                    label="Active Trip Bonuses"
                    value={totals.active_trip_bonus_records}
                    Icon={CheckCircle}
                  />
                  <StatCard
                    label="Open Inquiries"
                    value={totals.open_inquiries}
                    Icon={MessageSquare}
                  />
                </div>
              </div>

              {/* ── Registration trends chart ── */}
              {!trendsLoading && trends && trends.registrations.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-sm font-bold mb-5 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gold" /> Daily Registrations (last 14 days)
                  </h2>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={trends.registrations}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
                      <XAxis
                        dataKey="bucket"
                        tick={{ fill: "oklch(0.68 0.015 80)", fontSize: 10 }}
                        tickFormatter={(v) =>
                          new Date(v).toLocaleDateString("en-PK", {
                            month: "short",
                            day: "numeric",
                          })
                        }
                      />
                      <YAxis tick={{ fill: "oklch(0.68 0.015 80)", fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{
                          background: "oklch(0.18 0.02 25)",
                          border: "1px solid oklch(1 0 0 / 0.1)",
                          borderRadius: 12,
                        }}
                        labelFormatter={(v) => new Date(v).toLocaleDateString()}
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="oklch(0.58 0.22 25)"
                        strokeWidth={2.5}
                        dot={{ fill: "oklch(0.78 0.14 80)", r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* ── City distribution chart ── */}
              {summary.city_counts.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-sm font-bold mb-5 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gold" /> Registrations by City
                  </h2>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={summary.city_counts}
                      margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
                      <XAxis dataKey="city" tick={{ fill: "oklch(0.68 0.015 80)", fontSize: 11 }} />
                      <YAxis tick={{ fill: "oklch(0.68 0.015 80)", fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{
                          background: "oklch(0.18 0.02 25)",
                          border: "1px solid oklch(1 0 0 / 0.1)",
                          borderRadius: 12,
                        }}
                      />
                      <Bar dataKey="total" fill="oklch(0.58 0.22 25)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* ── Vehicle distribution ── */}
              {summary.vehicle_counts.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
                    <Bike className="h-4 w-4 text-gold" /> By Vehicle Type
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {summary.vehicle_counts.map((v) => (
                      <div
                        key={String(v.vehicle_type)}
                        className="flex items-center gap-3 rounded-xl bg-surface-elevated px-4 py-3"
                      >
                        {v.vehicle_type === "bike" && <Bike className="h-5 w-5 text-gold" />}
                        {v.vehicle_type === "car" && <Car className="h-5 w-5 text-gold" />}
                        {v.vehicle_type === "rickshaw" && <Truck className="h-5 w-5 text-gold" />}
                        <div>
                          <p className="text-xs text-muted-foreground capitalize">
                            {String(v.vehicle_type)}
                          </p>
                          <p className="text-xl font-bold">{v.total}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Status / inquiry analytics ── */}
              <div className="grid gap-6 lg:grid-cols-2">
                {summary.status_counts.length > 0 && (
                  <div className="glass rounded-2xl p-6">
                    <h2 className="text-sm font-bold mb-5 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-gold" /> Registration Status
                    </h2>
                    <div className="space-y-3">
                      {summary.status_counts.map((item) => (
                        <div key={String(item.status)} className="flex items-center gap-3">
                          <div className="w-24 shrink-0 text-xs uppercase tracking-wider text-muted-foreground">
                            {String(item.status).replace("_", " ")}
                          </div>
                          <div className="h-2 flex-1 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-primary"
                              style={{
                                width: `${Math.max(10, Math.min(100, Number(item.total) * 12))}%`,
                              }}
                            />
                          </div>
                          <div className="w-8 text-right text-sm font-semibold">{item.total}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {distributions?.inquiries?.status?.length ? (
                  <div className="glass rounded-2xl p-6">
                    <h2 className="text-sm font-bold mb-5 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-gold" /> Inquiry Status
                    </h2>
                    <div className="space-y-3">
                      {distributions.inquiries.status.map((item) => (
                        <div key={String(item.status)} className="flex items-center gap-3">
                          <div className="w-24 shrink-0 text-xs uppercase tracking-wider text-muted-foreground">
                            {String(item.status).replace("_", " ")}
                          </div>
                          <div className="h-2 flex-1 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-gold"
                              style={{
                                width: `${Math.max(10, Math.min(100, Number(item.total) * 12))}%`,
                              }}
                            />
                          </div>
                          <div className="w-8 text-right text-sm font-semibold">{item.total}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* ── Latest registrations table ── */}
              {summary.latest_submissions.length > 0 && (
                <div className="glass rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <h2 className="text-sm font-bold flex items-center gap-2">
                      <Users className="h-4 w-4 text-gold" /> Latest Registrations
                    </h2>
                    <button
                      onClick={() => adminApi.exportRegistrationsCsv()}
                      className="flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs font-semibold hover:border-gold/40 transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" /> Export CSV
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5">
                          {["Name", "City", "Vehicle", "Status", "Date"].map((h) => (
                            <th
                              key={h}
                              className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {summary.latest_submissions.map((r) => (
                          <tr
                            key={r.id}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                          >
                            <td className="px-5 py-3 font-medium">{r.full_name}</td>
                            <td className="px-5 py-3 text-muted-foreground">{r.city}</td>
                            <td className="px-5 py-3 text-muted-foreground capitalize">
                              {r.vehicle_type}
                            </td>
                            <td className="px-5 py-3">
                              <StatusBadge status={r.status ?? "pending"} />
                            </td>
                            <td className="px-5 py-3 text-muted-foreground text-xs">
                              {r.created_at ? new Date(r.created_at).toLocaleDateString() : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {latestActivity?.latest_inquiries?.length ? (
                <div className="glass rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <h2 className="text-sm font-bold flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-gold" /> Latest Inquiries
                    </h2>
                    {latestLoading && (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5">
                          {["Name", "Type", "Subject", "Status", "Date"].map((h) => (
                            <th
                              key={h}
                              className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {latestActivity.latest_inquiries.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                          >
                            <td className="px-5 py-3 font-medium">{item.name}</td>
                            <td className="px-5 py-3 text-muted-foreground capitalize">
                              {item.inquiry_type}
                            </td>
                            <td className="px-5 py-3 text-muted-foreground">{item.subject}</td>
                            <td className="px-5 py-3">
                              <StatusBadge status={item.status ?? "new"} />
                            </td>
                            <td className="px-5 py-3 text-muted-foreground text-xs">
                              {item.created_at
                                ? new Date(item.created_at).toLocaleDateString()
                                : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
            </>
          )
        )}
      </div>
    </div>
  );
}
