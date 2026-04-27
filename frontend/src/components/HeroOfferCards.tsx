/**
 * HeroOfferCards.tsx
 * Auto-rotating promotional offer poster cards for the hero section.
 * Data-driven: replace HERO_OFFERS with API data in Phase 2.
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, HardHat, Sparkles, ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { Link } from "@tanstack/react-router";

// ─── Data (replace with API / admin panel in Phase 2) ─────────────────────────
export interface HeroOffer {
  id: string;
  badge: string;
  title: string;
  value: string;
  description: string;
  cta: string;
  ctaHref: string;
  accentClass: string; // Tailwind gradient classes
  iconBgClass: string;
  Icon: React.ElementType;
  tag?: string; // e.g. "Limited time"
}

const HERO_OFFERS: HeroOffer[] = [
  {
    id: "new-rider-bonus",
    badge: "New Rider Offer",
    title: "Welcome Bonus",
    value: "PKR 500",
    description:
      "Get a PKR 500 top-up credited to your Yango account after completing your first trip. Instant. No conditions.",
    cta: "Claim Now",
    ctaHref: "/registration",
    accentClass: "from-[oklch(0.58_0.22_25)] to-[oklch(0.48_0.20_18)]",
    iconBgClass: "bg-[oklch(0.58_0.22_25_/_0.2)]",
    Icon: Gift,
    tag: "Limited time",
  },
  {
    id: "bike-helmet-reward",
    badge: "Bike Rider Reward",
    title: "Free Safety Helmet",
    value: "250 Trips",
    description:
      "Complete your first 250 trips and receive a FREE certified safety helmet — our way of rewarding your dedication.",
    cta: "Register Your Bike",
    ctaHref: "/registration",
    accentClass: "from-[oklch(0.78_0.14_80)] to-[oklch(0.62_0.13_70)]",
    iconBgClass: "bg-[oklch(0.78_0.14_80_/_0.15)]",
    Icon: HardHat,
    tag: "Bike only",
  },
  {
    id: "car-rickshaw-branding",
    badge: "Car & Rickshaw Offer",
    title: "Free Yango Branding",
    value: "More Trips",
    description:
      "Get your car or rickshaw professionally branded with Yango decals — proven to boost trip requests and weekly earnings.",
    cta: "Register Your Vehicle",
    ctaHref: "/registration",
    accentClass: "from-[oklch(0.52_0.18_230)] to-[oklch(0.42_0.16_250)]",
    iconBgClass: "bg-[oklch(0.52_0.18_230_/_0.15)]",
    Icon: Sparkles,
    tag: "Car & Rickshaw",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

interface HeroOfferCardsProps {
  offers?: HeroOffer[];
  autoPlayMs?: number;
}

export function HeroOfferCards({ offers = HERO_OFFERS, autoPlayMs = 4500 }: HeroOfferCardsProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = offers.length;

  const next = useCallback(() => setActive((p) => (p + 1) % count), [count]);
  const prev = useCallback(() => setActive((p) => (p - 1 + count) % count), [count]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, autoPlayMs);
    return () => clearInterval(id);
  }, [paused, next, autoPlayMs]);

  const offer = offers[active];

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Promotional offers carousel"
    >
      {/* Card */}
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

          <div className="p-5 sm:p-6">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${offer.iconBgClass}`}
              >
                <offer.Icon className="h-5 w-5 text-gold" />
              </div>
              <div className="flex flex-col items-end gap-1">
                {offer.tag && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gold">
                    <Tag className="h-2.5 w-2.5" /> {offer.tag}
                  </span>
                )}
                <span className="rounded-full glass px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {offer.badge}
                </span>
              </div>
            </div>

            {/* Value + title */}
            <div className="mt-4">
              <div
                className={`text-3xl sm:text-4xl font-black tracking-tight bg-linear-to-br ${offer.accentClass} bg-clip-text text-transparent`}
              >
                {offer.value}
              </div>
              <h3 className="mt-1 text-lg sm:text-xl font-bold leading-snug">{offer.title}</h3>
            </div>

            {/* Description */}
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground line-clamp-3">
              {offer.description}
            </p>

            {/* CTA */}
            <Link
              to={offer.ctaHref as "/registration"}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              {offer.cta}
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-between px-1">
        {/* Dot indicators */}
        <div className="flex gap-1.5">
          {offers.map((_, i) => (
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

        {/* Prev / Next */}
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

      {/* Auto-play progress bar */}
      {!paused && (
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
