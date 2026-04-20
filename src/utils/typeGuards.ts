import type { ImageStatus, ImageVersion } from "@/data/imageData";

const IMAGE_STATUSES: readonly string[] = [
  "approved",
  "review",
  "needs-replacement",
  "unset",
];
const IMAGE_VERSIONS: readonly string[] = ["regular", "optimized", "print"];

export function isImageStatus(value: string): value is ImageStatus {
  return (IMAGE_STATUSES as readonly string[]).includes(value);
}

export function isImageVersion(value: string): value is ImageVersion {
  return (IMAGE_VERSIONS as readonly string[]).includes(value);
}
