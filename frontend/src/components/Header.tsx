import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import logo from "@/assets/ywf-logo.png";
import { WHATSAPP_URL } from "@/lib/brand";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about", label: "About" },
  { to: "/support", label: "Support" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-border/60">
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        <Link to="/" className="flex items-center gap-3" aria-label="Yango Wing Fleet home">
          <img src={logo} alt="Yango Wing Fleet logo" className="h-10 w-10 md:h-12 md:w-12 rounded-full" />
          <div className="hidden sm:block leading-tight">
            <div className="text-sm font-bold tracking-wider text-foreground">YANGO</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-gradient-gold font-semibold">Wing Fleet</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md"
              activeProps={{ className: "px-3 py-2 text-sm font-medium text-gold rounded-md" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.03] transition-transform"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <Link
            to="/registration"
            className="hidden md:inline-flex items-center rounded-full bg-gradient-gold px-4 py-2 text-sm font-bold text-gold-foreground shadow-gold-glow hover:scale-[1.03] transition-transform"
          >
            Register Free
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border/60 glass-strong">
          <nav className="container-x flex flex-col py-3">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-medium text-muted-foreground hover:text-foreground"
                activeProps={{ className: "py-3 text-base font-semibold text-gold" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/registration"
              onClick={() => setOpen(false)}
              className="mt-2 mb-3 inline-flex justify-center rounded-full bg-gradient-gold px-4 py-3 text-sm font-bold text-gold-foreground"
            >
              Register Free
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
