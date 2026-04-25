"use client";

import { Suspense, type ReactNode } from "react";
import { Provider as JotaiProvider } from "jotai";
import { Layout } from "@/components/Layout";
import { Sidebar } from "@/components/Sidebar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useServerHydration } from "@/hooks/useServerHydration";
import { GlobalImageContextMenu } from "@/components/GlobalImageContextMenu";

function AuthenticatedProviders({ children }: { children: ReactNode }) {
  useServerHydration();
  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <JotaiProvider>
        <Layout sidebar={<Suspense><Sidebar /></Suspense>}>
          <AuthenticatedProviders>{children}</AuthenticatedProviders>
        </Layout>
        <GlobalImageContextMenu />
      </JotaiProvider>
    </ErrorBoundary>
  );
}
