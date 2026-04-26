import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MapPin, Bike, Car, Truck, Trophy, ArrowRight, MessageCircle, Phone } from "lucide-react";
import { CITIES, WHATSAPP_URL, BRAND } from "@/lib/brand";
import { Reveal, SectionTitle } from "@/components/ui-kit";

export const Route = createFileRoute("/cities/$city")({
  loader: ({ params }) => {
    const city = CITIES.find((c) => c.slug === params.city);
    if (!city) throw notFound();
    return { city };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.city.name ?? "City";
    return {
      meta: [
        { title: `Yango Driver Registration in ${name} — Free Onboarding | Yango Wing Fleet` },
        { name: "description", content: `Become a Yango driver in ${name}. Free bike, car & rickshaw registration with local support from Yango Wing Fleet.` },
        { property: "og:title", content: `Yango Registration in ${name}` },
        { property: "og:description", content: `Free Yango driver onboarding in ${name} with 24/7 local support.` },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-x py-32 text-center">
      <h1 className="text-3xl font-bold">City not found</h1>
      <Link to="/" className="mt-4 inline-block text-gold underline">Go home</Link>
    </div>
  ),
  component: CityPage,
});

function CityPage() {
  const { city } = Route.useLoaderData();
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-radial opacity-70" />
        <div className="container-x pt-20 pb-14">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            <MapPin className="h-3.5 w-3.5" /> {city.name}, Pakistan
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight max-w-4xl">
            Yango Driver Registration in <span className="text-gradient-primary">{city.name}</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base md:text-lg text-muted-foreground">
            {city.blurb}. Onboard your bike, car or rickshaw with Yango through Wing Fleet — free, fast, and supported by a local team.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/registration" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-glow hover:scale-105 transition-transform">Register in {city.name} <ArrowRight className="h-4 w-4" /></Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full glass-strong px-6 py-3.5 text-sm font-semibold"><MessageCircle className="h-4 w-4 text-gold" /> WhatsApp</a>
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <SectionTitle eyebrow="Vehicle Types" title={<>Supported in <span className="text-gradient-gold">{city.name}</span></>} />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { icon: Bike, t: "Bike", d: `Fastest growing category in ${city.name}.` },
            { icon: Car, t: "Car", d: `Premium ride demand across ${city.name}.` },
            { icon: Truck, t: "Rickshaw", d: `Wide local coverage in ${city.name}.` },
          ].map((v, i) => (
            <Reveal key={v.t} delay={i * 0.08}>
              <div className="glass rounded-2xl p-6 hover:border-gold transition-all hover:-translate-y-1">
                <v.icon className="h-8 w-8 text-gold" />
                <h3 className="mt-4 text-xl font-bold">{v.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x py-16">
        <SectionTitle eyebrow="Bonuses" title={<>{city.name} weekly <span className="text-gradient-primary">earnings goals</span></>} subtitle="Sample tiers — actual figures vary by Yango campaigns in your city." />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { tier: "Starter", bonus: "PKR 2,500", rides: 40 },
            { tier: "Pro", bonus: "PKR 7,000", rides: 100 },
            { tier: "Elite", bonus: "PKR 13,000", rides: 180 },
          ].map((b, i) => (
            <Reveal key={b.tier} delay={i * 0.08}>
              <div className="glass rounded-2xl p-6">
                <Trophy className="h-8 w-8 text-gold" />
                <div className="mt-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{b.tier}</div>
                <div className="mt-1 text-3xl font-bold text-gradient-gold">{b.bonus}</div>
                <p className="mt-2 text-sm text-muted-foreground">{b.rides}+ rides / week in {city.name}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x py-16">
        <Reveal>
          <div className="rounded-3xl glass-strong p-8 md:p-12 grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Need help in {city.name}?</h2>
              <p className="mt-3 text-muted-foreground">Local support team available 24/7 in Urdu and English.</p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <a href={`tel:${BRAND.phones[0].replace(/-/g, "")}`} className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow"><Phone className="h-4 w-4" /> Call Us</a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full glass px-5 py-3 text-sm font-semibold"><MessageCircle className="h-4 w-4 text-gold" /> WhatsApp</a>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="container-x py-16">
        <h2 className="text-2xl font-bold">Other cities we serve</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {CITIES.filter((c) => c.slug !== city.slug).map((c) => (
            <Link key={c.slug} to="/cities/$city" params={{ city: c.slug }} className="rounded-full glass px-4 py-2 text-sm hover:border-gold transition-colors">
              Yango Registration {c.name}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
