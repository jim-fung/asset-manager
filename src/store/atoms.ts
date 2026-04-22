import { atom } from "jotai";
import type { ImageVersion } from "@/data/imageData";

/** Trigger element id used to restore focus after the lightbox closes */
export const lightboxTriggerIdAtom = atom<string | null>(null);

/** Sidebar collapsed state for desktop */
export const sidebarCollapsedAtom = atom(false);

/** Sidebar open state for mobile */
export const mobileSidebarOpenAtom = atom(false);

/** Trigger element id used to restore focus after the mobile sidebar closes */
export const mobileSidebarTriggerIdAtom = atom<string | null>(null);

/**
 * Active version tab in the lightbox (ephemeral, not persisted).
 * Always resets to "regular" when a new image is opened.
 */
export const activeVersionAtom = atom<ImageVersion>("regular");
