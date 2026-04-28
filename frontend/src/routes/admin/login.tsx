/**
 * routes/admin/login.tsx — JWT login page for the private admin dashboard.
 */

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/ywf-logo.png";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Admin Login | Yango Wing Fleet" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLoginPage,
});

interface LoginForm {
  username: string;
  password: string;
}

function AdminLoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginForm>();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/admin/dashboard", replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) return null;

  const onSubmit = async (data: LoginForm) => {
    setLoginError(null);
    const result = await login({ username: data.username, password: data.password });
    if (result.error) {
      setLoginError(result.error);
    } else {
      navigate({ to: "/admin/dashboard", replace: true });
    }
  };

  const inputCls =
    "w-full rounded-xl bg-surface-elevated border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="YWF" className="h-14 w-14 rounded-full mb-3" />
          <h1 className="text-xl font-bold tracking-wide">Yango Wing Fleet</h1>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gold font-semibold">
            Admin Dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-strong rounded-3xl p-7 space-y-5">
          {loginError && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">Username</label>
            <input
              {...register("username", { required: true })}
              className={inputCls}
              placeholder="admin"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center justify-between text-sm font-semibold">
              <span>Password</span>
              <Link
                to="/admin/forgot-password"
                className="text-xs text-gold hover:underline font-semibold"
              >
                Forgot password?
              </Link>
            </label>
            <div className="relative">
              <input
                {...register("password", { required: true })}
                type={showPw ? "text" : "password"}
                className={`${inputCls} pr-11`}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" /> Sign In
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          This area is restricted to authorised staff only.
        </p>
      </div>
    </div>
  );
}
