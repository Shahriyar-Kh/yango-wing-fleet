/**
 * routes/admin/reset-password-success.tsx — Password reset success page
 * 
 * Shows confirmation that password was reset successfully.
 * Redirects to login after brief delay.
 */

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { CheckCircle, LogIn } from "lucide-react";
import logo from "@/assets/ywf-logo.png";

export const Route = createFileRoute("/admin/reset-password-success")({
  head: () => ({
    meta: [
      { title: "Password Reset Successfully | Yango Wing Fleet Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordSuccessPage,
});

function ResetPasswordSuccessPage() {
  const navigate = useNavigate();

  // Auto-redirect to login after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate({ to: "/admin/login", replace: true });
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const buttonCls =
    "w-full rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 transition-all flex items-center justify-center gap-2";

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

        {/* Success Card */}
        <div className="glass-strong rounded-3xl p-8 space-y-6 text-center">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-green-500/20 p-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          </div>

          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold mb-2">Password Reset Successfully!</h2>
            <p className="text-sm text-muted-foreground">
              Your password has been changed. You can now log in with your new password.
            </p>
          </div>

          {/* What Happens Next */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-left">
            <p className="text-sm font-semibold text-foreground mb-2">What's next?</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Your password has been updated</li>
              <li>✓ Old sessions are no longer valid</li>
              <li>✓ You'll need to log in with your new password</li>
              <li>✓ All your data is safe and secure</li>
            </ul>
          </div>

          {/* Security Note */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
            <p className="text-xs text-green-900 dark:text-green-200">
              🔒 Your account is now secure with your new password.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => navigate({ to: "/admin/login", replace: true })}
            className={buttonCls}
          >
            <LogIn className="h-4 w-4" />
            Go to Login
          </button>

          {/* Auto Redirect Notice */}
          <p className="text-xs text-muted-foreground">
            You'll be redirected to login in a few seconds...
          </p>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            Having trouble?{" "}
            <a href="tel:+923231213999" className="text-gold hover:underline font-semibold">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
