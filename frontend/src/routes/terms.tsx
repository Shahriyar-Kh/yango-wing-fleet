import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | Yango Wing Fleet" },
      {
        name: "description",
        content: "Terms of service for Yango Wing Fleet driver registration services in Pakistan.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <section className="container-x py-20 max-w-3xl">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
        Terms of <span className="text-gradient-primary">Service</span>
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleDateString()}
      </p>
      <div className="mt-10 space-y-6 text-muted-foreground leading-relaxed">
        <p>
          Welcome to Yango Wing Fleet. By using our website and services, you agree to the following
          terms. Please read them carefully.
        </p>
        <div>
          <h2 className="text-xl font-bold text-foreground">1. Free Registration Service</h2>
          <p className="mt-2">
            We facilitate Yango driver onboarding at no cost. We do not charge fees for any part of
            registration, verification or activation.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">2. Independent Partner</h2>
          <p className="mt-2">
            Yango Wing Fleet is an independent registration partner of Yango. We are not Yango
            itself; final activation, suspension and earnings policies are governed by Yango.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">3. Accurate Information</h2>
          <p className="mt-2">
            You agree to provide truthful and accurate information during registration. False or
            misleading details may result in account rejection.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">4. Driver Responsibilities</h2>
          <p className="mt-2">
            Once active, you agree to follow Yango's driver code of conduct, local traffic laws and
            tax obligations of Pakistan.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">5. Limitation of Liability</h2>
          <p className="mt-2">
            Yango Wing Fleet is not liable for earnings outcomes, app outages, account suspensions
            or any disputes between drivers and Yango or passengers.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">6. Changes</h2>
          <p className="mt-2">
            We may update these terms at any time. Continued use of our services constitutes
            acceptance of the updated terms.
          </p>
        </div>
        <p className="text-sm">Questions? Reach us at support@yangowingfleet.pk.</p>
      </div>
    </section>
  );
}
