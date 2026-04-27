import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, MessageCircle, Home } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/brand";
import { motion } from "framer-motion";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "Thank You — Registration Received | Yango Wing Fleet" },
      {
        name: "description",
        content:
          "Your Yango driver registration has been received. Our team will contact you within 24 hours.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  return (
    <section className="container-x py-24 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="mx-auto inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-gold shadow-gold-glow"
        >
          <CheckCircle2 className="h-12 w-12 text-gold-foreground" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-4xl md:text-5xl font-bold tracking-tight"
        >
          Welcome to <span className="text-gradient-primary">Yango Wing Fleet</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-5 text-lg text-muted-foreground"
        >
          Your registration has been received. Our team will review your details and contact you
          within 24 hours to complete onboarding.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-glow"
          >
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
          </a>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full glass-strong px-6 py-3.5 text-sm font-semibold"
          >
            <Home className="h-4 w-4 text-gold" /> Back to Home
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
