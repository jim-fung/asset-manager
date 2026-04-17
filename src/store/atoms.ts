import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { ImageStatus, ImageAsset, ImageVersion } from "@/data/imageData";

/** Active top-level section */
export const activeSectionAtom = atom<"book" | "digi-files">("book");

/** Currently selected chapter ID (null = overview dashboard) */
export const selectedChapterAtom = atom<string | null>(null);

/** Currently selected digi-files collection ID (null = all collections) */
export const selectedCollectionAtom = atom<string | null>(null);

/** Search query for filtering images */
export const searchQueryAtom = atom("");

/** Status filter (null = show all) */
export const filterStatusAtom = atom<ImageStatus | null>(null);

/** Currently selected image for lightbox view */
export const selectedImageAtom = atom<ImageAsset | null>(null);

/** Current result set shown in the grid that opened the lightbox */
export const lightboxItemsAtom = atom<ImageAsset[]>([]);

/** Trigger element id used to restore focus after the lightbox closes */
export const lightboxTriggerIdAtom = atom<string | null>(null);

/** Grid vs list toggle */
export const viewModeAtom = atom<"grid" | "list">("grid");

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

export interface OpenLightboxPayload {
  image: ImageAsset;
  items: ImageAsset[];
  triggerId?: string | null;
}

/** Opens the lightbox with the exact result set visible to the user */
export const openLightboxAtom = atom(
  null,
  (_get, set, { image, items, triggerId }: OpenLightboxPayload) => {
    set(lightboxItemsAtom, items);
    set(lightboxTriggerIdAtom, triggerId ?? null);
    set(activeVersionAtom, "regular");
    set(selectedImageAtom, image);
  },
);

/** Closes the lightbox and clears its transient navigation context */
export const closeLightboxAtom = atom(null, (_get, set) => {
  set(selectedImageAtom, null);
  set(lightboxItemsAtom, []);
  set(lightboxTriggerIdAtom, null);
  set(activeVersionAtom, "regular");
});
