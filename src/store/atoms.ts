import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { ImageStatus, ImageVersion } from "@/data/imageData";
import { isImageStatus } from "@/utils/typeGuards";

/** Trigger element id used to restore focus after the lightbox closes */
export const lightboxTriggerIdAtom = atom<string | null>(null);

/** Sidebar collapsed state for desktop */
export const sidebarCollapsedAtom = atom(false);

/** Sidebar open state for mobile */
export const mobileSidebarOpenAtom = atom(false);

/** Validates that a value is a Record<string, ImageStatus> */
function isValidStatusMap(value: unknown): value is Record<string, ImageStatus> {
  if (typeof value !== "object" || value === null) return false;
  for (const v of Object.values(value)) {
    if (!isImageStatus(v as string)) return false;
  }
  return true;
}

/** Raw persisted status map (may contain corrupted data from localStorage) */
const rawStatusMapAtom = atomWithStorage<Record<string, ImageStatus>>(
  "iam-status-map",
  {},
);

/** Per-image status overrides, keyed by image id, persisted to localStorage.
 *  Validates stored data on read to handle corrupted localStorage entries. */
export const imageStatusMapAtom = atom<Record<string, ImageStatus>, [Record<string, ImageStatus>], void>(
  (get) => {
    const raw = get(rawStatusMapAtom);
    return isValidStatusMap(raw) ? raw : {};
  },
  (_get, set, next) => {
    set(rawStatusMapAtom, next);
  },
);

/** Per-image notes overrides, keyed by image id, persisted to localStorage */
export const imageNotesMapAtom = atomWithStorage<Record<string, string>>(
  "iam-notes-map",
  {},
);

/**
 * Active version tab in the lightbox (ephemeral  not persisted).
 * Always resets to "regular" when a new image is opened.
 */
export const activeVersionAtom = atom<ImageVersion>("regular");
