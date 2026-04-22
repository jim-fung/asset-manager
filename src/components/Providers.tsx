"use client";

import { Suspense, type ReactNode } from "react";
import { Theme } from "@radix-ui/themes";
import { Provider as JotaiProvider } from "jotai";
import { Layout } from "@/components/Layout";
import { Sidebar } from "@/components/Sidebar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useServerHydration } from "@/hooks/useServerHydration";

function AuthenticatedProviders({ children }: { children: ReactNode }) {
  useServerHydration();
  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  const isAuthPage = typeof window !== "undefined" && (
    window.location.pathname === "/login" || window.location.pathname === "/signup"
  );

  return (
    <ErrorBoundary>
      <JotaiProvider>
        <Theme
          appearance="light"
          accentColor="sky"
          grayColor="slate"
          radius="small"
          scaling="100%"
        >
          <Layout sidebar={<Suspense><Sidebar /></Suspense>}>
            {isAuthPage ? children : <AuthenticatedProviders>{children}</AuthenticatedProviders>}
          </Layout>
        </Theme>
      </JotaiProvider>
    </ErrorBoundary>
  );
}
