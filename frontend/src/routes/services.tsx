import { createFileRoute, Link } from "@tanstack/react-router";
import { Bike, Car, Truck, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { SERVICES } from "@/lib/brand";
import { Reveal, SectionTitle } from "@/components/ui-kit";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Bike, Car & Rickshaw Yango Registration | Yango Wing Fleet" },
      { name: "description", content: "Free Yango driver registration for bikes, cars and rickshaws across Pakistan. Step-by-step onboarding with 24/7 support." },
      { property: "og:title", content: "Yango Registration Services — Bike, Car, Rickshaw" },
      { property: "og:description", content: "Free onboarding with Yango Wing Fleet — quick, trusted and 100% online." },
    ],
  }),
  component: ServicesPage,
});

const ICONS = { bike: Bike, car: Car, truck: Truck };

function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-radial" />
        <div className="container-x pt-20 pb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            <Sparkles className="h-3.5 w-3.5" /> All registrations 100% free
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">Our <span className="text-gradient-primary">Services</span></h1>
          <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg text-muted-foreground">Choose your vehicle type and get onboarded with Yango through Pakistan's most trusted partner.</p>
        </div>
      </section>

      <section className="container-x pb-20 space-y-10">
        {SERVICES.map((s, i) => {
          const Icon = ICONS[s.icon as keyof typeof ICONS];
          return (
            <Reveal key={s.slug} delay={i * 0.05}>
              <article className="glass-strong rounded-3xl p-8 md:p-12 hover:border-gold transition-colors">
                <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
                  <div>
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-gold shadow-gold-glow">
                      <Icon className="h-8 w-8 text-gold-foreground" />
                    </div>
                    <h2 className="mt-5 text-3xl md:text-4xl font-bold">{s.title}</h2>
                    <p className="mt-3 text-muted-foreground">{s.intro}</p>
                    <Link to="/registration" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow hover:scale-105 transition-transform">
                      Register Now <ArrowRight className="h-4 w-4" />
                    </Link>
                    <p className="mt-4 text-xs text-gold">{s.note}</p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="rounded-2xl bg-surface-elevated p-6">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gold">Required Details</h3>
                      <ul className="mt-4 space-y-2.5">
                        {s.requirements.map((r) => (
                          <li key={r} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" /> {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl bg-surface-elevated p-6">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gold">Steps to Register</h3>
                      <ol className="mt-4 space-y-3">
                        {s.steps.map((step, idx) => (
                          <li key={step} className="flex items-start gap-3 text-sm">
                            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground">{idx + 1}</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </section>

      <section className="container-x pb-24">
        <SectionTitle title={<>Not sure which fits you?</>} subtitle="Talk to our team — we'll help you pick the right path in minutes." />
        <div className="mt-8 text-center">
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3.5 text-sm font-bold text-gold-foreground shadow-gold-glow">Contact Us <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
