import { Container } from "@/components/Container";
import { ApplyClient } from "./ApplyClient";

export const metadata = {
  title: "Apply for support — SupportNaija",
  description:
    "Verified Nigerians can apply for support. BVN-first verification, optional NIN, and proof of need.",
};

export default function ApplyPage() {
  return (
    <main className="py-10">
      <Container>
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wide text-black/55">
            Apply for support
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Tell us how we can help.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-black/70">
            Quick application — typically 3–5 minutes. We&apos;ll BVN-verify
            your identity (and optionally NIN) before reviewing. Auto airtime
            (₦1,000) is available for BVN-verified recipients when funded.
          </p>
        </div>

        <div className="mt-8">
          <ApplyClient />
        </div>
      </Container>
    </main>
  );
}
