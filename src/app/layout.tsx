import type { Metadata } from "next";
import "@/index.css";
import { Suspense } from "react";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Winston van der Bok — Beeldbeheer",
  description:
    "Image asset manager for the printed book about Winston van der Bok (1947–2021), Kalihna indigenous artist from Suriname.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body>
        <Providers>
          <Suspense>{children}</Suspense>
        </Providers>
      </body>
    </html>
  );
}
