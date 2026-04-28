import { Outlet, Link, createRootRoute } from "@tanstack/react-router";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { AuthProvider } from "@/contexts/AuthContext";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-105 transition-transform"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  // Admin routes get their own layout (no public header/footer)
  // Use useLocation hook for client-side navigation awareness
  const isAdminRoute = window.location.pathname.startsWith("/admin");

  return (
    <AuthProvider>
      {isAdminRoute ? (
        <Outlet />
      ) : (
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
          <WhatsAppFloat />
        </div>
      )}
    </AuthProvider>
  );
}
