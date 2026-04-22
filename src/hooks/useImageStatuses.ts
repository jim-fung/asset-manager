"use client";

import { useAtomValue } from "jotai";
import { serverStatusMapAtom } from "@/store/serverAtoms";
import type { ImageStatus } from "@/data/imageData";

/** Returns the full status map — consumers use resolveStatus() for per-image lookups */
export function useImageStatuses(): Readonly<Record<string, ImageStatus>> {
  return useAtomValue(serverStatusMapAtom) as Readonly<Record<string, ImageStatus>>;
}
