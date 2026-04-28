/**
 * authApi — login, token lifecycle, and password reset helpers.
 */

import { publicPost, publicGet } from "./client";
import { ENDPOINTS } from "./config";
import { tokenStore } from "./tokenStore";
import type {
  TokenPair,
  LoginPayload,
  PasswordResetRequestPayload,
  PasswordResetRequestResponse,
  PasswordResetVerifyResponse,
  PasswordResetConfirmPayload,
  PasswordResetConfirmResponse,
} from "./types";

export const authApi = {
  login: async (payload: LoginPayload) => {
    const result = await publicPost<TokenPair>(ENDPOINTS.tokenObtain, payload);
    if (result.data) {
      tokenStore.setAccess(result.data.access);
      tokenStore.setRefresh(result.data.refresh);
    }
    return result;
  },

  logout: () => {
    tokenStore.clear();
  },

  isAuthenticated: (): boolean => {
    return !!(tokenStore.getAccess() || tokenStore.getRefresh());
  },

  // ─── Password Reset ───────────────────────────────────────────────────────

  /**
   * Request password reset by email.
   * Sends reset link to registered email.
   */
  requestPasswordReset: async (payload: PasswordResetRequestPayload) => {
    return publicPost<PasswordResetRequestResponse>(
      ENDPOINTS.passwordResetRequest,
      payload
    );
  },

  /**
   * Verify that a password reset token is valid.
   * Returns user email and token details if valid.
   */
  verifyResetToken: async (token: string) => {
    return publicGet<PasswordResetVerifyResponse>(
      `${ENDPOINTS.passwordResetVerify}?token=${encodeURIComponent(token)}`
    );
  },

  /**
   * Confirm password reset with new password.
   * Token must be valid (not expired, not used).
   */
  confirmPasswordReset: async (payload: PasswordResetConfirmPayload) => {
    return publicPost<PasswordResetConfirmResponse>(
      ENDPOINTS.passwordResetConfirm,
      payload
    );
  },
};
