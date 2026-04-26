import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Yango Wing Fleet" },
      { name: "description", content: "How Yango Wing Fleet collects, uses and protects your information." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <section className="container-x py-20 max-w-3xl">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Privacy <span className="text-gradient-primary">Policy</span></h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="mt-10 space-y-6 text-muted-foreground leading-relaxed">
        <p>Your privacy matters. This policy explains what information we collect and how we use it.</p>
        <div>
          <h2 className="text-xl font-bold text-foreground">Information We Collect</h2>
          <p className="mt-2">Name, CNIC, phone, city, and vehicle details — only what's needed to facilitate Yango registration.</p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">How We Use It</h2>
          <p className="mt-2">To verify eligibility, contact you for onboarding, and forward required details to Yango for account activation.</p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">What We Don't Do</h2>
          <p className="mt-2">We never sell your information. We never share data with third parties unrelated to your Yango onboarding.</p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Data Security</h2>
          <p className="mt-2">We use industry-standard practices to protect your information against unauthorized access.</p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Your Rights</h2>
          <p className="mt-2">You may request deletion of your data at any time by emailing support@yangowingfleet.pk.</p>
        </div>
      </div>
    </section>
  );
}
