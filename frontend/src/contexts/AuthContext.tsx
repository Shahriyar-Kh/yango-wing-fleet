/**
 * AuthContext — provides isAuthenticated, login, logout across the app.
 * Wrap your admin routes (or the entire app) with <AuthProvider>.
 */

import React, { createContext, useContext, useState, useCallback } from "react";
import { authApi, tokenStore } from "@/lib/api";
import type { LoginPayload } from "@/lib/api";

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<{ error: string | null }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialise from stored tokens so page refresh preserves session.
  const [isAuthenticated, setIsAuthenticated] = useState(() => authApi.isAuthenticated());

  const login = useCallback(async (payload: LoginPayload) => {
    const result = await authApi.login(payload);
    if (result.data) {
      setIsAuthenticated(true);
      return { error: null };
    }
    return { error: result.error ?? "Login failed" };
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
