import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { ImageStatus, ImageAsset } from "@/data/imageData";

/** Currently selected chapter ID (null = overview dashboard) */
export const selectedChapterAtom = atom<string | null>(null);

/** Search query for filtering images */
export const searchQueryAtom = atom("");

/** Status filter (null = show all) */
export const filterStatusAtom = atom<ImageStatus | null>(null);

/** Currently selected image for lightbox view */
export const selectedImageAtom = atom<ImageAsset | null>(null);

/** Grid vs list toggle */
export const viewModeAtom = atom<"grid" | "list">("grid");

/** Sidebar collapsed state */
export const sidebarCollapsedAtom = atom(false);

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
