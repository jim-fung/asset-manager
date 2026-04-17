import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { ImageStatus, ImageVersion } from "@/data/imageData";

/** Trigger element id used to restore focus after the lightbox closes */
export const lightboxTriggerIdAtom = atom<string | null>(null);

/** Sidebar collapsed state for desktop */
export const sidebarCollapsedAtom = atom(false);

/** Sidebar open state for mobile */
export const mobileSidebarOpenAtom = atom(false);

/** Per-image status overrides, keyed by image id, persisted to localStorage */
export const imageStatusMapAtom = atomWithStorage<Record<string, ImageStatus>>(
  "iam-status-map",
  {},
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
