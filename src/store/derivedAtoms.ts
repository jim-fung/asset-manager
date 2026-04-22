import { atom } from "jotai";
import { images } from "@/data/imageData";
import type { ImageStatus } from "@/data/imageData";
import { serverNotesMapAtom, serverStatusMapAtom } from "@/store/serverAtoms";
import { computeStatusCounts } from "@/utils/imageHelpers";

/**
 * Derived atom: per-status image counts across the full image registry.
 * Recomputes only when `serverStatusMapAtom` changes.
 */
export const statusCountsAtom = atom((get) => {
  const statusMap = get(serverStatusMapAtom);
  return computeStatusCounts(images, statusMap);
});

/**
 * Factory function that creates a focused atom for reading/writing a single image's status.
 * Encapsulates the spread-update pattern.
 *
 * NOTE: This is a plain factory function, NOT a jotai `atomFamily`.
 * Callers MUST memoize the returned atom (e.g. with `useMemo`) to avoid
 * creating new atom instances on every render.
 */
export const imageStatusAtom = (id: string) =>
  atom(
    (get): ImageStatus =>
      get(serverStatusMapAtom)[id] ?? "unset",
    (get, set, value: ImageStatus) =>
      set(serverStatusMapAtom, { ...get(serverStatusMapAtom), [id]: value }),
  );

/**
 * Factory function that creates a focused atom for reading/writing a single image's notes.
 * Encapsulates the spread-update pattern.
 *
 * NOTE: This is a plain factory function, NOT a jotai `atomFamily`.
 * Callers MUST memoize the returned atom (e.g. with `useMemo`) to avoid
 * creating new atom instances on every render.
 */
export const imageNotesAtom = (id: string) =>
  atom(
    (get): string => get(serverNotesMapAtom)[id] ?? "",
    (get, set, value: string) =>
      set(serverNotesMapAtom, { ...get(serverNotesMapAtom), [id]: value }),
  );
