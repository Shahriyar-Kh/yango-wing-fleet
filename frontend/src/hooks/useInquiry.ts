/**
 * useInquiry — submits contact and support inquiries to the backend.
 */

import { useState } from "react";
import { publicApi } from "@/lib/api";
import type { InquirySubmitPayload, InquiryType } from "@/lib/api";

export type InquiryState = "idle" | "loading" | "success" | "error";

export interface UseInquiryReturn {
  state: InquiryState;
  error: string | null;
  fieldErrors: Record<string, string[]>;
  submit: (payload: InquirySubmitPayload) => Promise<boolean>;
  reset: () => void;
}

export function useInquiry(defaultType: InquiryType = "contact"): UseInquiryReturn {
  const [state, setState] = useState<InquiryState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const submit = async (payload: InquirySubmitPayload): Promise<boolean> => {
    setState("loading");
    setError(null);
    setFieldErrors({});

    const result = await publicApi.submitInquiry({
      inquiry_type: defaultType,
      ...payload,
    });

    if (result.data) {
      setState("success");
      return true;
    }

    setState("error");
    setError(result.error ?? "Submission failed. Please try again.");
    if (result.errors) setFieldErrors(result.errors);
    return false;
  };

  const reset = () => {
    setState("idle");
    setError(null);
    setFieldErrors({});
  };

  return { state, error, fieldErrors, submit, reset };
}
