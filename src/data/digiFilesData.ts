/**
 * Data registry for the WeTransfer digital files collection.
 * Files are served from preview-ready assets under public/previews/digi-files/<collection-id>.
 * TIFF-origin material is represented here as prepared JPEG previews.
 */

import type { ImageAsset } from "./imageData";

export interface DigiCollection {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly fileCount: number;
}

export interface DigiFile {
  readonly id: string;
  readonly filename: string;
  /** Lightweight preview used for browsing large digi collections */
  readonly preview: string;
  /** Browser-accessible canonical asset path */
  readonly src: string;
  readonly collectionId: string;
  readonly originalFormat: "jpeg" | "tiff";
}

function makeFile(
  filename: string,
  collectionId: string,
  originalFormat: "jpeg" | "tiff" = "jpeg",
): DigiFile {
  const preview = `/previews/digi-files/${collectionId}/${encodeURIComponent(filename.replace(/\.[^.]+$/, ".jpg"))}`;
  return {
    id: `${collectionId}__${filename}`,
    filename,
    preview,
    src: preview,
    collectionId,
    originalFormat,
  };
}

// -- File lists per collection --

const expoSpiceQuiestFiles: readonly DigiFile[] = [
  "_DSC2252-1.jpg", "_DSC2253-1.jpg", "_DSC2292.jpg", "_DSC2298.jpg",
  "_DSC2311.jpg", "_DSC2325.jpg", "_DSC2328.jpg", "_DSC2332.jpg",
  "_DSC2333.jpg", "_DSC2334.jpg", "_DSC2335.jpg", "_DSC2336.jpg",
  "_DSC2345.jpg", "_DSC2350.jpg", "_DSC2369.jpg", "_DSC2383 copy.jpg",
].map((f) => makeFile(f, "expo-spice-quiest"));

const reprosBFiles: readonly DigiFile[] = [
  "_DSC0002.jpg", "_DSC0007.jpg", "_DSC0011.jpg", "_DSC0016.jpg",
  "_DSC0017.jpg", "_DSC0018.jpg", "_DSC0020.jpg", "_DSC0021.jpg",
  "_DSC0022.jpg", "_DSC0025.jpg", "_DSC0026.jpg", "_DSC0028.jpg",
  "_DSC0029.jpg", "_DSC0031.jpg", "_DSC0032.jpg", "_DSC0036.jpg",
  "_DSC0038.jpg", "_DSC0039.jpg", "_DSC0040.jpg", "_DSC0041.jpg",
  "_DSC0042.jpg", "_DSC0043.jpg", "_DSC0055.jpg", "_DSC0063.jpg",
  "_DSC0065.jpg", "_DSC0072.jpg", "_DSC0075.jpg", "_DSC0081.jpg",
  "_DSC0089.jpg", "_DSC0090.jpg", "_DSC0097.jpg", "_DSC0104.jpg",
  "_DSC0106.jpg", "_DSC0110.jpg", "_DSC0119.jpg", "_DSC0149.jpg",
  "_DSC0150.jpg", "_DSC0612.jpg", "_DSC0615.jpg",
].map((f) => makeFile(f, "repros-b"));

const readytexFiles: readonly DigiFile[] = [
  "_DSC6133.jpg", "_DSC6139.jpg", "_DSC6149.jpg", "_DSC6172.jpg", "_DSC6179.jpg",
].map((f) => makeFile(f, "readytex-ingi-sten", "tiff"));

const wvdbkJpegAFiles: readonly DigiFile[] = [
  "_DSC0128.jpg", "_DSC0128_1.jpg", "_DSC0507.jpg", "_DSC0508.jpg",
  "_DSC0510.jpg", "_DSC0512.jpg", "_DSC0513.jpg", "_DSC0514.jpg",
  "_DSC0515.jpg", "_DSC0516.jpg", "_DSC0517.jpg", "_DSC0518.jpg",
  "_DSC0519.jpg", "_DSC0521.jpg", "_DSC0522.jpg", "_DSC0523.jpg",
  "_DSC0524.jpg", "_DSC0525.jpg", "_DSC0526.jpg", "_DSC0530.jpg",
  "_DSC0533.jpg", "_DSC0534.jpg", "_DSC0539.jpg", "_DSC0541.jpg",
  "_DSC0542.jpg", "_DSC0545.jpg", "_DSC0546.jpg", "_DSC0551.jpg",
  "_DSC0554.jpg", "_DSC0564.jpg", "_DSC0566.jpg", "_DSC0569.jpg",
  "_DSC0580.jpg", "_DSC0583.jpg", "_DSC0585.jpg", "_DSC0588.jpg",
  "_DSC0589.jpg", "_DSC0600.jpg", "_DSC0608.jpg",
].map((f) => makeFile(f, "wvdbk-jpeg-a"));

const tiffExpoSpiceQuiestFiles: readonly DigiFile[] = [
  "_DSC2252.jpg", "_DSC2253.jpg", "_DSC2292.jpg", "_DSC2298.jpg",
  "_DSC2311.jpg", "_DSC2325.jpg", "_DSC2328.jpg", "_DSC2332.jpg",
  "_DSC2333.jpg", "_DSC2334.jpg", "_DSC2335.jpg", "_DSC2336.jpg",
  "_DSC2345.jpg", "_DSC2350.jpg", "_DSC2369.jpg", "_DSC2383.jpg",
].map((f) => makeFile(f, "tiff-expo-spice-quiest", "tiff"));

// -- All files --

export const digiFiles: readonly DigiFile[] = [
  ...expoSpiceQuiestFiles,
  ...reprosBFiles,
  ...readytexFiles,
  ...wvdbkJpegAFiles,
  ...tiffExpoSpiceQuiestFiles,
];

// -- Collections registry (immutable, computed at construction) --

export const digiCollections: readonly DigiCollection[] = [
  {
    id: "expo-spice-quiest",
    label: "Expo Spice Quiest (JPEG)",
    description: "JPEG-bestanden uit de serie Expo Spice Quiest",
  },
  {
    id: "repros-b",
    label: "Repro's B (JPEG)",
    description: "Repro-JPEG-bestanden, set B",
  },
  {
    id: "readytex-ingi-sten",
    label: "Readytex Ingi Sten",
    description: "Readytex Expo / Ingi Sten - omgezet vanuit TIFF-originelen met hoge resolutie",
  },
  {
    id: "wvdbk-jpeg-a",
    label: "Repro's WVDBK A (JPEG)",
    description: "Reprofoto's van Winston van der Bok, set A",
  },
  {
    id: "tiff-expo-spice-quiest",
    label: "Expo Spice Quiest (TIFF)",
    description: "TIFF-originelen met hoge resolutie uit de serie Expo Spice Quiest, omgezet naar JPEG",
  },
].map((col) => ({
  ...col,
  fileCount: digiFiles.filter((f) => f.collectionId === col.id).length,
}));

// -- Helpers --

export const getCollectionFiles = (collectionId: string): readonly DigiFile[] =>
  digiFiles.filter((f) => f.collectionId === collectionId);

export const getCollection = (collectionId: string): DigiCollection | undefined =>
  digiCollections.find((c) => c.id === collectionId);

/**
 * Converts a DigiFile into an ImageAsset for lightbox display.
 * Accepts an optional pre-resolved collection to avoid redundant lookups.
 */
export const digiFileToImageAsset = (
  file: DigiFile,
  col?: DigiCollection,
): ImageAsset => {
  const resolvedCol = col ?? getCollection(file.collectionId);
  return {
    id: file.id,
    filename: file.filename,
    preview: file.preview,
    src: file.preview,
    versions: { regular: file.preview },
    chapter: resolvedCol?.label ?? file.collectionId,
    chapterId: file.collectionId,
    section: resolvedCol?.label ?? "",
    caption: file.filename.replace(/\.[^.]+$/, ""),
    alt: file.filename,
    description:
      file.originalFormat === "tiff"
        ? "Voorbereid vanuit bronmateriaal met TIFF-oorsprong"
        : "",
  };
};
