import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Send, ShieldCheck, Rocket, ArrowRight } from "lucide-react";
import { Reveal, SectionTitle } from "@/components/ui-kit";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — Yango Driver Onboarding in 4 Steps | Yango Wing Fleet" },
      { name: "description", content: "From form to first ride: see exactly how Yango Wing Fleet onboards new drivers in Pakistan in just 4 simple steps." },
      { property: "og:title", content: "How Yango Wing Fleet Onboarding Works" },
      { property: "og:description", content: "Simple 4-step Yango driver registration process." },
    ],
  }),
  component: HowItWorksPage,
});

const STEPS = [
  { n: "01", icon: FileText, t: "Fill the Form", d: "Complete our quick online registration form with your basic details and vehicle info. Takes under 2 minutes." },
  { n: "02", icon: Send, t: "Submit Details", d: "Submit securely. We receive your application instantly and queue it for review by our local city team." },
  { n: "03", icon: ShieldCheck, t: "Review & Contact", d: "Our team verifies your information and contacts you on WhatsApp or phone within 24 hours to confirm next steps." },
  { n: "04", icon: Rocket, t: "Complete Onboarding", d: "Your Yango driver account is activated. Download the app, go online, and start accepting rides immediately." },
];

function HowItWorksPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-radial" />
        <div className="container-x pt-20 pb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">How It <span className="text-gradient-primary">Works</span></h1>
          <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg text-muted-foreground">A simple, transparent 4-step process from registration to your first ride.</p>
        </div>
      </section>

      <section className="container-x pb-20">
        <div className="relative space-y-6">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="glass-strong rounded-3xl p-8 md:p-10 grid gap-6 md:grid-cols-[auto_1fr] md:items-center hover:border-gold transition-colors">
                <div className="flex items-center gap-5">
                  <div className="text-6xl md:text-7xl font-black text-gradient-primary leading-none">{s.n}</div>
                  <div className="hidden md:flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-gold shadow-gold-glow">
                    <s.icon className="h-8 w-8 text-gold-foreground" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">{s.t}</h2>
                  <p className="mt-2 text-muted-foreground">{s.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 text-center">
          <Link to="/registration" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-4 text-base font-bold text-primary-foreground shadow-glow hover:scale-105 transition-transform">
            Start your registration <ArrowRight className="h-5 w-5" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
