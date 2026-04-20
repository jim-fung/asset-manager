"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  createSurfaceSearchParams,
  readLooseRouteSearchState,
  type RouteSearchState,
  type RouteSurface,
} from "@/routeSearch";

interface SetRouteStateOptions {
  replace?: boolean;
}

export function useSurfaceSearchState(surface: RouteSurface) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const state = useMemo(() => readLooseRouteSearchState(searchParams), [searchParams]);
  const currentSearch = searchParams.toString();
  const canonicalSearchParams = useMemo(
    () => createSurfaceSearchParams(surface, state),
    [surface, state],
  );
  const canonicalSearch = canonicalSearchParams.toString();

  useEffect(() => {
    if (currentSearch !== canonicalSearch) {
      const search = canonicalSearchParams.toString();
      router.replace(`${pathname}${search ? `?${search}` : ""}`);
    }
  }, [canonicalSearch, canonicalSearchParams, currentSearch, pathname, router]);

  const setRouteState = useCallback(
    (updates: Partial<RouteSearchState>, options?: SetRouteStateOptions) => {
      const nextSearchParams = createSurfaceSearchParams(surface, {
        ...state,
        ...updates,
      });
      const search = nextSearchParams.toString();
      const url = `${pathname}${search ? `?${search}` : ""}`;
      if (options?.replace) {
        router.replace(url);
      } else {
        router.push(url);
      }
    },
    [pathname, router, state, surface],
  );

  return {
    ...state,
    setRouteState,
  };
}
