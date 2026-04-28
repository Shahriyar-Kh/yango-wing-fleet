/**
 * routes/admin/reset-password.$token.tsx — Password reset form page
 * 
 * User enters and confirms their new password.
 * Token is verified before allowing password change.
 */

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { authApi } from "@/lib/api";
import logo from "@/assets/ywf-logo.png";

export const Route = createFileRoute("/admin/reset-password/$token")({
  head: () => ({
    meta: [
      { title: "Reset Password | Yango Wing Fleet Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

interface ResetPasswordForm {
  new_password: string;
  new_password_confirm: string;
}

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token } = Route.useParams();

  const [tokenStatus, setTokenStatus] = useState<"verifying" | "valid" | "invalid">("verifying");
  const [tokenEmail, setTokenEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordForm>();

  const password = watch("new_password");
  const passwordConfirm = watch("new_password_confirm");

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const result = await authApi.verifyResetToken(token);
        if (result.data) {
          setTokenStatus("valid");
          setTokenEmail(result.data.email);
        } else {
          setTokenStatus("invalid");
          setGeneralError(result.error || "Invalid or expired reset link");
        }
      } catch (error: any) {
        setTokenStatus("invalid");
        setGeneralError(error?.message || "Failed to verify reset link");
      }
    };

    verifyToken();
  }, [token]);

  const onSubmit = async (data: ResetPasswordForm) => {
    setGeneralError(null);
    setIsResetting(true);

    try {
      await authApi.confirmPasswordReset({
        token,
        new_password: data.new_password,
        new_password_confirm: data.new_password_confirm,
      });

      // Redirect to success page
      navigate({ to: "/admin/reset-password-success", replace: true });
    } catch (error: any) {
      setGeneralError(error?.message || "Failed to reset password. Please try again.");
      setIsResetting(false);
    }
  };

  const inputCls =
    "w-full rounded-xl bg-surface-elevated border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all";

  const buttonCls =
    "w-full rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

  // Verifying state
  if (tokenStatus === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm text-center">
          <div className="flex justify-center mb-6">
            <div className="animate-spin">
              <Loader2 className="h-8 w-8 text-gold" />
            </div>
          </div>
          <p className="text-muted-foreground">Verifying your reset link...</p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (tokenStatus === "invalid") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <img src={logo} alt="YWF" className="h-14 w-14 rounded-full mb-3" />
            <h1 className="text-xl font-bold tracking-wide">Yango Wing Fleet</h1>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gold font-semibold">
              Admin Dashboard
            </p>
          </div>

          <div className="glass-strong rounded-3xl p-8 space-y-6 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-red-500/20 p-4">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Invalid or Expired Link</h2>
              <p className="text-sm text-muted-foreground">
                {generalError || "This password reset link is no longer valid or has expired."}
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <p className="text-sm text-foreground">
                <strong>What to do:</strong>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Request a new password reset link. It will be valid for 1 hour.
              </p>
            </div>

            <button
              onClick={() => navigate({ to: "/admin/forgot-password" })}
              className={buttonCls}
            >
              Request New Link
            </button>

            <button
              onClick={() => navigate({ to: "/admin/login" })}
              className="w-full rounded-xl border border-gold text-gold font-semibold py-3 px-4 hover:bg-gold/10 transition-all"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Valid token - show reset form
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
            <h2 className="text-lg font-bold mb-2">Create New Password</h2>
            <p className="text-sm text-muted-foreground">
              {tokenEmail && <span>Resetting password for <strong>{tokenEmail}</strong></span>}
            </p>
          </div>

          {/* Error Alert */}
          {generalError && (
            <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
              <div className="text-sm text-destructive">{generalError}</div>
            </div>
          )}

          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold mb-2">New Password</label>
            <div className="relative">
              <input
                {...register("new_password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                type={showPassword ? "text" : "password"}
                className={`${inputCls} pr-11 ${errors.new_password ? "border-destructive" : ""}`}
                placeholder="••••••••"
                disabled={isResetting}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                disabled={isResetting}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.new_password && (
              <p className="text-xs text-destructive mt-1">{errors.new_password.message}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              • At least 8 characters<br />
              • Mix of uppercase, lowercase, numbers
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold mb-2">Confirm Password</label>
            <div className="relative">
              <input
                {...register("new_password_confirm", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                type={showConfirm ? "text" : "password"}
                className={`${inputCls} pr-11 ${errors.new_password_confirm ? "border-destructive" : ""}`}
                placeholder="••••••••"
                disabled={isResetting}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                disabled={isResetting}
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.new_password_confirm && (
              <p className="text-xs text-destructive mt-1">
                {errors.new_password_confirm.message}
              </p>
            )}
          </div>

          {/* Security Info */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
            <p className="text-xs text-blue-900 dark:text-blue-200">
              🔒 Your password is secure. We never store it in plain text.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={buttonCls}
            disabled={isResetting || !password || !passwordConfirm}
          >
            {isResetting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Reset Password
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
