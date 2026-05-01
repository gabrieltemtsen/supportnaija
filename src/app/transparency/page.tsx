import { Container } from "@/components/Container";
import { TransparencyClient } from "./TransparencyClient";

export const metadata = {
  title: "Transparency — SupportNaija",
  description:
    "Public pool balances, totals, and recent activity. No black boxes.",
};

export default function TransparencyPage() {
  return (
    <main className="py-10">
      <Container>
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wide text-black/55">
            Transparency
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Public balances. Public totals.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-black/70">
            Every donation, fee, and disbursement is recorded. Browse pool
            balances live below. A detailed ledger and exports are available
            under Transparency+.
          </p>
        </div>

        <div className="mt-8">
          <TransparencyClient />
        </div>
      </Container>
    </main>
  );
}
