/**
 * HeroOfferCards.tsx — auto-rotating offer cards driven by backend API.
 * Falls back to static offers when the API is unavailable.
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, HardHat, Sparkles, ChevronLeft, ChevronRight, Tag, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useOffers } from "@/hooks/useDynamicSections";
import type { Offer } from "@/lib/api";
import { API_BASE_URL } from "@/lib/api";

// ─── Colour palette for backend offers (cycles by index) ──────────────────────

const ACCENT_CLASSES = [
  "from-[oklch(0.58_0.22_25)] to-[oklch(0.48_0.20_18)]",
  "from-[oklch(0.78_0.14_80)] to-[oklch(0.62_0.13_70)]",
  "from-[oklch(0.52_0.18_230)] to-[oklch(0.42_0.16_250)]",
  "from-[oklch(0.55_0.18_160)] to-[oklch(0.45_0.16_150)]",
] as const;

const ICON_COMPONENTS = [Gift, HardHat, Sparkles, Tag];

// ─── Map backend Offer → display card shape ───────────────────────────────────

interface DisplayOffer {
  id: string;
  badge: string;
  title: string;
  value: string;
  description: string;
  imageUrl: string | null;
  accentClass: string;
  Icon: React.ElementType;
}

function mapOffer(offer: Offer, index: number): DisplayOffer {
  return {
    id: `offer-${offer.id}`,
    badge: offer.badge || "Current Offer",
    title: offer.title,
    // Use the badge as the "value" display if no explicit value field
    value: offer.badge || offer.title,
    description: offer.description,
    imageUrl: offer.image ? `${API_BASE_URL}${offer.image}` : null,
    accentClass: ACCENT_CLASSES[index % ACCENT_CLASSES.length],
    Icon: ICON_COMPONENTS[index % ICON_COMPONENTS.length],
  };
}

// ─── Skeleton card ─────────────────────────────────────────────────────────────

function OfferCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-3xl glass-strong border border-white/10 p-5 sm:p-6">
      <div className="h-1 w-full rounded-full bg-white/10 animate-pulse" />
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="h-11 w-11 rounded-xl bg-white/10 animate-pulse" />
        <div className="h-5 w-24 rounded-full bg-white/10 animate-pulse" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-8 w-32 rounded-lg bg-white/10 animate-pulse" />
        <div className="h-5 w-48 rounded-lg bg-white/10 animate-pulse" />
      </div>
      <div className="mt-3 space-y-1.5">
        <div className="h-3 w-full rounded bg-white/8 animate-pulse" />
        <div className="h-3 w-4/5 rounded bg-white/8 animate-pulse" />
      </div>
      <div className="mt-5 h-10 w-full rounded-full bg-white/10 animate-pulse flex items-center justify-center">
        <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

interface HeroOfferCardsProps {
  autoPlayMs?: number;
}

export function HeroOfferCards({ autoPlayMs = 4500 }: HeroOfferCardsProps) {
  const { offers: apiOffers, loading } = useOffers();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const displayOffers: DisplayOffer[] = apiOffers.map(mapOffer);
  const count = displayOffers.length;

  const next = useCallback(() => setActive((p) => (p + 1) % count), [count]);
  const prev = useCallback(() => setActive((p) => (p - 1 + count) % count), [count]);

  // Reset active index if offers change
  useEffect(() => {
    setActive(0);
  }, [count]);

  useEffect(() => {
    if (paused || count === 0) return;
    const id = setInterval(next, autoPlayMs);
    return () => clearInterval(id);
  }, [paused, next, autoPlayMs, count]);

  if (loading) return <OfferCardSkeleton />;
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

          {/* Background image (if present) */}
          {offer.imageUrl && (
            <div className="absolute inset-0 -z-10">
              <img src={offer.imageUrl} alt="" className="h-full w-full object-cover opacity-15" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/70" />
            </div>
          )}

          <div className="p-5 sm:p-6">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[oklch(0.78_0.14_80_/_0.15)]`}
              >
                <offer.Icon className="h-5 w-5 text-gold" />
              </div>
              <span className="rounded-full glass px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {offer.badge}
              </span>
            </div>

            {/* Value + title */}
            <div className="mt-4">
              <div
                className={`text-3xl sm:text-4xl font-black tracking-tight bg-linear-to-br ${offer.accentClass} bg-clip-text text-transparent`}
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
              Register Now
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      {count > 1 && (
        <div className="mt-4 flex items-center justify-between px-1">
          <div className="flex gap-1.5">
            {displayOffers.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Go to offer ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-gold" : "w-1.5 bg-white/20"}`}
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
