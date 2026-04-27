/**
 * useRegistration — submits driver registration to the backend API.
 */

import { useState } from "react";
import { publicApi } from "@/lib/api";
import type { RegistrationSubmitPayload } from "@/lib/api";

export type RegistrationState = "idle" | "loading" | "success" | "error";

export interface UseRegistrationReturn {
  state: RegistrationState;
  submittedId: number | null;
  error: string | null;
  fieldErrors: Record<string, string[]>;
  submit: (payload: RegistrationSubmitPayload) => Promise<boolean>;
  reset: () => void;
}

export function useRegistration(): UseRegistrationReturn {
  const [state, setState] = useState<RegistrationState>("idle");
  const [submittedId, setSubmittedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const submit = async (payload: RegistrationSubmitPayload): Promise<boolean> => {
    setState("loading");
    setError(null);
    setFieldErrors({});

    const result = await publicApi.submitRegistration(payload);

    if (result.data) {
      setSubmittedId(result.data.id);
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
    setSubmittedId(null);
    setError(null);
    setFieldErrors({});
  };

  return { state, submittedId, error, fieldErrors, submit, reset };
}
