/**
 * routes/admin/forgot-password.tsx — Password reset request page
 * 
 * User enters their email to receive a password reset link.
 * Provides a smooth UX with validation, loading states, and error handling.
 */

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Lock, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { authApi } from "@/lib/api";
import logo from "@/assets/ywf-logo.png";

export const Route = createFileRoute("/admin/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password | Yango Wing Fleet Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ForgotPasswordPage,
});

interface ForgotPasswordForm {
  email: string;
}

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
  } = useForm<ForgotPasswordForm>({
    mode: "onChange",
  });

  const email = watch("email");

  const onSubmit = async (data: ForgotPasswordForm) => {
    setGeneralError(null);
    try {
      const res = await authApi.requestPasswordReset({ email: data.email });
      // Handle API response shape: { data, error, errors }
      if (res.data) {
        setSubmittedEmail(data.email);
        setIsSubmitted(true);
        return;
      }

      // Prefer field-level errors if present
      if (res.errors && (res.errors as any).email) {
        const emailErr = (res.errors as any).email;
        setGeneralError(Array.isArray(emailErr) ? emailErr.join(" ") : String(emailErr));
        return;
      }

      setGeneralError(res.error ?? "Email not registered. Please check and try again.");
    } catch (error: any) {
      setGeneralError(error?.message || "Failed to request password reset. Please try again.");
    }
  };

  const inputCls =
    "w-full rounded-xl bg-surface-elevated border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all";

  const buttonCls =
    "w-full rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

  // Success state - show confirmation message
  if (isSubmitted) {
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

          {/* Confirmation Message */}
          <div className="glass-strong rounded-3xl p-8 space-y-6 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-500/20 p-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
              <p className="text-sm text-muted-foreground">
                We've sent a password reset link to{" "}
                <span className="font-semibold text-foreground">{submittedEmail}</span>
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-left">
              <p className="text-sm text-foreground">
                <strong>What's next?</strong>
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1 ml-4">
                <li>• Check your email (may take 1-2 minutes)</li>
                <li>• Click the reset link in the email</li>
                <li>• Create a new password</li>
                <li>• Log in with your new password</li>
              </ul>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
              <p className="text-xs text-amber-900 dark:text-amber-200">
                ⏱️ <strong>Reset link expires in 1 hour</strong> – You'll need to request a new one if it expires.
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <button
                onClick={() => navigate({ to: "/admin/login" })}
                className={buttonCls}
              >
                Back to Login
              </button>
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full rounded-xl border border-gold text-gold font-semibold py-3 px-4 hover:bg-gold/10 transition-all"
              >
                Try Another Email
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Didn't receive the email?{" "}
              <a href="tel:+923231213999" className="text-gold hover:underline font-semibold">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Form state - show email input
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
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Lock className="h-5 w-5 text-gold" />
              <h2 className="text-lg font-bold">Reset Your Password</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Error Alert */}
          {generalError && (
            <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
              <div className="text-sm text-destructive">{generalError}</div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold mb-2">Email Address</label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
              type="email"
              className={`${inputCls} ${errors.email ? "border-destructive" : ""}`}
              placeholder="admin@example.com"
              autoComplete="email"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Security Info */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
            <p className="text-xs text-blue-900 dark:text-blue-200">
              🔒 <strong>For security:</strong> We only send reset links to registered email addresses.
            </p>
          </div>

          {/* Submit Button */}
          <button type="submit" className={buttonCls} disabled={isSubmitting || !email}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Send Reset Link
              </>
            )}
          </button>

          {/* Footer Links */}
          <div className="flex items-center justify-between text-sm">
            <Link
              to="/admin/login"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
            <a
              href="tel:+923231213999"
              className="text-gold hover:underline font-semibold"
            >
              Need help?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
