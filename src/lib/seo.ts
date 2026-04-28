import type { Metadata } from "next";

export function siteMetadata(overrides?: Partial<Metadata>): Metadata {
  const title = "SupportNaija — Transparent support for Nigerians";
  const description =
    "Donate to verified beneficiaries in Nigeria. Transparent pool balances, optional anonymous giving, and fast support when it matters.";

  return {
    metadataBase: new URL("https://supportnaija.com"),
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://supportnaija.com",
      siteName: "SupportNaija",
      locale: "en_NG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: "https://supportnaija.com",
    },
    ...overrides,
  };
}
