import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Phone, Mail, MapPin, MessageCircle, Loader2, CheckCircle2, Facebook, Instagram } from "lucide-react";
import { BRAND, WHATSAPP_URL } from "@/lib/brand";
import { Reveal } from "@/components/ui-kit";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Yango Wing Fleet — Get in Touch | Pakistan" },
      { name: "description", content: "Contact Yango Wing Fleet for Yango driver registration help. Phone, WhatsApp, email and office address in Pakistan." },
      { property: "og:title", content: "Contact Yango Wing Fleet" },
      { property: "og:description", content: "Reach our team — phone, WhatsApp, email and office." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  phone: z.string().trim().min(10).max(20),
  message: z.string().trim().min(5).max(1000),
});
type FormData = z.infer<typeof schema>;

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (raw: FormData) => {
    if (!schema.safeParse(raw).success) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    setSent(true);
    reset();
  };

  const inputCls = "w-full rounded-xl bg-surface-elevated border border-border px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all";

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-radial" />
        <div className="container-x pt-20 pb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Get in <span className="text-gradient-primary">Touch</span></h1>
          <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg text-muted-foreground">Questions, feedback, or partnership inquiries — we'd love to hear from you.</p>
        </div>
      </section>

      <section className="container-x pb-24 grid gap-10 lg:grid-cols-[1fr_1.5fr]">
        <Reveal>
          <div className="space-y-4">
            {[
              { icon: Phone, t: "Phone", v: BRAND.phones.join(" / "), href: `tel:${BRAND.phones[0].replace(/-/g, "")}` },
              { icon: MessageCircle, t: "WhatsApp", v: "Chat with our team", href: WHATSAPP_URL, ext: true },
              { icon: Mail, t: "Email", v: BRAND.email, href: `mailto:${BRAND.email}` },
              { icon: MapPin, t: "Office", v: BRAND.address },
            ].map((c) => (
              <a key={c.t} href={c.href} target={c.ext ? "_blank" : undefined} rel={c.ext ? "noopener noreferrer" : undefined} className="group flex items-start gap-4 glass rounded-2xl p-5 hover:border-gold transition-colors">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-primary"><c.icon className="h-5 w-5 text-primary-foreground" /></div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gold">{c.t}</div>
                  <div className="mt-1 text-sm">{c.v}</div>
                </div>
              </a>
            ))}
            <div className="glass rounded-2xl p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-gold">Follow us</div>
              <div className="mt-3 flex gap-3">
                <a href="#" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-elevated hover:bg-gradient-primary transition-colors"><Facebook className="h-4 w-4" /></a>
                <a href="#" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-elevated hover:bg-gradient-primary transition-colors"><Instagram className="h-4 w-4" /></a>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={handleSubmit(onSubmit)} className="glass-strong rounded-3xl p-6 md:p-8 space-y-5">
            {sent && (
              <div className="flex items-start gap-3 rounded-xl bg-gradient-gold/20 border border-gold p-4 text-sm">
                <CheckCircle2 className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                <span>Message sent! We'll respond within 24 hours.</span>
              </div>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold mb-2">Name</label>
                <input {...register("name")} className={inputCls} placeholder="Your name" />
                {errors.name && <p className="mt-1.5 text-xs text-destructive">Please enter your name</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input {...register("email")} type="email" className={inputCls} placeholder="you@example.com" />
                {errors.email && <p className="mt-1.5 text-xs text-destructive">Enter a valid email</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Phone</label>
              <input {...register("phone")} className={inputCls} placeholder="0300-1234567" />
              {errors.phone && <p className="mt-1.5 text-xs text-destructive">Enter a valid phone</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Message</label>
              <textarea {...register("message")} rows={5} className={inputCls} placeholder="How can we help?" />
              {errors.message && <p className="mt-1.5 text-xs text-destructive">Message is required</p>}
            </div>
            <button type="submit" disabled={submitting} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-60">
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : "Send Message"}
            </button>
          </form>
        </Reveal>
      </section>
    </>
  );
}
