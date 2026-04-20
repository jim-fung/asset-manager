"use client";

import { Suspense, type ReactNode } from "react";
import { Theme } from "@radix-ui/themes";
import { Provider as JotaiProvider } from "jotai";
import { Layout } from "@/components/Layout";
import { Sidebar } from "@/components/Sidebar";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <JotaiProvider>
      <Theme
        appearance="light"
        accentColor="sky"
        grayColor="slate"
        radius="small"
        scaling="100%"
      >
        <Layout sidebar={<Suspense><Sidebar /></Suspense>}>{children}</Layout>
      </Theme>
    </JotaiProvider>
  );
}
