import { useEffect } from "react";
import type { RouteSearchState } from "@/routeSearch";

interface SetRouteStateOptions {
  replace?: boolean;
}

/**
 * Validates `imageId` against a list of items and cleans up the URL
 * when the active imageId no longer matches any item in the list.
 *
 * Returns the validated selectedImageId (null if invalid).
 */
export function useSyncedImageId(
  items: readonly { readonly id: string }[],
  imageId: string | null,
  setRouteState: (
    updates: Partial<RouteSearchState>,
    opts?: SetRouteStateOptions,
  ) => void,
): string | null {
  const isValid = imageId ? items.some((i) => i.id === imageId) : false;
  const selectedImageId = isValid ? imageId : null;

  useEffect(() => {
    if (imageId && !selectedImageId) {
      setRouteState({ imageId: null }, { replace: true });
    }
  }, [imageId, selectedImageId, setRouteState]);

  return selectedImageId;
}
