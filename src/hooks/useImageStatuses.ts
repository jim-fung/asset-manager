import { useAtomValue } from "jotai";
import { imageStatusMapAtom } from "@/store/atoms";
import type { ImageStatus } from "@/data/imageData";

/** Returns memoized map of image id → effective status */
export function useImageStatuses(): Record<string, ImageStatus> {
  return useAtomValue(imageStatusMapAtom) as Record<string, ImageStatus>;
}
