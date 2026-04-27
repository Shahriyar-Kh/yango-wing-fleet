/**
 * BonusSection.tsx
 * Premium infographic-style city bonus tables.
 * Data-driven: swap CITY_BONUSES with admin API in Phase 2.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bike, Car, Truck, Trophy, ChevronRight, MapPin } from "lucide-react";
import { Reveal, SectionTitle } from "@/components/ui-kit";

// ─── Types ────────────────────────────────────────────────────────────────────
type VehicleType = "bike" | "car" | "rickshaw";

interface BonusTier {
  trips: number;
  bonus: number; // PKR
}

interface CityBonus {
  city: string;
  slug: string;
  bike: BonusTier[];
  car: BonusTier[];
  rickshaw: BonusTier[];
}

// ─── Dummy Data (replace with admin API call in Phase 2) ─────────────────────
export const CITY_BONUSES: CityBonus[] = [
  {
    city: "Islamabad / Rawalpindi",
    slug: "islamabad",
    bike: [
      { trips: 2,  bonus: 120  },
      { trips: 5,  bonus: 310  },
      { trips: 7,  bonus: 500  },
      { trips: 12, bonus: 720  },
      { trips: 15, bonus: 1020 },
      { trips: 19, bonus: 1200 },
    ],
    car: [
      { trips: 2,  bonus: 200  },
      { trips: 5,  bonus: 500  },
      { trips: 8,  bonus: 900  },
      { trips: 12, bonus: 1400 },
      { trips: 16, bonus: 2000 },
      { trips: 20, bonus: 2800 },
    ],
    rickshaw: [
      { trips: 2,  bonus: 150  },
      { trips: 5,  bonus: 380  },
      { trips: 8,  bonus: 650  },
      { trips: 12, bonus: 950  },
      { trips: 16, bonus: 1400 },
      { trips: 20, bonus: 1900 },
    ],
  },
  {
    city: "Lahore",
    slug: "lahore",
    bike: [
      { trips: 3,  bonus: 150  },
      { trips: 6,  bonus: 380  },
      { trips: 10, bonus: 650  },
      { trips: 14, bonus: 950  },
      { trips: 18, bonus: 1300 },
      { trips: 22, bonus: 1750 },
    ],
    car: [
      { trips: 3,  bonus: 280  },
      { trips: 6,  bonus: 650  },
      { trips: 10, bonus: 1100 },
      { trips: 14, bonus: 1800 },
      { trips: 18, bonus: 2600 },
      { trips: 22, bonus: 3500 },
    ],
    rickshaw: [
      { trips: 3,  bonus: 180  },
      { trips: 6,  bonus: 450  },
      { trips: 10, bonus: 800  },
      { trips: 14, bonus: 1200 },
      { trips: 18, bonus: 1750 },
      { trips: 22, bonus: 2400 },
    ],
  },
  {
    city: "Karachi",
    slug: "karachi",
    bike: [
      { trips: 3,  bonus: 160  },
      { trips: 6,  bonus: 400  },
      { trips: 10, bonus: 700  },
      { trips: 14, bonus: 1050 },
      { trips: 18, bonus: 1400 },
      { trips: 22, bonus: 1900 },
    ],
    car: [
      { trips: 3,  bonus: 300  },
      { trips: 6,  bonus: 700  },
      { trips: 10, bonus: 1250 },
      { trips: 14, bonus: 2000 },
      { trips: 18, bonus: 2900 },
      { trips: 22, bonus: 4000 },
    ],
    rickshaw: [
      { trips: 3,  bonus: 200  },
      { trips: 6,  bonus: 500  },
      { trips: 10, bonus: 900  },
      { trips: 14, bonus: 1350 },
      { trips: 18, bonus: 2000 },
      { trips: 22, bonus: 2700 },
    ],
  },
];
// ─────────────────────────────────────────────────────────────────────────────

const VEHICLES: { id: VehicleType; label: string; Icon: React.ElementType }[] = [
  { id: "bike",     label: "Bike",     Icon: Bike  },
  { id: "car",      label: "Car",      Icon: Car   },
  { id: "rickshaw", label: "Rickshaw", Icon: Truck },
];

function formatPKR(n: number) {
  return `PKR ${n.toLocaleString("en-PK")}`;
}

/** Tier bar — percentage of max bonus in set */
function TierRow({ tier, maxBonus, index }: { tier: BonusTier; maxBonus: number; index: number }) {
  const pct = Math.round((tier.bonus / maxBonus) * 100);
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
          <span className="font-semibold">{tier.trips} trips</span>
        </div>
        <span className="text-sm font-bold text-gradient-gold">{formatPKR(tier.bonus)}</span>
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

function CityBonusCard({ cityBonus, vehicle }: { cityBonus: CityBonus; vehicle: VehicleType }) {
  const tiers = cityBonus[vehicle];
  const maxBonus = Math.max(...tiers.map((t) => t.bonus));

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Card header */}
      <div className="flex items-center gap-3 border-b border-white/5 px-5 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-primary">
          <MapPin className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <div className="text-sm font-bold">{cityBonus.city}</div>
          <div className="text-[11px] text-muted-foreground uppercase tracking-wider">{vehicle} bonuses</div>
        </div>
        <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
      </div>

      {/* Tier rows */}
      <div className="p-5 space-y-4">
        {tiers.map((tier, i) => (
          <TierRow key={tier.trips} tier={tier} maxBonus={maxBonus} index={i} />
        ))}
      </div>

      {/* Bottom note */}
      <div className="border-t border-white/5 px-5 py-3 text-[11px] text-muted-foreground">
        * Daily bonus targets. Figures may vary by Yango campaign.
      </div>
    </div>
  );
}

export function BonusSection() {
  const [activeVehicle, setActiveVehicle] = useState<VehicleType>("bike");

  return (
    <section className="relative py-16 md:py-24">
      {/* Background glow */}
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

        {/* Vehicle selector tabs */}
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

        {/* Cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeVehicle}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {CITY_BONUSES.map((cityBonus) => (
              <CityBonusCard
                key={cityBonus.slug}
                cityBonus={cityBonus}
                vehicle={activeVehicle}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Max earning highlight */}
        <Reveal className="mt-10">
          <div className="rounded-2xl bg-gradient-to-r from-[oklch(0.58_0.22_25_/_0.15)] to-[oklch(0.78_0.14_80_/_0.1)] border border-gold/20 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Trophy className="h-8 w-8 text-gold shrink-0" />
            <div>
              <div className="text-sm font-bold">Maximize your daily earnings</div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Stack daily bonuses with base fares to significantly boost your monthly income. Drivers who hit the highest tier every day can earn <span className="text-gold font-semibold">3–5× more</span> than the base fare alone.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
