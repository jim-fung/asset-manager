import type { ImageStatus } from "@/data/imageData";

export type RouteSurface = "overview" | "book" | "digi";
export type RouteViewMode = "grid" | "list";

export interface RouteSearchState {
  q: string;
  status: ImageStatus | null;
  view: RouteViewMode;
  imageId: string | null;
}

const validStatuses = new Set<ImageStatus>([
  "approved",
  "review",
  "needs-replacement",
  "unset",
]);

const validViews = new Set<RouteViewMode>(["grid", "list"]);

export function readLooseRouteSearchState(searchParams: URLSearchParams): RouteSearchState {
  const rawStatus = searchParams.get("status");
  const rawView = searchParams.get("view");
  const rawImageId = searchParams.get("image");

  return {
    q: searchParams.get("q")?.trim() ?? "",
    status: rawStatus && validStatuses.has(rawStatus as ImageStatus)
      ? (rawStatus as ImageStatus)
      : null,
    view: rawView && validViews.has(rawView as RouteViewMode)
      ? (rawView as RouteViewMode)
      : "grid",
    imageId: rawImageId?.trim() || null,
  };
}

export function createSurfaceSearchParams(
  surface: RouteSurface,
  state: RouteSearchState,
): URLSearchParams {
  const nextSearchParams = new URLSearchParams();

  if (surface !== "overview" && state.q) {
    nextSearchParams.set("q", state.q);
  }

  if (surface === "book" && state.status) {
    nextSearchParams.set("status", state.status);
  }

  if (surface !== "overview" && state.view !== "grid") {
    nextSearchParams.set("view", state.view);
  }

  if (state.imageId) {
    nextSearchParams.set("image", state.imageId);
  }

  return nextSearchParams;
}

export function buildSurfaceSearchString(
  surface: RouteSurface,
  state: RouteSearchState,
): string {
  const search = createSurfaceSearchParams(surface, state).toString();
  return search ? `?${search}` : "";
}
