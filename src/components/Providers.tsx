"use client";

import { useEffect, useState, Suspense, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Theme } from "@radix-ui/themes";
import { Provider as JotaiProvider } from "jotai";
import { Layout } from "@/components/Layout";
import { Sidebar } from "@/components/Sidebar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useServerHydration } from "@/hooks/useServerHydration";

const AUTH_ROUTES = ["/login", "/signup"];

function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/user");
        if (res.status === 401) {
          if (!AUTH_ROUTES.includes(pathname)) {
            router.replace("/login");
          }
        } else if (AUTH_ROUTES.includes(pathname)) {
          router.replace("/");
        }
      } catch {
        if (!AUTH_ROUTES.includes(pathname)) {
          router.replace("/login");
        }
      } finally {
        setChecking(false);
      }
    }
    checkAuth();
  }, [pathname, router]);

  if (checking) {
    return null;
  }

  return <>{children}</>;
}

function AuthenticatedProviders({ children }: { children: ReactNode }) {
  useServerHydration();
  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
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
          <AuthGuard>
            <Layout sidebar={<Suspense><Sidebar /></Suspense>}>
              <AuthenticatedProviders>{children}</AuthenticatedProviders>
            </Layout>
          </AuthGuard>
        </Theme>
      </JotaiProvider>
    </ErrorBoundary>
  );
}
