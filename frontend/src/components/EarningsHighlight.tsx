/**
 * EarningsHighlight.tsx
 * Premium earnings potential section for the homepage.
 * Showcases monthly earning caps per vehicle type with animated counters.
 */

import { motion } from "framer-motion";
import { Bike, Car, Truck, TrendingUp } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/ui-kit";

// ─── Data (replace with API in Phase 2) ──────────────────────────────────────
export interface EarningTier {
  id: string;
  vehicle: string;
  Icon: React.ElementType;
  monthly: string; // display string
  monthlyRaw: number; // for animation
  description: string;
  highlight?: boolean;
  gradientClass: string;
  iconGlow: string;
}

const EARNINGS_DATA: EarningTier[] = [
  {
    id: "bike",
    vehicle: "Bike",
    Icon: Bike,
    monthly: "Rs 1,40,000",
    monthlyRaw: 140000,
    description:
      "Top bike riders in Lahore & Islamabad earn up to Rs 1.4 lac per month with consistent daily trips.",
    gradientClass: "from-[oklch(0.58_0.22_25)] to-[oklch(0.48_0.20_18)]",
    iconGlow: "shadow-glow",
  },
  {
    id: "rickshaw",
    vehicle: "Rickshaw",
    Icon: Truck,
    monthly: "Rs 2,00,000",
    monthlyRaw: 200000,
    description:
      "Rickshaw drivers covering busy routes in Rawalpindi & Islamabad can earn up to Rs 2 lac monthly.",
    highlight: true,
    gradientClass: "from-[oklch(0.78_0.14_80)] to-[oklch(0.62_0.13_70)]",
    iconGlow: "shadow-gold-glow",
  },
  {
    id: "car",
    vehicle: "Car",
    Icon: Car,
    monthly: "Rs 3,00,000",
    monthlyRaw: 300000,
    description:
      "Premium car partners serving Karachi & Lahore markets have reported earnings of Rs 3 lac+ per month.",
    gradientClass: "from-[oklch(0.52_0.18_230)] to-[oklch(0.42_0.16_250)]",
    iconGlow: "shadow-elegant",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

export function EarningsHighlight() {
  return (
    <section className="container-x py-16 md:py-24">
      {/* Header */}
      <Reveal className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          <TrendingUp className="h-3.5 w-3.5" /> Real Earning Potential
        </div>
        <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
          How much can you <span className="text-gradient-gold">earn per month?</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
          Top Yango drivers across Pakistan are earning life-changing income. Here's what's possible
          with consistency.
        </p>
      </Reveal>

      {/* Cards */}
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {EARNINGS_DATA.map((tier, i) => (
          <Reveal key={tier.id} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`relative overflow-hidden rounded-3xl ${
                tier.highlight
                  ? "bg-linear-to-br from-[oklch(0.22_0.06_80)] to-[oklch(0.18_0.04_70)] border border-gold/30"
                  : "glass"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 rounded-b-full bg-gradient-gold px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-gold-foreground">
                  Most Popular
                </div>
              )}

              {/* Top accent bar */}
              <div className={`h-1 w-full bg-linear-to-r ${tier.gradientClass}`} />

              <div className="p-6">
                {/* Icon */}
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${tier.gradientClass} ${tier.iconGlow}`}
                >
                  <tier.Icon className="h-6 w-6 text-white" />
                </div>

                {/* Vehicle label */}
                <div className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {tier.vehicle}
                </div>

                {/* Earning value */}
                <div
                  className={`mt-1 text-4xl font-black tracking-tight bg-linear-to-br ${tier.gradientClass} bg-clip-text text-transparent`}
                >
                  {tier.monthly}
                </div>
                <div className="text-xs text-muted-foreground">per month (up to)</div>

                {/* Divider */}
                <div className="my-4 h-px bg-white/5" />

                {/* Description */}
                <p className="text-sm leading-relaxed text-muted-foreground">{tier.description}</p>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>

      {/* Disclaimer + CTA */}
      <Reveal className="mt-10 text-center">
        <p className="text-xs text-muted-foreground">
          * Figures based on top-performing drivers. Actual earnings depend on city, trips, hours,
          and Yango campaigns.
        </p>
        <Link
          to="/registration"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-glow hover:scale-105 transition-transform"
        >
          Start Earning Today
        </Link>
      </Reveal>
    </section>
  );
}
