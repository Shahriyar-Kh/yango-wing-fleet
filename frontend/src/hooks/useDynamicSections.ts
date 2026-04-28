/**
 * useDynamicSections — fetches all public content from the backend in one call.
 * Falls back gracefully to empty arrays; never throws.
 */

import { useEffect, useState } from "react";
import { publicApi } from "@/lib/api";
import type { DynamicSections, Offer, TripBonus } from "@/lib/api";

const PUBLIC_SECTIONS_SYNC_KEY = "ywf-public-sections-sync";

export function notifyPublicSectionsUpdated() {
  if (typeof window === "undefined") return;

  const stamp = String(Date.now());
  try {
    window.localStorage.setItem(PUBLIC_SECTIONS_SYNC_KEY, stamp);
  } catch {
    // Ignore storage failures; polling still keeps data fresh.
  }

  if (typeof BroadcastChannel !== "undefined") {
    try {
      const channel = new BroadcastChannel(PUBLIC_SECTIONS_SYNC_KEY);
      channel.postMessage(stamp);
      channel.close();
    } catch {
      // Ignore broadcast failures.
    }
  }
}

// ─── Fallback data (mirrors backend fallbacks.py) ─────────────────────────────

const FALLBACK_OFFERS: Offer[] = [
  {
    id: -1,
    title: "Welcome Bonus",
    description: "Get a PKR 500 top-up after completing your first trip. Instant. No conditions.",
    badge: "New Rider",
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
    title: "Free Safety Helmet",
    description: "Complete 250 trips and receive a FREE certified safety helmet.",
    badge: "Bike Only",
    image: null,
    priority: 2,
    is_active: true,
    start_date: null,
    end_date: null,
    created_at: "",
    updated_at: "",
  },
];

const FALLBACK_TRIP_BONUSES: TripBonus[] = [
  {
    id: -1,
    city: "Lahore",
    vehicle_type: "bike",
    trip_target: 50,
    bonus_amount: "3000.00",
    notes: "",
    sort_order: 1,
    is_active: true,
  },
  {
    id: -2,
    city: "Karachi",
    vehicle_type: "car",
    trip_target: 80,
    bonus_amount: "8500.00",
    notes: "",
    sort_order: 2,
    is_active: true,
  },
];

const FALLBACK: DynamicSections = {
  offers: FALLBACK_OFFERS,
  trip_bonuses: FALLBACK_TRIP_BONUSES,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseDynamicSectionsReturn {
  data: DynamicSections;
  loading: boolean;
  error: string | null;
  isUsingFallback: boolean;
  refetch: () => void;
}

export function useDynamicSections(): UseDynamicSectionsReturn {
  const [data, setData] = useState<DynamicSections>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    publicApi.getDynamicSections().then((result) => {
      if (cancelled) return;
      setLoading(false);

      if (result.data) {
        setData(result.data);
        setIsUsingFallback(false);
      } else {
        setData(FALLBACK);
        setIsUsingFallback(true);
        setError(result.error);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [tick]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const refresh = () => setTick((t) => t + 1);

    const onStorage = (event: StorageEvent) => {
      if (event.key === PUBLIC_SECTIONS_SYNC_KEY) refresh();
    };

    window.addEventListener("storage", onStorage);

    let channel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      channel = new BroadcastChannel(PUBLIC_SECTIONS_SYNC_KEY);
      channel.onmessage = refresh;
    }

    return () => {
      window.removeEventListener("storage", onStorage);
      if (channel) channel.close();
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => t + 1);
    }, 30000);

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
  const { data, loading, error } = useDynamicSections();
  const bonuses = city
    ? data.trip_bonuses.filter((b) => b.city.toLowerCase() === city.toLowerCase())
    : data.trip_bonuses;
  return { bonuses, loading, error };
}
