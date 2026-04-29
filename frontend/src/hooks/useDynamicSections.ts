/**
 * useDynamicSections — fetches all public content from the backend in one call.
 *
 * Strategy:
 *  1. Immediately populate state with rich local fallbacks (zero loading delay).
 *  2. Fire the API call in the background.
 *  3. When the API responds, merge live data over the fallbacks:
 *       - If live offers exist  → replace fallback offers entirely.
 *       - If live trip_bonuses exist for a city+vehicle combo → replace that
 *         combo's fallback slabs. City+vehicle combos not present in live data
 *         keep their fallback slabs so the UI is never empty.
 *  4. Cross-tab / polling refresh every 30 s keeps content current.
 */

import { useEffect, useState, useCallback } from "react";
import { publicApi } from "@/lib/api";
import type { DynamicSections, Offer, TripBonus } from "@/lib/api";

const PUBLIC_SECTIONS_SYNC_KEY = "ywf-public-sections-sync";

export function notifyPublicSectionsUpdated() {
  if (typeof window === "undefined") return;
  const stamp = String(Date.now());
  try {
    window.localStorage.setItem(PUBLIC_SECTIONS_SYNC_KEY, stamp);
  } catch {
    /* ignore */
  }
  if (typeof BroadcastChannel !== "undefined") {
    try {
      const ch = new BroadcastChannel(PUBLIC_SECTIONS_SYNC_KEY);
      ch.postMessage(stamp);
      ch.close();
    } catch {
      /* ignore */
    }
  }
}

// ─── Rich local fallbacks (mirrors backend fallbacks.py) ─────────────────────

export const FALLBACK_OFFERS: Offer[] = [
  {
    id: -1,
    title: "Free Safety Helmet",
    description:
      "Register your bike and complete 250 trips to receive a FREE certified Yango safety helmet. No extra cost — just ride and earn.",
    badge: "Bike Only",
    image: null,
    priority: 1,
    is_active: true,
    start_date: null,
    end_date: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: -2,
    title: "Welcome Top-Up Bonus",
    description:
      "New bike, car and rickshaw drivers receive a PKR 500 welcome bonus credited instantly after completing your very first trip. No conditions. No waiting.",
    badge: "All Vehicles",
    image: null,
    priority: 2,
    is_active: true,
    start_date: null,
    end_date: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: -3,
    title: "Free Vehicle Branding",
    description:
      "Get your car or rickshaw branded with official Yango livery at zero cost. Branded vehicles enjoy priority request allocation and significantly higher earning potential.",
    badge: "Car & Rickshaw",
    image: null,
    priority: 3,
    is_active: true,
    start_date: null,
    end_date: null,
    created_at: "",
    updated_at: "",
  },
];

export const FALLBACK_TRIP_BONUSES: TripBonus[] = [
  // Lahore · Bike
  { id: -101, city: "Lahore", vehicle_type: "bike", trip_target: 2, bonus_amount: "180.00", notes: "Daily bonus", sort_order: 10, is_active: true },
  { id: -102, city: "Lahore", vehicle_type: "bike", trip_target: 4, bonus_amount: "365.00", notes: "Daily bonus", sort_order: 11, is_active: true },
  { id: -103, city: "Lahore", vehicle_type: "bike", trip_target: 7, bonus_amount: "640.00", notes: "Daily bonus", sort_order: 12, is_active: true },
  { id: -104, city: "Lahore", vehicle_type: "bike", trip_target: 10, bonus_amount: "920.00", notes: "Daily bonus", sort_order: 13, is_active: true },
  { id: -105, city: "Lahore", vehicle_type: "bike", trip_target: 13, bonus_amount: "1200.00", notes: "Daily bonus", sort_order: 14, is_active: true },
  { id: -106, city: "Lahore", vehicle_type: "bike", trip_target: 15, bonus_amount: "1390.00", notes: "Daily bonus", sort_order: 15, is_active: true },
  { id: -107, city: "Lahore", vehicle_type: "bike", trip_target: 17, bonus_amount: "1580.00", notes: "Daily bonus", sort_order: 16, is_active: true },
  { id: -108, city: "Lahore", vehicle_type: "bike", trip_target: 19, bonus_amount: "1770.00", notes: "Daily bonus", sort_order: 17, is_active: true },
  // Lahore · Rickshaw
  { id: -201, city: "Lahore", vehicle_type: "rickshaw", trip_target: 2, bonus_amount: "220.00", notes: "Daily bonus", sort_order: 20, is_active: true },
  { id: -202, city: "Lahore", vehicle_type: "rickshaw", trip_target: 5, bonus_amount: "550.00", notes: "Daily bonus", sort_order: 21, is_active: true },
  { id: -203, city: "Lahore", vehicle_type: "rickshaw", trip_target: 8, bonus_amount: "880.00", notes: "Daily bonus", sort_order: 22, is_active: true },
  { id: -204, city: "Lahore", vehicle_type: "rickshaw", trip_target: 10, bonus_amount: "1100.00", notes: "Daily bonus", sort_order: 23, is_active: true },
  { id: -205, city: "Lahore", vehicle_type: "rickshaw", trip_target: 12, bonus_amount: "1330.00", notes: "Daily bonus", sort_order: 24, is_active: true },
  { id: -206, city: "Lahore", vehicle_type: "rickshaw", trip_target: 14, bonus_amount: "1550.00", notes: "Daily bonus", sort_order: 25, is_active: true },
  { id: -207, city: "Lahore", vehicle_type: "rickshaw", trip_target: 16, bonus_amount: "1780.00", notes: "Daily bonus", sort_order: 26, is_active: true },
  { id: -208, city: "Lahore", vehicle_type: "rickshaw", trip_target: 18, bonus_amount: "2000.00", notes: "Daily bonus", sort_order: 27, is_active: true },
  // Lahore · Car
  { id: -301, city: "Lahore", vehicle_type: "car", trip_target: 2, bonus_amount: "260.00", notes: "Daily bonus", sort_order: 30, is_active: true },
  { id: -302, city: "Lahore", vehicle_type: "car", trip_target: 5, bonus_amount: "650.00", notes: "Daily bonus", sort_order: 31, is_active: true },
  { id: -303, city: "Lahore", vehicle_type: "car", trip_target: 8, bonus_amount: "1050.00", notes: "Daily bonus", sort_order: 32, is_active: true },
  { id: -304, city: "Lahore", vehicle_type: "car", trip_target: 10, bonus_amount: "1310.00", notes: "Daily bonus", sort_order: 33, is_active: true },
  { id: -305, city: "Lahore", vehicle_type: "car", trip_target: 12, bonus_amount: "1580.00", notes: "Daily bonus", sort_order: 34, is_active: true },
  { id: -306, city: "Lahore", vehicle_type: "car", trip_target: 14, bonus_amount: "1840.00", notes: "Daily bonus", sort_order: 35, is_active: true },
  { id: -307, city: "Lahore", vehicle_type: "car", trip_target: 16, bonus_amount: "2100.00", notes: "Daily bonus", sort_order: 36, is_active: true },
  { id: -308, city: "Lahore", vehicle_type: "car", trip_target: 18, bonus_amount: "2370.00", notes: "Daily bonus", sort_order: 37, is_active: true },


    // Islamabad · Bike
  { id: -101, city: "Islamabad", vehicle_type: "bike", trip_target: 2, bonus_amount: "124.00", notes: "Daily bonus", sort_order: 10, is_active: true },
  { id: -102, city: "Islamabad", vehicle_type: "bike", trip_target: 4, bonus_amount: "310.00", notes: "Daily bonus", sort_order: 11, is_active: true },
  { id: -103, city: "Islamabad", vehicle_type: "bike", trip_target: 7, bonus_amount: "434.00", notes: "Daily bonus", sort_order: 12, is_active: true },
  { id: -104, city: "Islamabad", vehicle_type: "bike", trip_target: 10, bonus_amount: "620.00", notes: "Daily bonus", sort_order: 13, is_active: true },
  { id: -105, city: "Islamabad", vehicle_type: "bike", trip_target: 13, bonus_amount: "804.00", notes: "Daily bonus", sort_order: 14, is_active: true },
  { id: -106, city: "Islamabad", vehicle_type: "bike", trip_target: 15, bonus_amount: "930.00", notes: "Daily bonus", sort_order: 15, is_active: true },
  { id: -107, city: "Islamabad", vehicle_type: "bike", trip_target: 17, bonus_amount: "1040.00", notes: "Daily bonus", sort_order: 16, is_active: true },
  { id: -108, city: "Islamabad", vehicle_type: "bike", trip_target: 19, bonus_amount: "1178.00", notes: "Daily bonus", sort_order: 17, is_active: true },
  // Islamabad · Rickshaw
  { id: -201, city: "Islamabad", vehicle_type: "rickshaw", trip_target: 2, bonus_amount: "220.00", notes: "Daily bonus", sort_order: 20, is_active: true },
  { id: -202, city: "Islamabad", vehicle_type: "rickshaw", trip_target: 5, bonus_amount: "550.00", notes: "Daily bonus", sort_order: 21, is_active: true },
  { id: -203, city: "Islamabad", vehicle_type: "rickshaw", trip_target: 8, bonus_amount: "880.00", notes: "Daily bonus", sort_order: 22, is_active: true },
  { id: -204, city: "Islamabad", vehicle_type: "rickshaw", trip_target: 10, bonus_amount: "1100.00", notes: "Daily bonus", sort_order: 23, is_active: true },
  { id: -205, city: "Islamabad", vehicle_type: "rickshaw", trip_target: 12, bonus_amount: "1330.00", notes: "Daily bonus", sort_order: 24, is_active: true },
  { id: -206, city: "Islamabad", vehicle_type: "rickshaw", trip_target: 14, bonus_amount: "1550.00", notes: "Daily bonus", sort_order: 25, is_active: true },
  { id: -207, city: "Islamabad", vehicle_type: "rickshaw", trip_target: 16, bonus_amount: "1780.00", notes: "Daily bonus", sort_order: 26, is_active: true },
  { id: -208, city: "Islamabad", vehicle_type: "rickshaw", trip_target: 18, bonus_amount: "2000.00", notes: "Daily bonus", sort_order: 27, is_active: true },
  // Islamabad · Car
  { id: -301, city: "Islamabad", vehicle_type: "car", trip_target: 2, bonus_amount: "235.00", notes: "Daily bonus", sort_order: 30, is_active: true },
  { id: -302, city: "Islamabad", vehicle_type: "car", trip_target: 5, bonus_amount: "590.00", notes: "Daily bonus", sort_order: 31, is_active: true },
  { id: -303, city: "Islamabad", vehicle_type: "car", trip_target: 8, bonus_amount: "950.00", notes: "Daily bonus", sort_order: 32, is_active: true },
  { id: -304, city: "Islamabad", vehicle_type: "car", trip_target: 10, bonus_amount: "1310.00", notes: "Daily bonus", sort_order: 33, is_active: true },
  { id: -305, city: "Islamabad", vehicle_type: "car", trip_target: 12, bonus_amount: "1550.00", notes: "Daily bonus", sort_order: 34, is_active: true },
  { id: -306, city: "Islamabad", vehicle_type: "car", trip_target: 14, bonus_amount: "1790.00", notes: "Daily bonus", sort_order: 35, is_active: true },
  { id: -307, city: "Islamabad", vehicle_type: "car", trip_target: 16, bonus_amount: "2030.00", notes: "Daily bonus", sort_order: 36, is_active: true },
  { id: -308, city: "Islamabad", vehicle_type: "car", trip_target: 18, bonus_amount: "2280.00", notes: "Daily bonus", sort_order: 37, is_active: true },


    // Karachi · Bike
  { id: -101, city: "Karachi", vehicle_type: "bike", trip_target: 2, bonus_amount: "180.00", notes: "Daily bonus", sort_order: 10, is_active: true },
  { id: -102, city: "Karachi", vehicle_type: "bike", trip_target: 4, bonus_amount: "365.00", notes: "Daily bonus", sort_order: 11, is_active: true },
  { id: -103, city: "Karachi", vehicle_type: "bike", trip_target: 7, bonus_amount: "640.00", notes: "Daily bonus", sort_order: 12, is_active: true },
  { id: -104, city: "Karachi", vehicle_type: "bike", trip_target: 10, bonus_amount: "920.00", notes: "Daily bonus", sort_order: 13, is_active: true },
  { id: -105, city: "Karachi", vehicle_type: "bike", trip_target: 13, bonus_amount: "1200.00", notes: "Daily bonus", sort_order: 14, is_active: true },
  { id: -106, city: "Karachi", vehicle_type: "bike", trip_target: 15, bonus_amount: "1390.00", notes: "Daily bonus", sort_order: 15, is_active: true },
  { id: -107, city: "Karachi", vehicle_type: "bike", trip_target: 17, bonus_amount: "1580.00", notes: "Daily bonus", sort_order: 16, is_active: true },
  { id: -108, city: "Karachi", vehicle_type: "bike", trip_target: 19, bonus_amount: "1770.00", notes: "Daily bonus", sort_order: 17, is_active: true },
  // Karachi · Rickshaw
  { id: -201, city: "Karachi", vehicle_type: "rickshaw", trip_target: 2, bonus_amount: "220.00", notes: "Daily bonus", sort_order: 20, is_active: true },
  { id: -202, city: "Karachi", vehicle_type: "rickshaw", trip_target: 5, bonus_amount: "550.00", notes: "Daily bonus", sort_order: 21, is_active: true },
  { id: -203, city: "Karachi", vehicle_type: "rickshaw", trip_target: 8, bonus_amount: "880.00", notes: "Daily bonus", sort_order: 22, is_active: true },
  { id: -204, city: "Karachi", vehicle_type: "rickshaw", trip_target: 10, bonus_amount: "1100.00", notes: "Daily bonus", sort_order: 23, is_active: true },
  { id: -205, city: "Karachi", vehicle_type: "rickshaw", trip_target: 12, bonus_amount: "1330.00", notes: "Daily bonus", sort_order: 24, is_active: true },
  { id: -206, city: "Karachi", vehicle_type: "rickshaw", trip_target: 14, bonus_amount: "1550.00", notes: "Daily bonus", sort_order: 25, is_active: true },
  { id: -207, city: "Karachi", vehicle_type: "rickshaw", trip_target: 16, bonus_amount: "1780.00", notes: "Daily bonus", sort_order: 26, is_active: true },
  { id: -208, city: "Karachi", vehicle_type: "rickshaw", trip_target: 18, bonus_amount: "2000.00", notes: "Daily bonus", sort_order: 27, is_active: true },
  // Karachi · Car
  { id: -301, city: "Karachi", vehicle_type: "car", trip_target: 2, bonus_amount: "260.00", notes: "Daily bonus", sort_order: 30, is_active: true },
  { id: -302, city: "Karachi", vehicle_type: "car", trip_target: 5, bonus_amount: "650.00", notes: "Daily bonus", sort_order: 31, is_active: true },
  { id: -303, city: "Karachi", vehicle_type: "car", trip_target: 8, bonus_amount: "1050.00", notes: "Daily bonus", sort_order: 32, is_active: true },
  { id: -304, city: "Karachi", vehicle_type: "car", trip_target: 10, bonus_amount: "1310.00", notes: "Daily bonus", sort_order: 33, is_active: true },
  { id: -305, city: "Karachi", vehicle_type: "car", trip_target: 12, bonus_amount: "1580.00", notes: "Daily bonus", sort_order: 34, is_active: true },
  { id: -306, city: "Karachi", vehicle_type: "car", trip_target: 14, bonus_amount: "1840.00", notes: "Daily bonus", sort_order: 35, is_active: true },
  { id: -307, city: "Karachi", vehicle_type: "car", trip_target: 16, bonus_amount: "2100.00", notes: "Daily bonus", sort_order: 36, is_active: true },
  { id: -308, city: "Karachi", vehicle_type: "car", trip_target: 18, bonus_amount: "2370.00", notes: "Daily bonus", sort_order: 37, is_active: true },
];

const FALLBACK: DynamicSections = {
  offers: FALLBACK_OFFERS,
  trip_bonuses: FALLBACK_TRIP_BONUSES,
};

// ─── Merge helper ─────────────────────────────────────────────────────────────
// Live data wins for any city+vehicle combo it covers.
// Fallback slabs survive for combos absent from live data.

function mergeTripBonuses(
  live: TripBonus[],
  fallback: TripBonus[],
): TripBonus[] {
  if (live.length === 0) return fallback;

  // Build a set of city+vehicle combos covered by live data.
  const liveKeys = new Set(live.map((b) => `${b.city}__${b.vehicle_type}`));

  // Keep fallback slabs only for combos NOT present in live data.
  const survivingFallbacks = fallback.filter(
    (b) => !liveKeys.has(`${b.city}__${b.vehicle_type}`),
  );

  return [...live, ...survivingFallbacks];
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseDynamicSectionsReturn {
  data: DynamicSections;
  loading: boolean;
  error: string | null;
  isUsingFallback: boolean;
  refetch: () => void;
}

export function useDynamicSections(): UseDynamicSectionsReturn {
  // Pre-populate with fallbacks — UI renders immediately, never blank.
  const [data, setData] = useState<DynamicSections>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    publicApi.getDynamicSections().then((result) => {
      if (cancelled) return;
      setLoading(false);

      if (result.data) {
        const liveOffers = result.data.offers ?? [];
        const liveBonuses = result.data.trip_bonuses ?? [];

        setData({
          // If the backend returned real offers, use them; otherwise keep fallback.
          offers: liveOffers.length > 0 ? liveOffers : FALLBACK_OFFERS,
          // Merge: live slabs override their city+vehicle combo; missing combos
          // keep fallback slabs so the UI is always populated.
          trip_bonuses: mergeTripBonuses(liveBonuses, FALLBACK_TRIP_BONUSES),
        });
        // We're "using fallback" only when the backend returned 0 offers AND
        // 0 trip bonuses (i.e. the DB is genuinely empty / the API is down).
        setIsUsingFallback(liveOffers.length === 0 && liveBonuses.length === 0);
      } else {
        // Network error — keep existing fallback data visible; log the error.
        setIsUsingFallback(true);
        setError(result.error ?? null);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [tick]);

  // Cross-tab sync via localStorage + BroadcastChannel
  useEffect(() => {
    if (typeof window === "undefined") return;
    const refresh = () => setTick((t) => t + 1);
    const onStorage = (e: StorageEvent) => {
      if (e.key === PUBLIC_SECTIONS_SYNC_KEY) refresh();
    };
    window.addEventListener("storage", onStorage);
    let channel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      channel = new BroadcastChannel(PUBLIC_SECTIONS_SYNC_KEY);
      channel.onmessage = refresh;
    }
    return () => {
      window.removeEventListener("storage", onStorage);
      channel?.close();
    };
  }, []);

  // Background refresh every 30 s
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  return {
    data,
    loading,
    error,
    isUsingFallback,
    refetch: () => setTick((t) => t + 1),
  };
}

// ─── Convenience sub-hooks ────────────────────────────────────────────────────

export function useOffers() {
  const { data, loading, error, isUsingFallback } = useDynamicSections();
  return { offers: data.offers, loading, error, isUsingFallback };
}

export function useCityBonuses(city?: string) {
  const { data, loading, error, isUsingFallback } = useDynamicSections();
  const bonuses = city
    ? data.trip_bonuses.filter(
        (b) => b.city.toLowerCase() === city.toLowerCase(),
      )
    : data.trip_bonuses;
  return { bonuses, loading, error, isUsingFallback };
}