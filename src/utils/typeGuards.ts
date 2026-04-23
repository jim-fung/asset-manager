import type { ImageStatus, ImageVersion } from "@/data/imageData";
import { statusConfig } from "./statusConfig";

const IMAGE_STATUSES = Object.keys(statusConfig);
const IMAGE_VERSIONS: readonly string[] = ["regular", "optimized", "print"];

export function isImageStatus(value: string): value is ImageStatus {
  return (IMAGE_STATUSES as readonly string[]).includes(value);
}

export function isImageVersion(value: string): value is ImageVersion {
  return (IMAGE_VERSIONS as readonly string[]).includes(value);
}
