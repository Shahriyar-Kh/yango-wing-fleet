/**
 * routes/admin/index.tsx — handles /admin route
 * Redirects to /admin/login if not authenticated, or /admin/dashboard if authenticated
 */

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Admin Dashboard | Yango Wing Fleet" }],
  }),
  component: AdminIndexPage,
});

function AdminIndexPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on authentication status
    if (isAuthenticated) {
      navigate({ to: "/admin/dashboard", replace: true });
    } else {
      navigate({ to: "/admin/login", replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Render nothing while redirecting
  return null;
}
