import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { CITIES } from "@/lib/brand";
import { Reveal } from "@/components/ui-kit";

export const Route = createFileRoute("/registration")({
  head: () => ({
    meta: [
      { title: "Free Yango Driver Registration Form | Yango Wing Fleet" },
      { name: "description", content: "Register as a Yango driver in Pakistan for free. Fill the form and our team will contact you within 24 hours." },
      { property: "og:title", content: "Free Yango Driver Registration" },
      { property: "og:description", content: "Quick online registration form. Bike, car, rickshaw — all free." },
    ],
  }),
  component: RegistrationPage,
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(80),
  cnic: z.string().trim().regex(/^\d{5}-?\d{7}-?\d{1}$/, "Enter a valid CNIC (e.g. 35202-1234567-1)"),
  phone: z.string().trim().regex(/^03\d{2}-?\d{7}$/, "Enter a valid Pakistani number (e.g. 0300-1234567)"),
  city: z.string().min(1, "Select a city"),
  vehicleType: z.enum(["bike", "car", "rickshaw"]),
  vehicleMakeModel: z.string().trim().min(2, "Enter vehicle make/model").max(80),
  vehicleYear: z.string().trim().regex(/^\d{4}$/, "Enter a 4-digit year"),
  notes: z.string().trim().max(500).optional(),
});
type FormData = z.infer<typeof schema>;

function RegistrationPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (raw: FormData) => {
    const parsed = schema.safeParse(raw);
    if (!parsed.success) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    navigate({ to: "/thank-you" });
  };

  const inputCls = "w-full rounded-xl bg-surface-elevated border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all";
  const labelCls = "block text-sm font-semibold mb-2";
  const errCls = "mt-1.5 text-xs text-destructive";

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-radial" />
        <div className="container-x pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            <Sparkles className="h-3.5 w-3.5" /> 100% Free • No hidden fees
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">Driver <span className="text-gradient-primary">Registration</span></h1>
          <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg text-muted-foreground">Fill the form below. Our team will review and contact you within 24 hours.</p>
        </div>
      </section>

      <section className="container-x pb-24">
        <Reveal>
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl glass-strong rounded-3xl p-6 md:p-10 space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelCls}>Full Name</label>
                <input {...register("fullName")} className={inputCls} placeholder="Muhammad Ahmad" />
                {errors.fullName && <p className={errCls}>{errors.fullName.message}</p>}
              </div>
              <div>
                <label className={labelCls}>CNIC</label>
                <input {...register("cnic")} className={inputCls} placeholder="35202-1234567-1" />
                {errors.cnic && <p className={errCls}>{errors.cnic.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Phone Number</label>
                <input {...register("phone")} className={inputCls} placeholder="0300-1234567" />
                {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
              </div>
              <div>
                <label className={labelCls}>City</label>
                <select {...register("city")} className={inputCls} defaultValue="">
                  <option value="" disabled>Select your city</option>
                  {CITIES.map((c) => <option key={c.slug} value={c.name}>{c.name}</option>)}
                </select>
                {errors.city && <p className={errCls}>{errors.city.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Vehicle Type</label>
                <select {...register("vehicleType")} className={inputCls} defaultValue="">
                  <option value="" disabled>Select vehicle type</option>
                  <option value="bike">Bike</option>
                  <option value="car">Car</option>
                  <option value="rickshaw">Rickshaw</option>
                </select>
                {errors.vehicleType && <p className={errCls}>Select a vehicle type</p>}
              </div>
              <div>
                <label className={labelCls}>Vehicle Make / Model</label>
                <input {...register("vehicleMakeModel")} className={inputCls} placeholder="Honda Civic" />
                {errors.vehicleMakeModel && <p className={errCls}>{errors.vehicleMakeModel.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Vehicle Year</label>
                <input {...register("vehicleYear")} className={inputCls} placeholder="2019" />
                {errors.vehicleYear && <p className={errCls}>{errors.vehicleYear.message}</p>}
              </div>
            </div>
            <div>
              <label className={labelCls}>Additional notes (optional)</label>
              <textarea {...register("notes")} rows={4} className={inputCls} placeholder="Anything we should know..." />
            </div>

            <div className="rounded-xl bg-surface-elevated p-4 text-xs text-muted-foreground flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
              <span>By submitting, you agree to be contacted by our team. We never share your details. Document upload is not required at this stage.</span>
            </div>

            <button type="submit" disabled={submitting} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-4 text-base font-bold text-primary-foreground shadow-glow hover:scale-[1.01] transition-transform disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? (<><Loader2 className="h-5 w-5 animate-spin" /> Submitting...</>) : "Submit Registration"}
            </button>
          </form>
        </Reveal>
      </section>
    </>
  );
}
