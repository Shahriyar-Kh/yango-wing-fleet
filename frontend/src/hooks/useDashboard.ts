/**
 * Dashboard data hooks — all authenticated, admin-only.
 */

import { useEffect, useState, useCallback } from "react";
import { adminApi } from "@/lib/api";
import type {
  DashboardSummary,
  DashboardTrends,
  DashboardDistributions,
  DashboardLatest,
} from "@/lib/api";

// ─── Generic admin query hook ─────────────────────────────────────────────────

function useAdminQuery<T>(fetcher: () => Promise<{ data: T | null; error: string | null }>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetcher();
    setData(result.data);
    setError(result.error);
    setLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ─── Dashboard summary ────────────────────────────────────────────────────────

export function useDashboardSummary() {
  return useAdminQuery<DashboardSummary>(() => adminApi.getDashboardSummary());
}

// ─── Dashboard trends ─────────────────────────────────────────────────────────

export function useDashboardTrends(
  period: "daily" | "weekly" | "monthly" | "yearly" = "daily",
  limit = 30,
) {
  const [data, setData] = useState<DashboardTrends | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await adminApi.getDashboardTrends(period, limit);
    setData(result.data);
    setError(result.error);
    setLoading(false);
  }, [period, limit]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ─── Dashboard distributions ──────────────────────────────────────────────────

export function useDashboardDistributions() {
  return useAdminQuery<DashboardDistributions>(() => adminApi.getDashboardDistributions());
}

// ─── Dashboard latest activity ────────────────────────────────────────────────

export function useDashboardLatest(limit = 20) {
  const [data, setData] = useState<DashboardLatest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await adminApi.getDashboardLatest(limit);
    setData(result.data);
    setError(result.error);
    setLoading(false);
  }, [limit]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
