import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal, SectionTitle } from "@/components/ui-kit";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Yango Driver Registration Questions | Yango Wing Fleet" },
      {
        name: "description",
        content:
          "Answers to common questions about Yango driver registration in Pakistan: fees, cities, vehicles, support, timing and more.",
      },
      { property: "og:title", content: "Frequently Asked Questions" },
      {
        property: "og:description",
        content: "Everything you need to know about registering as a Yango driver.",
      },
    ],
  }),
  component: FAQPage,
});

const FAQS = [
  {
    q: "Is Yango Wing Fleet's registration really free?",
    a: "Yes, completely. We never charge any fee for onboarding bike, car, or rickshaw drivers. There are no hidden costs at any stage.",
  },
  {
    q: "How long does the registration process take?",
    a: "Most drivers complete onboarding within 24 hours of submitting the form. Our team contacts you for verification and activation.",
  },
  {
    q: "Which cities do you support?",
    a: "We currently serve Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, and Multan — with more cities being added soon.",
  },
  {
    q: "What vehicles can I register?",
    a: "Bikes, cars, and rickshaws. Each has its own simple eligibility checklist on our Services page.",
  },
  {
    q: "What documents do I need?",
    a: "Generally: a valid CNIC, vehicle registration book, driving license and a smartphone. Specific requirements vary by vehicle type.",
  },
  {
    q: "Do I need to upload documents on the website?",
    a: "Not at this stage. After you submit the form, our team will guide you on what to share and how — usually via WhatsApp.",
  },
  {
    q: "How do bonuses work?",
    a: "Yango runs weekly performance bonuses based on completed rides, rating, and acceptance. Tiers and amounts may vary by city and campaign.",
  },
  {
    q: "Can I switch vehicle type later?",
    a: "Yes — contact our support team and we'll help you update your registration.",
  },
  {
    q: "What if my account gets blocked?",
    a: "Reach out to our support immediately on WhatsApp. We coordinate with Yango to resolve account issues quickly.",
  },
  {
    q: "Is your office a real physical location?",
    a: "Yes. You're welcome to visit us during business hours — meeting in person is one of the easiest ways to onboard.",
  },
];

function FAQPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-radial" />
        <div className="container-x pt-20 pb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Frequently Asked <span className="text-gradient-primary">Questions</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg text-muted-foreground">
            Quick answers about Yango registration, support, and earnings.
          </p>
        </div>
      </section>

      <section className="container-x pb-16">
        <div className="mx-auto max-w-3xl space-y-3">
          {FAQS.map((f, i) => (
            <Reveal key={i} delay={Math.min(i, 5) * 0.04}>
              <details className="group glass rounded-2xl p-5 open:border-gold transition-colors">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-left font-semibold list-none">
                  <span>{f.q}</span>
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-surface-elevated text-gold transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x pb-24">
        <SectionTitle
          title={
            <>
              Still have <span className="text-gradient-gold">questions?</span>
            </>
          }
        />
        <div className="mt-8 text-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-glow"
          >
            Contact Support <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
