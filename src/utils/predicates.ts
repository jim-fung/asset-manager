import type { ImageAsset, ImageStatus } from "@/data/imageData";

/** A function that tests whether an item satisfies a condition */
export type Predicate<T> = (item: T) => boolean;

/** Combine multiple predicates — all must pass */
export const allOf =
  <T>(...preds: Predicate<T>[]): Predicate<T> =>
  (item) =>
    preds.every((p) => p(item));

/**
 * Matches images whose filename, caption, or section contain the query.
 * Returns a pass-through predicate when the query is empty.
 */
export const matchesQuery =
  (query: string): Predicate<ImageAsset> =>
  (img) => {
    if (!query) return true;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      img.filename.toLowerCase().includes(q) ||
      img.caption.toLowerCase().includes(q) ||
      img.section.toLowerCase().includes(q)
    );
  };

/**
 * Matches images whose effective status equals the given status.
 * Returns a pass-through predicate when status is null (= show all).
 */
export const matchesStatus =
  (
    status: ImageStatus | null,
    statusMap: Readonly<Record<string, ImageStatus>>,
  ): Predicate<ImageAsset> =>
  (img) => {
    if (!status) return true;
    const effective = statusMap[img.id] ?? "unset";
    return effective === status;
  };
