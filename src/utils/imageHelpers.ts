import type { ImageAsset, ImageStatus } from "@/data/imageData";

/** Resolve the effective status for an image, defaulting to "unset" */
export const resolveStatus = (
  id: string,
  statusMap: Readonly<Record<string, ImageStatus>>,
): ImageStatus => (statusMap[id] as ImageStatus) ?? "unset";

/** Derive the best alt text for an image, falling back through available text fields */
export const getImageAltText = (img: ImageAsset): string =>
  img.alt || img.description || img.caption || img.filename;

/** Compute per-status counts for a list of items */
export const computeStatusCounts = (
  items: readonly { readonly id: string }[],
  statusMap: Readonly<Record<string, ImageStatus>>,
): Readonly<Record<ImageStatus, number>> => {
  const counts: Record<ImageStatus, number> = {
    approved: 0, review: 0, "needs-replacement": 0, unset: 0
  };
  for (const item of items) {
    const s = resolveStatus(item.id, statusMap);
    counts[s] = (counts[s] ?? 0) + 1;
  }
  return Object.freeze(counts);
};
