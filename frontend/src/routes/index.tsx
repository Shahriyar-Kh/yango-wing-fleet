import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Bike, Car, Truck, ShieldCheck, Headphones, Clock, MapPin, Sparkles,
  CheckCircle2, ArrowRight, Play, MessageCircle, Trophy, Users, Star, Phone,
} from "lucide-react";
import heroImg from "@/assets/hero-car.jpg";
import office1 from "@/assets/office-1.jpg";
import office3 from "@/assets/office-3.jpg";
import office4 from "@/assets/office-4.jpg";
import { CITIES, SERVICES, WHATSAPP_URL, BRAND } from "@/lib/brand";
import { Reveal, SectionTitle } from "@/components/ui-kit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yango Wing Fleet — Free Yango Driver Registration in Pakistan" },
      { name: "description", content: "Become a Yango driver in Pakistan. Free bike, car & rickshaw registration with 24/7 support across Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad and Multan." },
      { property: "og:title", content: "Yango Wing Fleet — Free Yango Driver Registration in Pakistan" },
      { property: "og:description", content: "Free Yango onboarding for bikes, cars and rickshaws. Trusted partner across 6 cities." },
    ],
  }),
  component: HomePage,
});

const ICONS = { bike: Bike, car: Car, truck: Truck };

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="Yango partner driver on the road" className="h-full w-full object-cover opacity-30" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
          <div className="absolute inset-0 bg-gradient-radial" />
        </div>

        <div className="container-x relative pt-16 pb-20 md:pt-28 md:pb-32">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              <Sparkles className="h-3.5 w-3.5" /> 100% Free Registration
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Drive with <span className="text-gradient-primary">Yango.</span><br />
              Onboarded by <span className="text-gradient-gold">Wing Fleet.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground">
              Pakistan's most trusted Yango registration partner. Sign up your bike, car or rickshaw in minutes — completely free, with real human support 24/7.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/registration" className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-glow hover:scale-[1.03] transition-transform">
                Register Free Now <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full glass-strong px-6 py-3.5 text-sm font-semibold text-foreground hover:border-gold transition-colors">
                <MessageCircle className="h-4 w-4 text-gold" /> WhatsApp Us
              </a>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-6">
              {[
                { v: "10,000+", l: "Drivers Onboarded" },
                { v: "6", l: "Cities Covered" },
                { v: "24/7", l: "Support Hours" },
              ].map((s, i) => (
                <motion.div key={s.l} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                  <div className="text-2xl md:text-3xl font-bold text-gradient-gold">{s.v}</div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* INTRO VIDEO PLACEHOLDER */}
      <section className="container-x py-16 md:py-24">
        <Reveal>
          <div className="relative aspect-video overflow-hidden rounded-3xl glass-strong shadow-elegant group cursor-pointer">
            <img src={heroImg} alt="Yango Wing Fleet introduction video" className="h-full w-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" width={1920} height={1080} loading="lazy" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-gradient-primary shadow-glow group-hover:scale-110 transition-transform">
                <Play className="h-8 w-8 md:h-10 md:w-10 text-primary-foreground fill-current ml-1" />
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">Watch the story</div>
              <div className="mt-1 text-xl md:text-2xl font-bold">Why thousands of Pakistani drivers trust Wing Fleet</div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* TRUST / OFFICE */}
      <section className="container-x py-16 md:py-24">
        <SectionTitle
          eyebrow="Real office. Real people."
          title={<>Trusted by drivers, <span className="text-gradient-gold">backed by presence.</span></>}
          subtitle="Visit our physical office, meet the team, and onboard with confidence. We're not a faceless website."
        />
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[office1, office3, office4, office1].map((src, i) => (
            <Reveal key={i} delay={i * 0.08} className="group overflow-hidden rounded-2xl border border-border">
              <img src={src} alt={`Yango Wing Fleet office ${i + 1}`} className="aspect-[3/4] h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
            </Reveal>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { icon: ShieldCheck, t: "Verified Partner", d: "Official Yango registration partner in Pakistan." },
            { icon: Headphones, t: "24/7 Support", d: "Real humans on WhatsApp and call, anytime." },
            { icon: Clock, t: "Same-Day Onboarding", d: "Most drivers go online within 24 hours." },
          ].map((f, i) => (
            <Reveal key={f.t} delay={i * 0.1}>
              <div className="glass rounded-2xl p-6 hover:border-gold transition-all hover:-translate-y-1">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-glow"><f.icon className="h-6 w-6 text-primary-foreground" /></div>
                <h3 className="mt-4 text-lg font-bold">{f.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="container-x py-16 md:py-24">
        <SectionTitle eyebrow="Our Services" title={<>Choose your <span className="text-gradient-primary">vehicle</span></>} subtitle="Free registration for every type of Yango partner driver." />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.icon as keyof typeof ICONS];
            return (
              <Reveal key={s.slug} delay={i * 0.1}>
                <Link to="/services" className="group block h-full glass rounded-3xl p-7 hover:border-gold transition-all hover:-translate-y-2 hover:shadow-elegant">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-gold shadow-gold-glow"><Icon className="h-7 w-7 text-gold-foreground" /></div>
                  <h3 className="mt-5 text-2xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.intro}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold group-hover:gap-3 transition-all">Learn more <ArrowRight className="h-4 w-4" /></div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 -z-10 bg-gradient-radial opacity-50" />
        <div className="container-x">
          <SectionTitle eyebrow="How it works" title={<>From form to <span className="text-gradient-gold">first ride</span> in 4 steps</>} />
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-4">
            {[
              { n: "01", t: "Fill the Form", d: "Submit basic details online — takes under 2 minutes." },
              { n: "02", t: "Submit Details", d: "We collect your CNIC and vehicle info securely." },
              { n: "03", t: "Review & Contact", d: "Our team verifies and contacts you within 24 hours." },
              { n: "04", t: "Start Earning", d: "Account activated. Go online and accept your first ride." },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="relative h-full glass rounded-2xl p-6">
                  <div className="text-5xl font-black text-gradient-primary">{s.n}</div>
                  <h3 className="mt-3 text-lg font-bold">{s.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
                  {i < 3 && <ArrowRight className="hidden md:block absolute -right-4 top-10 h-6 w-6 text-gold/40" />}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CITIES */}
      <section className="container-x py-16 md:py-24">
        <SectionTitle eyebrow="Coverage" title={<>Active across <span className="text-gradient-primary">Pakistan</span></>} subtitle="Local teams in every major city." />
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
          {CITIES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.06}>
              <Link to="/cities/$city" params={{ city: c.slug }} className="group block glass rounded-2xl p-6 hover:border-gold transition-all hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary"><MapPin className="h-5 w-5 text-primary-foreground" /></div>
                  <div>
                    <h3 className="text-lg font-bold">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">{c.blurb}</p>
                  </div>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold group-hover:gap-3 transition-all">Register in {c.name} <ArrowRight className="h-3.5 w-3.5" /></div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* BONUS / GOALS */}
      <section className="container-x py-16 md:py-24">
        <SectionTitle eyebrow="Earnings" title={<>Hit goals. <span className="text-gradient-gold">Earn bonuses.</span></>} subtitle="Sample weekly targets for active Yango partner drivers." />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { tier: "Starter", rides: 50, bonus: "PKR 3,000", icon: Trophy },
            { tier: "Pro", rides: 120, bonus: "PKR 8,500", icon: Star, featured: true },
            { tier: "Elite", rides: 200, bonus: "PKR 15,000", icon: Sparkles },
          ].map((b, i) => (
            <Reveal key={b.tier} delay={i * 0.1}>
              <div className={`relative h-full rounded-3xl p-7 transition-all hover:-translate-y-2 ${b.featured ? "bg-gradient-primary shadow-glow" : "glass"}`}>
                {b.featured && <div className="absolute -top-3 left-7 rounded-full bg-gradient-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-foreground">Most Popular</div>}
                <b.icon className={`h-8 w-8 ${b.featured ? "text-white" : "text-gold"}`} />
                <div className="mt-4 text-sm font-semibold uppercase tracking-wider opacity-80">{b.tier}</div>
                <div className="mt-2 text-4xl font-bold">{b.bonus}</div>
                <div className="mt-1 text-sm opacity-80">per week bonus</div>
                <div className="mt-6 flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4" /> {b.rides} completed rides</div>
                <div className="mt-2 flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4" /> Quality rating ≥ 4.6</div>
                <div className="mt-2 flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4" /> Acceptance ≥ 80%</div>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">*Sample figures for illustration. Actual bonuses set by Yango and may vary by city and campaign.</p>
      </section>

      {/* SUPPORT */}
      <section className="container-x py-16 md:py-24">
        <Reveal>
          <div className="overflow-hidden rounded-3xl glass-strong p-8 md:p-14">
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground"><Users className="h-3.5 w-3.5" /> Always here for you</div>
                <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">24/7 driver support<br /><span className="text-gradient-gold">in your language.</span></h2>
                <p className="mt-4 text-muted-foreground">Stuck on the app? Account issue? Bonus question? Our local team is one tap away — Urdu, English and Punjabi.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow"><MessageCircle className="h-4 w-4" /> WhatsApp Now</a>
                  <a href={`tel:${BRAND.phones[0].replace(/-/g, "")}`} className="inline-flex items-center gap-2 rounded-full glass px-5 py-3 text-sm font-semibold"><Phone className="h-4 w-4 text-gold" /> {BRAND.phones[0]}</a>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { v: "< 2 min", l: "Avg response" },
                  { v: "98%", l: "Issues solved" },
                  { v: "Free", l: "Always" },
                  { v: "Local", l: "Pakistan team" },
                ].map((s) => (
                  <div key={s.l} className="rounded-2xl bg-surface-elevated p-5 text-center">
                    <div className="text-2xl md:text-3xl font-bold text-gradient-gold">{s.v}</div>
                    <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ PREVIEW */}
      <section className="container-x py-16 md:py-24">
        <SectionTitle eyebrow="Common questions" title={<>Got <span className="text-gradient-primary">questions?</span></>} />
        <div className="mt-10 mx-auto max-w-3xl space-y-3">
          {[
            { q: "Is the Yango registration really free?", a: "Yes. We never charge any fee for onboarding bike, car or rickshaw drivers." },
            { q: "How long does the registration take?", a: "Most drivers go online within 24 hours after submitting their details." },
            { q: "Which cities are supported?", a: "Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad and Multan — with more coming soon." },
          ].map((f, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <details className="group glass rounded-2xl p-5 open:border-gold transition-colors">
                <summary className="flex cursor-pointer items-center justify-between text-left font-semibold list-none">
                  {f.q}
                  <span className="ml-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-surface-elevated text-gold transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            </Reveal>
          ))}
          <div className="pt-4 text-center">
            <Link to="/faq" className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:gap-3 transition-all">View all FAQs <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container-x py-16 md:py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-10 md:p-16 text-center shadow-glow">
            <div className="absolute inset-0 bg-gradient-radial opacity-40" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-primary-foreground">Ready to drive with Yango?</h2>
              <p className="mt-4 text-base md:text-lg text-primary-foreground/90">Free registration. Real support. Start earning this week.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/registration" className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3.5 text-sm font-bold text-gold-foreground shadow-gold-glow hover:scale-105 transition-transform">Register Free Now <ArrowRight className="h-4 w-4" /></Link>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full glass-strong px-6 py-3.5 text-sm font-semibold text-primary-foreground"><MessageCircle className="h-4 w-4" /> Talk to us</a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
