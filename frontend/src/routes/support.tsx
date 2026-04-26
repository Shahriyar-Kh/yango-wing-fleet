import { createFileRoute } from "@tanstack/react-router";
import { Headphones, MessageCircle, Phone, Smartphone, MapPin, UserPlus, AlertCircle } from "lucide-react";
import { WHATSAPP_URL, BRAND } from "@/lib/brand";
import { Reveal, SectionTitle } from "@/components/ui-kit";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Driver Support — 24/7 Help for Yango Drivers | Yango Wing Fleet" },
      { name: "description", content: "Get 24/7 support for app issues, account help, onboarding questions and more. Real human help on WhatsApp, call, and in-office." },
      { property: "og:title", content: "24/7 Yango Driver Support" },
      { property: "og:description", content: "Real human help, anytime, in Urdu and English." },
    ],
  }),
  component: SupportPage,
});

const CATEGORIES = [
  { icon: UserPlus, t: "Onboarding Help", d: "Stuck during registration or document review?" },
  { icon: Smartphone, t: "App Issues", d: "Login, OTP, app crashes, or update problems." },
  { icon: MapPin, t: "Map & Navigation", d: "GPS, location accuracy, or routing issues." },
  { icon: AlertCircle, t: "Account Issues", d: "Blocked account, payment delays, or earnings questions." },
];

function SupportPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-radial" />
        <div className="container-x pt-20 pb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold"><Headphones className="h-3.5 w-3.5" /> 24/7 Support</div>
          <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">We're <span className="text-gradient-primary">always here.</span></h1>
          <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg text-muted-foreground">Real humans, real fast. Reach us anytime through WhatsApp, phone or visit our office.</p>
        </div>
      </section>

      <section className="container-x py-12 grid gap-6 md:grid-cols-3">
        <Reveal>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="group block glass rounded-2xl p-6 hover:border-gold transition-all hover:-translate-y-1">
            <MessageCircle className="h-8 w-8 text-gold" />
            <h3 className="mt-4 text-xl font-bold">WhatsApp Help</h3>
            <p className="mt-2 text-sm text-muted-foreground">Fastest response time. Average under 2 minutes.</p>
            <div className="mt-4 text-sm font-semibold text-gold">Chat now →</div>
          </a>
        </Reveal>
        <Reveal delay={0.1}>
          <a href={`tel:${BRAND.phones[0].replace(/-/g, "")}`} className="group block glass rounded-2xl p-6 hover:border-gold transition-all hover:-translate-y-1">
            <Phone className="h-8 w-8 text-gold" />
            <h3 className="mt-4 text-xl font-bold">Call Support</h3>
            <p className="mt-2 text-sm text-muted-foreground">{BRAND.phones[0]}<br />{BRAND.phones[1]}</p>
            <div className="mt-4 text-sm font-semibold text-gold">Call now →</div>
          </a>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="block glass rounded-2xl p-6">
            <MapPin className="h-8 w-8 text-gold" />
            <h3 className="mt-4 text-xl font-bold">Visit Office</h3>
            <p className="mt-2 text-sm text-muted-foreground">{BRAND.address}</p>
            <div className="mt-4 text-sm font-semibold text-gold">Open daily</div>
          </div>
        </Reveal>
      </section>

      <section className="container-x py-12">
        <SectionTitle eyebrow="Common issues" title={<>How can we <span className="text-gradient-gold">help you?</span></>} />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.t} delay={i * 0.06}>
              <div className="glass rounded-2xl p-6 flex items-start gap-4 hover:border-gold transition-colors">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-primary"><c.icon className="h-6 w-6 text-primary-foreground" /></div>
                <div>
                  <h3 className="text-lg font-bold">{c.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
