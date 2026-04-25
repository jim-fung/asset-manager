import { atom } from "jotai";
import { atomFamily } from "jotai-family";
import { images } from "@/data/imageData";
import type { ImageStatus } from "@/data/imageData";
import { serverAssignmentsAtom, serverNotesMapAtom, serverStatusMapAtom } from "@/store/serverAtoms";
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
 * Focused atom for reading/writing a single image's status.
 * Uses atomFamily so callers don't need to memoize the returned atom.
 */
export const imageStatusAtom = atomFamily((id: string) =>
  atom(
    (get): ImageStatus =>
      get(serverStatusMapAtom)[id] ?? "unset",
    (get, set, value: ImageStatus) =>
      set(serverStatusMapAtom, { ...get(serverStatusMapAtom), [id]: value }),
  ),
);

/**
 * Focused atom for reading/writing a single image's notes.
 * Uses atomFamily so callers don't need to memoize the returned atom.
 */
export const imageNotesAtom = atomFamily((id: string) =>
  atom(
    (get): string => get(serverNotesMapAtom)[id] ?? "",
    (get, set, value: string) =>
      set(serverNotesMapAtom, { ...get(serverNotesMapAtom), [id]: value }),
  ),
);

/**
 * Factory function that creates a focused atom for reading/writing a single digi-file's
 * chapter assignment. Encapsulates the spread-update pattern.
 *
 * NOTE: This is a plain factory function, NOT a jotai `atomFamily`.
 * Callers MUST memoize the returned atom (e.g. with `useMemo`) to avoid
 * creating new atom instances on every render.
 */
export const digiFileAssignmentAtom = (digiFileId: string) =>
  atom(
    (get): string | null => get(serverAssignmentsAtom)[digiFileId] ?? null,
    (get, set, value: string | null) => {
      const current = { ...get(serverAssignmentsAtom) };
      if (value === null) {
        delete current[digiFileId];
      } else {
        current[digiFileId] = value;
      }
      set(serverAssignmentsAtom, current);
    },
  );
