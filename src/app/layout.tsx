import type { Metadata } from "next";
import "@/index.css";
import "react-photo-view/dist/react-photo-view.css";
import { Suspense } from "react";
import { Fira_Code, Geist, Lora } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Providers } from "@/components/Providers";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontMono = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

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
      <body className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}>
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
