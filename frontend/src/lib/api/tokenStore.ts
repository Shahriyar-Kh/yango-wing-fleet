/**
 * Token storage — keeps JWT tokens in memory (primary) with localStorage fallback.
 * Access token is memory-only (ephemeral); refresh token survives page reload.
 */

const REFRESH_KEY = "ywf_refresh";

let _accessToken: string | null = null;

export const tokenStore = {
  getAccess: () => _accessToken,
  setAccess: (t: string | null) => {
    _accessToken = t;
  },

  getRefresh: (): string | null => {
    try {
      return localStorage.getItem(REFRESH_KEY);
    } catch {
      return null;
    }
  },
  setRefresh: (t: string | null) => {
    try {
      if (t) localStorage.setItem(REFRESH_KEY, t);
      else localStorage.removeItem(REFRESH_KEY);
    } catch {
      /* no-op */
    }
  },

  clear: () => {
    _accessToken = null;
    try {
      localStorage.removeItem(REFRESH_KEY);
    } catch {
      /* no-op */
    }
  },
};
