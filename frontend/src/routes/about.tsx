import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, BadgeCheck, Users, Award, ArrowRight } from "lucide-react";
import office1 from "@/assets/office-1.jpg";
import office2 from "@/assets/office-2.jpg";
import office3 from "@/assets/office-3.jpg";
import office4 from "@/assets/office-4.jpg";
import { Reveal, SectionTitle } from "@/components/ui-kit";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Yango Wing Fleet — Pakistan's Trusted Yango Partner" },
      {
        name: "description",
        content:
          "Yango Wing Fleet is Pakistan's leading Yango registration partner. Learn our story, mission, and commitment to driver success.",
      },
      { property: "og:title", content: "About Yango Wing Fleet" },
      { property: "og:description", content: "Trusted Yango onboarding partner across Pakistan." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-radial" />
        <div className="container-x pt-20 pb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
            About <span className="text-gradient-primary">Yango Wing Fleet</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base md:text-lg text-muted-foreground">
            We help Pakistani drivers earn with dignity. Free Yango onboarding, real human support,
            and a trusted physical presence in your city.
          </p>
        </div>
      </section>

      <section className="container-x py-12 grid gap-10 md:grid-cols-2 md:items-center">
        <Reveal>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Yango Wing Fleet was founded with one mission: to make Yango onboarding effortless and
              free for every driver in Pakistan. From our office in Lahore, we've helped thousands
              of bike, car, and rickshaw owners turn their vehicles into a source of income.
            </p>
            <p>
              We believe drivers deserve a partner who shows up — physically, locally, and at any
              hour. That's why we never charge for registration, why our support team works around
              the clock, and why we keep our doors open.
            </p>
            <p className="text-foreground font-semibold">
              Free registration is not a promotion. It's our standard.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 gap-3">
            {[office1, office2, office3, office4].map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Yango Wing Fleet office ${i + 1}`}
                className="aspect-square rounded-2xl object-cover"
                loading="lazy"
              />
            ))}
          </div>
        </Reveal>
      </section>

      <section className="container-x py-16">
        <SectionTitle
          eyebrow="What we stand for"
          title={
            <>
              Our <span className="text-gradient-gold">values</span>
            </>
          }
        />
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {[
            { icon: ShieldCheck, t: "Trust", d: "Verified Yango partner with a real office." },
            { icon: BadgeCheck, t: "Always Free", d: "Zero registration fees. Forever." },
            { icon: Users, t: "Local Team", d: "Pakistani support, in your language." },
            { icon: Award, t: "Driver-First", d: "Every decision starts with driver success." },
          ].map((v, i) => (
            <Reveal key={v.t} delay={i * 0.08}>
              <div className="glass rounded-2xl p-6 text-center hover:border-gold transition-all hover:-translate-y-1">
                <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary">
                  <v.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-bold">{v.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x py-16 text-center">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold">Ready to ride with us?</h2>
          <Link
            to="/registration"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-glow hover:scale-105 transition-transform"
          >
            Register Free <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
