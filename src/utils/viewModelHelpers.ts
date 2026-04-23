import type { Chapter, ImageAsset } from "@/data/imageData";
import type { DigiFile } from "@/data/digiFilesData";
import { getCollection } from "@/data/digiFilesData";
import type { ServerImageViewModel } from "@/types/server";

export function bookImageToViewModel(image: ImageAsset): ServerImageViewModel {
  return {
    ...image,
    sourceType: "book",
    sourceCollectionId: null,
    sourceCollectionLabel: null,
    assignedChapterId: image.chapterId,
    assignedChapterLabel: image.chapter,
    canRemoveFromChapter: false,
  };
}

export function digiFileToViewModel(
  file: DigiFile,
  assignedChapterId: string | null,
  chapters: readonly Chapter[],
): ServerImageViewModel {
  const col = getCollection(file.collectionId);
  const chapterLabel = assignedChapterId
    ? chapters.find((ch) => ch.id === assignedChapterId)?.title ?? assignedChapterId
    : null;

  const baseAsset: ImageAsset = {
    id: file.id,
    filename: file.filename,
    preview: file.preview,
    src: file.preview,
    versions: { regular: file.preview },
    chapter: col?.label ?? file.collectionId,
    chapterId: file.collectionId,
    section: col?.label ?? "",
    caption: file.filename.replace(/\.[^.]+$/, ""),
    alt: file.filename,
    description:
      file.originalFormat === "tiff"
        ? "Voorbereid vanuit bronmateriaal met TIFF-oorsprong"
        : "",
  };

  return {
    ...baseAsset,
    sourceType: "digi",
    sourceCollectionId: file.collectionId,
    sourceCollectionLabel: col?.label ?? file.collectionId,
    assignedChapterId,
    assignedChapterLabel: chapterLabel,
    canRemoveFromChapter: assignedChapterId !== null,
  };
}

export function getChapterContentsWithAssignments(
  chapterId: string,
  assignments: Readonly<Record<string, string>>,
  chapters: readonly Chapter[],
  bookImages: readonly ImageAsset[],
  digiFiles: readonly DigiFile[],
): ServerImageViewModel[] {
  const bookVms = bookImages
    .filter((img) => img.chapterId === chapterId)
    .map(bookImageToViewModel);

  const assignedDigiFileIds = Object.entries(assignments)
    .filter(([, cid]) => cid === chapterId)
    .map(([digiFileId]) => digiFileId);

  const digiVms = assignedDigiFileIds
    .map((digiFileId) => {
      const file = digiFiles.find((f) => f.id === digiFileId);
      if (!file) return null;
      return digiFileToViewModel(file, chapterId, chapters);
    })
    .filter((vm): vm is ServerImageViewModel => vm !== null);

  return [...bookVms, ...digiVms];
}

export function getChapterImageCountWithAssignments(
  chapterId: string,
  assignments: Readonly<Record<string, string>>,
  bookImages: readonly ImageAsset[],
): number {
  const bookCount = bookImages.filter((img) => img.chapterId === chapterId).length;
  const assignedCount = Object.values(assignments).filter((cid) => cid === chapterId).length;
  return bookCount + assignedCount;
}

export function getUnassignedDigiFiles(
  assignments: Readonly<Record<string, string>>,
  digiFiles: readonly DigiFile[],
): DigiFile[] {
  return digiFiles.filter((f) => !assignments[f.id]);
}