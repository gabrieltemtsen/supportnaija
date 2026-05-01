import { Container } from "@/components/Container";

export default function Loading() {
  return (
    <main className="py-10">
      <Container>
        <div className="grid gap-4">
          <div className="h-7 w-40 animate-pulse rounded-md bg-black/[0.06]" />
          <div className="h-10 w-3/4 animate-pulse rounded-md bg-black/[0.06]" />
          <div className="h-4 w-1/2 animate-pulse rounded-md bg-black/[0.05]" />
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl bg-black/[0.04]"
              />
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
