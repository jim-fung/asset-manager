import { atom } from "jotai";
import type { ImageStatus } from "@/data/imageData";

export const serverStatusMapAtom = atom<Record<string, ImageStatus>>({});
export const serverNotesMapAtom = atom<Record<string, string>>({});
export const serverAssignmentsAtom = atom<Record<string, string>>({});
export const serverPreferencesAtom = atom<Record<string, string>>({});
export const isHydratedAtom = atom(false);
export const hydrationErrorAtom = atom<string | null>(null);
