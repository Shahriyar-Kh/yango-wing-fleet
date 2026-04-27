/**
 * authApi — login and token lifecycle helpers.
 */

import { publicPost } from "./client";
import { ENDPOINTS } from "./config";
import { tokenStore } from "./tokenStore";
import type { TokenPair, LoginPayload } from "./types";

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
};
