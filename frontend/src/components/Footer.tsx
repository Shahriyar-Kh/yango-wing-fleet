import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import logo from "@/assets/ywf-logo.png";
import { BRAND, CITIES, WHATSAPP_URL } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border/60 bg-surface">
      <div className="container-x grid grid-cols-1 gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="Yango Wing Fleet" className="h-12 w-12 rounded-full" />
            <div>
              <div className="text-sm font-bold tracking-wider">YANGO</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-gradient-gold font-semibold">
                Wing Fleet
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            {BRAND.tagline}. Free, fast and trusted Yango rider onboarding across Pakistan.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Quick Links</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/services" className="hover:text-gold">
                Services
              </Link>
            </li>
            <li>
              <Link to="/registration" className="hover:text-gold">
                Register
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="hover:text-gold">
                How It Works
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-gold">
                About
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-gold">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-gold">
                Terms
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-gold">
                Privacy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Cities</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {CITIES.map((c) => (
              <li key={c.slug}>
                <Link to="/cities/$city" params={{ city: c.slug }} className="hover:text-gold">
                  Yango Registration {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {BRAND.phones.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold" />{" "}
                <a href={`tel:${p.replace(/-/g, "")}`} className="hover:text-foreground">
                  {p}
                </a>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-gold" />
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                WhatsApp Support
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gold" /> {BRAND.email}
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gold mt-0.5" /> {BRAND.address}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Yango Wing Fleet. All rights reserved.</p>
          <p>Independent Yango registration partner in Pakistan.</p>
        </div>
      </div>
    </footer>
  );
}
