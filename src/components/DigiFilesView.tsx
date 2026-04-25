"use client";

import { memo, useDeferredValue, useMemo, useState } from "react";
import { useAtomValue } from "jotai";
import {
  digiCollections,
  digiFiles,
  getCollection,
  getCollectionFiles,
  type DigiFile,
} from "@/data/digiFilesData";
import { chapters } from "@/data/imageData";
import { serverAssignmentsAtom } from "@/store/serverAtoms";
import { useSurfaceSearchState } from "@/hooks/useSurfaceSearchState";
import { useSyncedImageId } from "@/hooks/useSyncedImageId";
import { useLightboxOpener } from "@/hooks/useLightboxOpener";
import { useAssignDigiFile } from "@/hooks/useAssignmentActions";
import { digiFileToViewModel } from "@/utils/viewModelHelpers";
import type { ServerImageViewModel } from "@/types/server";
import type { RouteViewMode } from "@/routeSearch";
import { Header } from "@/components/Header";
import { ImageLightbox } from "@/components/ImageLightbox";
import { SearchIcon, GridIcon, ListIcon } from "@/components/Icons";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Input } from "@/components/ui/input";

interface DigiFilesViewProps {
  collectionId: string | null;
}

export function DigiFilesView({ collectionId }: DigiFilesViewProps) {
  const { imageId, q, setRouteState, view } = useSurfaceSearchState("digi");
  const openImage = useLightboxOpener(setRouteState);
  const assignments = useAtomValue(serverAssignmentsAtom);
  const assignDigiFile = useAssignDigiFile();
  const deferredSearchQuery = useDeferredValue(q);

  const collection = collectionId ? getCollection(collectionId) : null;
  useDocumentTitle(collection ? collection.label : "Digitale bestanden");

  const sourceFiles = collectionId
    ? getCollectionFiles(collectionId)
    : digiFiles;

  const filteredFiles = useMemo(() => {
    const trimmedQuery = deferredSearchQuery.trim().toLowerCase();
    if (!trimmedQuery) return sourceFiles;
    return sourceFiles.filter((file) =>
      file.filename.toLowerCase().includes(trimmedQuery),
    );
  }, [deferredSearchQuery, sourceFiles]);

  const filteredViewModels: ServerImageViewModel[] = useMemo(
    () =>
      filteredFiles.map((file) =>
        digiFileToViewModel(file, assignments[file.id] ?? null, chapters),
      ),
    [filteredFiles, assignments],
  );

  const selectedImageId = useSyncedImageId(
    filteredViewModels,
    imageId,
    setRouteState,
  );

  const handleAssignDigiFile = (digiFileId: string, chapterId: string | null) => {
    if (chapterId) {
      assignDigiFile(digiFileId, chapterId);
    }
  };

  const title = collection ? collection.label : "Digitale bestanden";
  const subtitle = collection
    ? collection.description
    : `${digiFiles.length} bestanden in ${digiCollections.length} collecties`;
  const scopeLabel = collection ? "Collectiewerkruimte" : "Digitaal archief";

  return (
    <>
      <Header title={title} subtitle={subtitle}>
        <div className="header-search-wrap">
          <SearchIcon />
          <Input
          id="digi-files-search"
          name="digi-files-search"
          className="header-search-field"
          placeholder="Zoeken"
          value={q}
          aria-label="Zoek digitale bestanden"
          onChange={(e) => setRouteState({ q: e.target.value }, { replace: true })}
          />
        </div>

        <div className="segmented-control" role="group" aria-label="Weergave wisselen">
          <button
            type="button"
            className={`segment-item ${view === "grid" ? "active" : ""}`}
            onClick={() => setRouteState({ view: "grid" as RouteViewMode })}
            aria-label="Rasterweergave"
            aria-pressed={view === "grid"}
          >
            <GridIcon />
          </button>
          <button
            type="button"
            className={`segment-item ${view === "list" ? "active" : ""}`}
            onClick={() => setRouteState({ view: "list" as RouteViewMode })}
            aria-label="Lijstweergave"
            aria-pressed={view === "list"}
          >
            <ListIcon />
          </button>
        </div>
      </Header>

      {/* Content */}
      <div className="page-content">
        <section className="view-summary">
          <div className="view-summary-copy">
            <div className="content-section-label">{scopeLabel}</div>
            <h1 className="view-summary-title">
              {collection ? collection.label : "Verkenner digitale collecties"}
            </h1>
            <p className="view-summary-text">{subtitle}</p>
          </div>
          <div className="view-summary-stats">
            <div className="view-summary-stat">
              <span>Zichtbaar</span>
              <strong>{filteredFiles.length}</strong>
            </div>
            <div className="view-summary-stat">
              <span>Totaal</span>
              <strong>{sourceFiles.length}</strong>
            </div>
            <div className="view-summary-stat">
              <span>Weergave</span>
              <strong>{view === "grid" ? "Raster" : "Lijst"}</strong>
            </div>
          </div>
        </section>

        <section className="content-section">
          <div className="content-section-header">
            <div>
              <div className="content-section-label">Resultaten</div>
              <h2 className="content-section-title">Digitale beelden</h2>
            </div>
            <div className="content-section-meta">
              Gebruikt preview-assets in raster en lightbox
            </div>
          </div>

          {filteredFiles.length > 0 ? (
            <div className={`image-grid ${view === "list" ? "list-mode" : ""}`}>
              {filteredFiles.map((file, i) => {
                const vm = filteredViewModels[i]!;
                return (
                  <DigiFileCard
                    key={file.id}
                    file={file}
                    assignedChapterLabel={vm.assignedChapterLabel}
                    triggerId={`digi-file-${file.id}`}
                    onClick={() => openImage(vm.id, `digi-file-${file.id}`)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"></div>
              <div className="empty-state-text">Geen bestanden komen overeen met je zoekopdracht</div>
            </div>
          )}
        </section>
      </div>

      <ImageLightbox
        items={filteredViewModels}
        onRequestClose={() => setRouteState({ imageId: null })}
        onRequestSelectImage={(nextImage) => setRouteState({ imageId: nextImage.id })}
        selectedImageId={selectedImageId}
        onAssignDigiFile={handleAssignDigiFile}
      />
    </>
  );
}

// - DigiFileCard -

interface DigiFileCardProps {
  file: DigiFile;
  assignedChapterLabel: string | null;
  onClick: () => void;
  triggerId: string;
}

const DigiFileCard = memo(function DigiFileCard({ file, assignedChapterLabel, onClick, triggerId }: DigiFileCardProps) {
  const [imgError, setImgError] = useState(false);
  const col = getCollection(file.collectionId);
  const altText = col ? `${file.filename} uit ${col.label}` : file.filename;

  return (
    <button
      type="button"
      id={triggerId}
      className="image-card"
      onClick={onClick}
      aria-label={`Openen ${file.filename}`}
    >
      <div className="image-card-thumb">
        {imgError ? (
          <div className="image-card-placeholder">Geen preview</div>
        ) : (
          <img
            src={file.preview}
            alt={altText}
            loading="lazy"
            data-image-id={file.id}
            data-source-type="digi"
            onError={() => setImgError(true)}
          />
        )}
        {file.originalFormat === "tiff" && (
          <span className="image-card-status-badge">TIFF-JPG</span>
        )}
        {assignedChapterLabel && (
          <span className="image-card-assignment-badge">{assignedChapterLabel}</span>
        )}
      </div>
      <div className="image-card-info">
        <div className="image-card-title">{file.filename}</div>
        <div className="image-card-meta-row">
          {col && <div className="image-card-chapter">{col.label}</div>}
          <div className="image-card-format">{file.originalFormat.toUpperCase()}</div>
        </div>
      </div>
    </button>
  );
});
