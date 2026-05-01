import { Container } from "@/components/Container";
import { DonateClient } from "./DonateClient";

export const metadata = {
  title: "Donate — SupportNaija",
  description:
    "Donate from ₦500. Choose a pool, give publicly or anonymously, and support verified Nigerians.",
};

export default function DonatePage() {
  return (
    <main className="py-10">
      <Container>
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wide text-black/55">
            Donate
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Give in minutes. From ₦500.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-black/70">
            Pick a pool, enter an amount, and choose whether to appear publicly
            or get an anonymous ID. We hand off securely to Paystack on the next
            step.
          </p>
        </div>

        <div className="mt-8">
          <DonateClient />
        </div>
      </Container>
    </main>
  );
}
