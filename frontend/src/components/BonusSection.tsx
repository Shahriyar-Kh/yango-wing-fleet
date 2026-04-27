/**
 * BonusSection.tsx — premium city bonus infographic driven by backend API.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bike, Car, Truck, Trophy, ChevronRight, MapPin, Loader2 } from "lucide-react";
import { Reveal, SectionTitle } from "@/components/ui-kit";
import { useDynamicSections } from "@/hooks/useDynamicSections";
import type { TripBonus, VehicleType } from "@/lib/api";

// ─── Vehicle tabs config ──────────────────────────────────────────────────────

const VEHICLES: { id: VehicleType; label: string; Icon: React.ElementType }[] = [
  { id: "bike", label: "Bike", Icon: Bike },
  { id: "car", label: "Car", Icon: Car },
  { id: "rickshaw", label: "Rickshaw", Icon: Truck },
];

function formatPKR(n: number | string) {
  const val = typeof n === "string" ? parseFloat(n) : n;
  return `PKR ${val.toLocaleString("en-PK")}`;
}

// ─── Tier bar ─────────────────────────────────────────────────────────────────

function TierRow({
  bonus,
  maxBonus,
  index,
}: {
  bonus: TripBonus;
  maxBonus: number;
  index: number;
}) {
  const val = parseFloat(bonus.bonus_amount);
  const pct = Math.round((val / maxBonus) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="group"
    >
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2 text-sm">
          <Trophy className="h-3.5 w-3.5 text-gold shrink-0" />
          <span className="font-semibold">{bonus.trip_target} trips</span>
        </div>
        <span className="text-sm font-bold text-gradient-gold">
          {formatPKR(bonus.bonus_amount)}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[oklch(0.58_0.22_25)] to-[oklch(0.78_0.14_80)]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: index * 0.05 + 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </motion.div>
  );
}

// ─── City card ────────────────────────────────────────────────────────────────

function CityBonusCard({ city, bonuses }: { city: string; bonuses: TripBonus[] }) {
  const maxBonus = Math.max(...bonuses.map((b) => parseFloat(b.bonus_amount)));
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 border-b border-white/5 px-5 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-primary">
          <MapPin className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <div className="text-sm font-bold">{city}</div>
          <div className="text-[11px] text-muted-foreground uppercase tracking-wider">
            trip bonuses
          </div>
        </div>
        <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
      </div>
      <div className="p-5 space-y-4">
        {bonuses.map((bonus, i) => (
          <TierRow key={bonus.id} bonus={bonus} maxBonus={maxBonus} index={i} />
        ))}
      </div>
      <div className="border-t border-white/5 px-5 py-3 text-[11px] text-muted-foreground">
        * Daily bonus targets. Figures may vary by Yango campaign.
      </div>
    </div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function BonusCardSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden animate-pulse">
      <div className="flex items-center gap-3 border-b border-white/5 px-5 py-4">
        <div className="h-8 w-8 rounded-lg bg-white/10" />
        <div className="space-y-1.5">
          <div className="h-3.5 w-24 rounded bg-white/10" />
          <div className="h-2.5 w-16 rounded bg-white/8" />
        </div>
      </div>
      <div className="p-5 space-y-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between">
              <div className="h-3.5 w-20 rounded bg-white/10" />
              <div className="h-3.5 w-24 rounded bg-white/10" />
            </div>
            <div className="h-2 w-full rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-white/10"
                style={{ width: `${60 + i * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function BonusSection() {
  const [activeVehicle, setActiveVehicle] = useState<VehicleType>("bike");
  const { data, loading } = useDynamicSections();

  // Group trip bonuses by city for the active vehicle type
  const cityMap = new Map<string, TripBonus[]>();
  data.trip_bonuses
    .filter((b) => b.vehicle_type === activeVehicle)
    .forEach((b) => {
      const arr = cityMap.get(b.city) ?? [];
      arr.push(b);
      cityMap.set(b.city, arr);
    });

  const cities = Array.from(cityMap.entries());
  const hasCities = cities.length > 0;

  return (
    <section className="relative py-16 md:py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-radial opacity-40" />
      <div className="container-x">
        <SectionTitle
          eyebrow="Daily Bonuses"
          title={
            <>
              City-wise <span className="text-gradient-primary">trip bonuses</span>
            </>
          }
          subtitle="Complete more trips daily to unlock higher bonuses. Tiers reset every day."
        />

        {/* Vehicle selector */}
        <Reveal className="mt-10 flex justify-center">
          <div className="inline-flex gap-1 rounded-full glass p-1">
            {VEHICLES.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveVehicle(id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                  activeVehicle === id
                    ? "bg-gradient-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* Cards */}
        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <BonusCardSkeleton key={i} />
            ))}
          </div>
        ) : !hasCities ? (
          <div className="mt-10 flex items-center justify-center h-40 glass rounded-2xl">
            <p className="text-muted-foreground text-sm">
              No bonus data available for {activeVehicle} yet.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeVehicle}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              {cities.map(([city, bonuses]) => (
                <CityBonusCard key={city} city={city} bonuses={bonuses} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Highlight */}
        <Reveal className="mt-10">
          <div className="rounded-2xl bg-gradient-to-r from-[oklch(0.58_0.22_25_/_0.15)] to-[oklch(0.78_0.14_80_/_0.1)] border border-gold/20 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Trophy className="h-8 w-8 text-gold shrink-0" />
            <div>
              <div className="text-sm font-bold">Maximize your daily earnings</div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Stack daily bonuses with base fares to significantly boost your monthly income.
                Drivers who hit the highest tier every day can earn{" "}
                <span className="text-gold font-semibold">3–5× more</span> than the base fare alone.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
