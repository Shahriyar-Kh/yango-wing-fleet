/**
 * routes/registration.tsx — wired to POST /api/public/registrations/
 */

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2, Sparkles, AlertCircle, User, Car } from "lucide-react";
import { CITIES } from "@/lib/brand";
import { Reveal } from "@/components/ui-kit";
import { useRegistration } from "@/hooks/useRegistration";
import type { RegistrationSubmitPayload } from "@/lib/api";

export const Route = createFileRoute("/registration")({
  head: () => ({
    meta: [
      { title: "Free Yango Driver Registration Form | Yango Wing Fleet" },
      {
        name: "description",
        content:
          "Register as a Yango driver in Pakistan for free. Fill the form and our team will contact you within 24 hours.",
      },
      { property: "og:title", content: "Free Yango Driver Registration" },
      {
        property: "og:description",
        content: "Quick online registration form. Bike, car, rickshaw — all free.",
      },
    ],
  }),
  staleTime: 300_000,
  component: RegistrationPage,
});

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const schema = z
  .object({
    // Rider details
    fullName: z.string().trim().min(2, "Please enter your full name").max(80),
    cnic: z
      .string()
      .trim()
      .regex(/^\d{5}-?\d{7}-?\d{1}$/, "Enter a valid CNIC (e.g. 35202-1234567-1)"),
    cnicIssueDate: z.string().min(1, "Select your CNIC issue date"),
    cnicExpiryDate: z.string().min(1, "Select your CNIC expiry date"),
    phone: z
      .string()
      .trim()
      .regex(/^03\d{2}-?\d{7}$/, "Enter a valid Pakistani number (e.g. 0300-1234567)"),
    email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
    city: z.string().min(1, "Select a city"),

    // Vehicle details (shared)
    vehicleType: z.enum(["bike", "car", "rickshaw"]),
    vehicleNumberPlate: z.string().trim().min(2, "Enter the vehicle number plate").max(20),
    vehicleMake: z.string().trim().min(2, "Enter the vehicle make (e.g. Honda)").max(80),
    vehicleModel: z.string().trim().max(80).optional(), // car & rickshaw optional; required for car below
    vehicleYear: z
      .string()
      .trim()
      .regex(/^\d{4}$/, "Enter a 4-digit year"),
    vehicleColor: z.string().trim().min(2, "Enter the vehicle color").max(40),

    notes: z.string().trim().max(500).optional(),
  })
  .superRefine((data, ctx) => {
    // vehicle model is required only for cars
    if (data.vehicleType === "car" && (!data.vehicleModel || data.vehicleModel.trim().length < 2)) {
      ctx.addIssue({
        path: ["vehicleModel"],
        code: z.ZodIssueCode.custom,
        message: "Enter the vehicle model (e.g. Civic)",
      });
    }
  });

type FormData = z.infer<typeof schema>;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function RegistrationPage() {
  const navigate = useNavigate();
  const { state, error, fieldErrors, submit } = useRegistration();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { vehicleType: "bike" },
  });

  const vehicleType = watch("vehicleType");
  const isBike = vehicleType === "bike";
  const isCar = vehicleType === "car";
  const isRickshaw = vehicleType === "rickshaw";

  const onSubmit = async (raw: FormData) => {
    const d = raw;

    const payload: RegistrationSubmitPayload = {
      full_name: d.fullName,
      cnic: d.cnic,
      cnic_issue_date: d.cnicIssueDate,
      cnic_expiry_date: d.cnicExpiryDate,
      phone: d.phone,
      email: d.email || undefined,
      city: d.city,
      vehicle_type: d.vehicleType,
      vehicle_number_plate: d.vehicleNumberPlate,
      vehicle_make: d.vehicleMake,
      vehicle_model: d.vehicleModel || undefined,
      vehicle_year: parseInt(d.vehicleYear, 10),
      vehicle_color: d.vehicleColor,
      notes: d.notes || undefined,
    };

    const ok = await submit(payload);
    if (ok) navigate({ to: "/thank-you" });
  };

  // ---------------------------------------------------------------------------
  // Styles
  // ---------------------------------------------------------------------------

  const inputCls =
    "w-full rounded-xl bg-surface-elevated border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all";
  const labelCls = "block text-sm font-semibold mb-2";
  const errCls = "mt-1.5 text-xs text-destructive";
  const isLoading = state === "loading" || isSubmitting;

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  /** Render a backend field-level error alongside the client-side one. */
  const FieldError = ({
    clientError,
    backendKey,
  }: {
    clientError?: string;
    backendKey?: string;
  }) => (
    <>
      {clientError && <p className={errCls}>{clientError}</p>}
      {backendKey && fieldErrors[backendKey]?.[0] && (
        <p className={errCls}>{fieldErrors[backendKey][0]}</p>
      )}
    </>
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-radial" />
        <div className="container-x pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            <Sparkles className="h-3.5 w-3.5" /> 100% Free • No hidden fees
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">
            Driver <span className="text-gradient-primary">Registration</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg text-muted-foreground">
            Fill the form below. Our team will review and contact you within 24 hours.
          </p>
        </div>
      </section>

      {/* ── Form ── */}
      <section className="container-x pb-24">
        <Reveal>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto max-w-3xl glass-strong rounded-3xl p-6 md:p-10 space-y-8"
          >
            {/* Global API error */}
            {state === "error" && error && (
              <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-destructive">Submission failed</p>
                  <p className="mt-0.5 text-muted-foreground">{error}</p>
                </div>
              </div>
            )}

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                SECTION 1 — Rider Details
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <User className="h-4 w-4 text-gold" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-gold">
                  Rider Details
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {/* Full Name */}
                <div>
                  <label className={labelCls}>Full Name</label>
                  <input
                    {...register("fullName")}
                    className={inputCls}
                    placeholder="Muhammad Ahmad"
                  />
                  <FieldError clientError={errors.fullName?.message} backendKey="full_name" />
                </div>

                {/* Phone */}
                <div>
                  <label className={labelCls}>Phone Number</label>
                  <input {...register("phone")} className={inputCls} placeholder="0300-1234567" />
                  <FieldError clientError={errors.phone?.message} backendKey="phone" />
                </div>

                {/* CNIC */}
                <div>
                  <label className={labelCls}>CNIC Number</label>
                  <input {...register("cnic")} className={inputCls} placeholder="35202-1234567-1" />
                  <FieldError clientError={errors.cnic?.message} backendKey="cnic" />
                </div>

                {/* City */}
                <div>
                  <label className={labelCls}>City</label>
                  <select {...register("city")} className={inputCls} defaultValue="">
                    <option value="" disabled>
                      Select your city
                    </option>
                    {CITIES.map((c) => (
                      <option key={c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <FieldError clientError={errors.city?.message} backendKey="city" />
                </div>

                {/* CNIC Issue Date */}
                <div>
                  <label className={labelCls}>CNIC Issue Date</label>
                  <input {...register("cnicIssueDate")} type="date" className={inputCls} />
                  <FieldError
                    clientError={errors.cnicIssueDate?.message}
                    backendKey="cnic_issue_date"
                  />
                </div>

                {/* CNIC Expiry Date */}
                <div>
                  <label className={labelCls}>CNIC Expiry Date</label>
                  <input {...register("cnicExpiryDate")} type="date" className={inputCls} />
                  <FieldError
                    clientError={errors.cnicExpiryDate?.message}
                    backendKey="cnic_expiry_date"
                  />
                </div>

                {/* Email (optional) */}
                <div className="md:col-span-2">
                  <label className={labelCls}>
                    Email <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className={inputCls}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className={errCls}>{errors.email.message}</p>}
                </div>
              </div>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                SECTION 2 — Vehicle Details
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Car className="h-4 w-4 text-gold" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-gold">
                  Vehicle Details
                </h2>
              </div>

              {/* Vehicle Type — always visible */}
              <div>
                <label className={labelCls}>Vehicle Type</label>
                <select {...register("vehicleType")} className={inputCls}>
                  <option value="bike">Bike</option>
                  <option value="car">Car</option>
                  <option value="rickshaw">Rickshaw</option>
                </select>
                <FieldError
                  clientError={errors.vehicleType ? "Select a vehicle type" : undefined}
                  backendKey="vehicle_type"
                />
              </div>

              {/* ── Shared fields ─────────────────────────────── */}
              <div className="grid gap-5 md:grid-cols-2">
                {/* Number Plate */}
                <div>
                  <label className={labelCls}>Number Plate</label>
                  <input
                    {...register("vehicleNumberPlate")}
                    className={inputCls}
                    placeholder={isCar ? "LHR-1234" : isBike ? "LHR-123" : "RWP-456"}
                  />
                  <FieldError
                    clientError={errors.vehicleNumberPlate?.message}
                    backendKey="vehicle_number_plate"
                  />
                </div>

                {/* Make */}
                <div>
                  <label className={labelCls}>Make</label>
                  <input
                    {...register("vehicleMake")}
                    className={inputCls}
                    placeholder={isCar ? "Toyota" : isBike ? "Honda" : "Ravi"}
                  />
                  <FieldError clientError={errors.vehicleMake?.message} backendKey="vehicle_make" />
                </div>

                {/* Model — car only */}
                {isCar && (
                  <div>
                    <label className={labelCls}>Model</label>
                    <input
                      {...register("vehicleModel")}
                      className={inputCls}
                      placeholder="Corolla"
                    />
                    <FieldError
                      clientError={errors.vehicleModel?.message}
                      backendKey="vehicle_model"
                    />
                  </div>
                )}

                {/* Year */}
                <div>
                  <label className={labelCls}>Year</label>
                  <input
                    {...register("vehicleYear")}
                    className={inputCls}
                    placeholder="2019"
                    maxLength={4}
                    inputMode="numeric"
                  />
                  <FieldError clientError={errors.vehicleYear?.message} backendKey="vehicle_year" />
                </div>

                {/* Color */}
                <div>
                  <label className={labelCls}>Color</label>
                  <input {...register("vehicleColor")} className={inputCls} placeholder="White" />
                  <FieldError
                    clientError={errors.vehicleColor?.message}
                    backendKey="vehicle_color"
                  />
                </div>
              </div>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                Additional Notes
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div>
              <label className={labelCls}>
                Additional Notes{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <textarea
                {...register("notes")}
                rows={4}
                className={inputCls}
                placeholder="Anything we should know..."
              />
            </div>

            {/* Consent notice */}
            <div className="rounded-xl bg-surface-elevated p-4 text-xs text-muted-foreground flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
              <span>
                By submitting, you agree to be contacted by our team. We never share your details
                with third parties. Document upload is not required at this stage.
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-4 text-base font-bold text-primary-foreground shadow-glow hover:scale-[1.01] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Submitting…
                </>
              ) : (
                "Submit Registration"
              )}
            </button>
          </form>
        </Reveal>
      </section>
    </>
  );
}
