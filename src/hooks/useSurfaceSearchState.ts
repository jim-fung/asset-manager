import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const state = useMemo(() => readLooseRouteSearchState(searchParams), [searchParams]);
  const currentSearch = searchParams.toString();
  const canonicalSearchParams = useMemo(
    () => createSurfaceSearchParams(surface, state),
    [surface, state],
  );
  const canonicalSearch = canonicalSearchParams.toString();

  useEffect(() => {
    if (currentSearch !== canonicalSearch) {
      setSearchParams(canonicalSearchParams, { replace: true });
    }
  }, [canonicalSearch, canonicalSearchParams, currentSearch, setSearchParams]);

  const setRouteState = useCallback(
    (updates: Partial<RouteSearchState>, options?: SetRouteStateOptions) => {
      const nextSearchParams = createSurfaceSearchParams(surface, {
        ...state,
        ...updates,
      });

      setSearchParams(nextSearchParams, { replace: options?.replace });
    },
    [setSearchParams, state, surface],
  );

  return {
    ...state,
    setRouteState,
  };
}
