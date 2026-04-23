import type { ImageAsset } from "@/data/imageData";

export type ImageSourceType = "book" | "digi";

export interface ServerImageViewModel extends ImageAsset {
  sourceType: ImageSourceType;
  sourceCollectionId: string | null;
  sourceCollectionLabel: string | null;
  assignedChapterId: string | null;
  assignedChapterLabel: string | null;
  canRemoveFromChapter: boolean;
}
