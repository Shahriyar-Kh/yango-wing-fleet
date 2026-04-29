/**
 * HeroOfferCards.tsx — auto-rotating offer cards driven by backend API.
 *
 * Render strategy:
 *  • State is pre-seeded with rich local fallback offers → cards are visible
 *    on the very first paint, no skeleton, no blank state.
 *  • A subtle animated shimmer on the badge area signals "refreshing" when the
 *    background API call is still in-flight.
 *  • Once live data arrives it swaps in smoothly via AnimatePresence.
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HardHat,
  Sparkles,
  Palette,
  ChevronLeft,
  ChevronRight,
  Zap,
  BadgeCheck,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useOffers } from "@/hooks/useDynamicSections";
import type { Offer } from "@/lib/api";
import { API_BASE_URL } from "@/lib/api";

// ─── Colour palette (cycles by index) ────────────────────────────────────────

const ACCENT_CLASSES = [
  "from-[oklch(0.58_0.22_25)] to-[oklch(0.48_0.20_18)]",        // red-orange
  "from-[oklch(0.78_0.14_80)] to-[oklch(0.62_0.13_70)]",         // gold-amber
  "from-[oklch(0.52_0.18_230)] to-[oklch(0.42_0.16_250)]",       // blue
  "from-[oklch(0.55_0.18_160)] to-[oklch(0.45_0.16_150)]",       // teal
] as const;

// Icon set — keyed to fallback offer IDs first, then cycles by index
const ICON_BY_ID: Record<number, React.ElementType> = {
  [-1]: HardHat,   // Helmet offer
  [-2]: Zap,       // Welcome bonus
  [-3]: Palette,   // Branding
};
const ICON_FALLBACK: React.ElementType[] = [Sparkles, BadgeCheck, HardHat, Zap];

// ─── Display shape ────────────────────────────────────────────────────────────

interface DisplayOffer {
  id: string;
  badge: string;
  title: string;
  description: string;
  imageUrl: string | null;
  accentClass: string;
  Icon: React.ElementType;
}

function mapOffer(offer: Offer, index: number): DisplayOffer {
  const Icon =
    ICON_BY_ID[offer.id] ?? ICON_FALLBACK[index % ICON_FALLBACK.length];
  return {
    id: `offer-${offer.id}`,
    badge: offer.badge || "Current Offer",
    title: offer.title,
    description: offer.description,
    imageUrl: offer.image ? `${API_BASE_URL}${offer.image}` : null,
    accentClass: ACCENT_CLASSES[index % ACCENT_CLASSES.length],
    Icon,
  };
}

// ─── Main component ───────────────────────────────────────────────────────────

interface HeroOfferCardsProps {
  autoPlayMs?: number;
}

export function HeroOfferCards({ autoPlayMs = 4500 }: HeroOfferCardsProps) {
  // `offers` is never empty: the hook pre-seeds with rich local fallbacks.
  const { offers: apiOffers, loading, isUsingFallback } = useOffers();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const displayOffers: DisplayOffer[] = apiOffers.map(mapOffer);
  const count = displayOffers.length;

  const next = useCallback(() => setActive((p) => (p + 1) % count), [count]);
  const prev = useCallback(
    () => setActive((p) => (p - 1 + count) % count),
    [count],
  );

  // Reset carousel when the offer list changes (fallback → live swap)
  useEffect(() => {
    setActive(0);
  }, [count]);

  // Auto-play
  useEffect(() => {
    if (paused || count === 0) return;
    const id = setInterval(next, autoPlayMs);
    return () => clearInterval(id);
  }, [paused, next, autoPlayMs, count]);

  // count is always ≥ 1 because of fallbacks, but guard just in case
  if (count === 0) return null;

  const offer = displayOffers[active];

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Promotional offers carousel"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={offer.id}
          initial={{ opacity: 0, x: 40, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -40, scale: 0.97 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          className="relative overflow-hidden rounded-3xl glass-strong border border-white/10"
        >
          {/* Gradient top bar */}
          <div className={`h-1 w-full bg-linear-to-r ${offer.accentClass}`} />

          {/* Background image */}
          {offer.imageUrl && (
            <div className="absolute inset-0 -z-10">
              <img
                src={offer.imageUrl}
                alt=""
                className="h-full w-full object-cover opacity-15"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/70" />
            </div>
          )}

          <div className="p-5 sm:p-6">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
              {/* Icon */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[oklch(0.78_0.14_80_/_0.15)]">
                <offer.Icon className="h-5 w-5 text-gold" />
              </div>

              {/* Badge — shimmers while the live API is fetching */}
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest
                  ${
                    loading && isUsingFallback
                      ? "glass animate-pulse text-muted-foreground/60"
                      : "glass text-muted-foreground"
                  }`}
              >
                {offer.badge}
              </span>
            </div>

            {/* Title */}
            <div className="mt-4">
              <div
                className={`text-2xl sm:text-3xl font-black tracking-tight leading-tight bg-linear-to-br ${offer.accentClass} bg-clip-text text-transparent`}
              >
                {offer.title}
              </div>
            </div>

            {/* Description */}
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground line-clamp-3">
              {offer.description}
            </p>

            {/* CTA */}
            <Link
              to="/registration"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              Register Free Now
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot navigation + prev/next arrows */}
      {count > 1 && (
        <div className="mt-4 flex items-center justify-between px-1">
          <div className="flex gap-1.5">
            {displayOffers.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Go to offer ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? "w-6 bg-gold" : "w-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={prev}
              aria-label="Previous offer"
              className="flex h-8 w-8 items-center justify-center rounded-full glass hover:border-gold/40 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              aria-label="Next offer"
              className="flex h-8 w-8 items-center justify-center rounded-full glass hover:border-gold/40 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Auto-play progress bar */}
      {!paused && count > 1 && (
        <motion.div
          key={`${offer.id}-progress`}
          className={`absolute bottom-0 left-0 h-0.5 bg-linear-to-r ${offer.accentClass} rounded-full`}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: autoPlayMs / 1000, ease: "linear" }}
        />
      )}
    </div>
  );
}