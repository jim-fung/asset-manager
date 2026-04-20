"use client";

import { useAtomValue } from "jotai";
import { imageStatusMapAtom } from "@/store/atoms";
import type { ImageStatus } from "@/data/imageData";

/** Returns the full status map — consumers use resolveStatus() for per-image lookups */
export function useImageStatuses(): Readonly<Record<string, ImageStatus>> {
  return useAtomValue(imageStatusMapAtom) as Readonly<Record<string, ImageStatus>>;
}
