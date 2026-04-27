/**
 * publicApi — all unauthenticated API calls used by the public site.
 */

import { publicGet, publicPost } from "./client";
import { ENDPOINTS } from "./config";
import type {
  DynamicSections,
  RegistrationSubmitPayload,
  RegistrationSubmitResponse,
  InquirySubmitPayload,
  InquirySubmitResponse,
} from "./types";

export const publicApi = {
  /** Fetch all dynamic public sections in one request. */
  getDynamicSections: () => publicGet<DynamicSections>(ENDPOINTS.dynamicSections),

  /** Submit a driver registration form. */
  submitRegistration: (payload: RegistrationSubmitPayload) =>
    publicPost<RegistrationSubmitResponse>(ENDPOINTS.registrations, {
      ...payload,
      website: "", // honeypot — always empty
    }),

  /** Submit a contact or support inquiry. */
  submitInquiry: (payload: InquirySubmitPayload) =>
    publicPost<InquirySubmitResponse>(ENDPOINTS.inquiries, {
      ...payload,
      website: "", // honeypot — always empty
    }),
};
