import type { Metadata } from "next";
import "@/index.css";
import { Suspense } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Winston van der Bok — Beeldbeheer",
  description:
    "Image asset manager for the printed book about Winston van der Bok (1947–2021), Kalihna indigenous artist from Suriname.",
  icons: { icon: "/favicon.svg" },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  return (
    <html lang="nl">
      <body>
        <ClerkProvider>
          {userId ? (
            <Providers>
              <Suspense>{children}</Suspense>
            </Providers>
          ) : (
            <Suspense>{children}</Suspense>
          )}
        </ClerkProvider>
      </body>
    </html>
  );
}
