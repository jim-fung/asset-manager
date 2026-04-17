import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSetAtom } from "jotai";
import {
  digiCollections,
  digiFiles,
  getCollection,
  getCollectionFiles,
  digiFileToImageAsset,
  type DigiFile,
} from "@/data/digiFilesData";
import { useSurfaceSearchState } from "@/hooks/useSurfaceSearchState";
import { Header } from "@/components/Header";
import { ImageLightbox } from "@/components/ImageLightbox";
import { lightboxTriggerIdAtom } from "@/store/atoms";

// - SVG Icons -

const searchIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const gridIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
  </svg>
);

const listIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
);

// - DigiFilesView -

interface DigiFilesViewProps {
  collectionId: string | null;
}

export function DigiFilesView({ collectionId }: DigiFilesViewProps) {
  const { imageId, q, setRouteState, view } = useSurfaceSearchState("digi");
  const setLightboxTriggerId = useSetAtom(lightboxTriggerIdAtom);
  const deferredSearchQuery = useDeferredValue(q);

  const collection = collectionId ? getCollection(collectionId) : null;

  // Which files to show
  const sourceFiles = collectionId
    ? getCollectionFiles(collectionId)
    : digiFiles;

  // Filter by search
  const filteredFiles = useMemo(() => {
    const trimmedQuery = deferredSearchQuery.trim().toLowerCase();

    if (!trimmedQuery) {
      return sourceFiles;
    }

    return sourceFiles.filter((file) =>
      file.filename.toLowerCase().includes(trimmedQuery),
    );
  }, [deferredSearchQuery, sourceFiles]);

  const filteredEntries = useMemo(
    () =>
      filteredFiles.map((file) => ({
        file,
        asset: digiFileToImageAsset(file),
      })),
    [filteredFiles],
  );
  const selectedImageId = filteredEntries.some((entry) => entry.asset.id === imageId)
    ? imageId
    : null;

  const title = collection ? collection.label : "Digitale bestanden";
  const subtitle = collection
    ? collection.description
    : `${digiFiles.length} bestanden in ${digiCollections.length} collecties`;
  const scopeLabel = collection ? "Collectiewerkruimte" : "Digitaal archief";

  useEffect(() => {
    if (imageId && !selectedImageId) {
      setRouteState({ imageId: null }, { replace: true });
    }
  }, [imageId, selectedImageId, setRouteState]);

  function openImage(nextImageId: string, triggerId: string) {
    setLightboxTriggerId(triggerId);
    setRouteState({ imageId: nextImageId });
  }

  return (
    <>
      <Header title={title} subtitle={subtitle}>
        <div className="search-bar">
          {searchIcon}
          <input
            id="digi-files-search"
            name="digi-files-search"
            type="text"
            aria-label="Zoek digitale bestanden"
            placeholder="Zoeken"
            value={q}
            onChange={(e) => setRouteState({ q: e.target.value }, { replace: true })}
          />
        </div>

        <div className="view-toggle">
          <button
            type="button"
            className={`view-toggle-btn ${view === "grid" ? "active" : ""}`}
            onClick={() => setRouteState({ view: "grid" })}
            title="Rasterweergave"
            aria-pressed={view === "grid"}
          >
            {gridIcon}
          </button>
          <button
            type="button"
            className={`view-toggle-btn ${view === "list" ? "active" : ""}`}
            onClick={() => setRouteState({ view: "list" })}
            title="Lijstweergave"
            aria-pressed={view === "list"}
          >
            {listIcon}
          </button>
        </div>
      </Header>

      {/* Content */}
      <div className="page-content">
        <section className="view-summary">
          <div className="view-summary-copy">
            <div className="content-section-label">{scopeLabel}</div>
            <h2 className="view-summary-title">
              {collection ? collection.label : "Verkenner digitale collecties"}
            </h2>
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
              {filteredEntries.map(({ file, asset }) => (
                <DigiFileCard
                  key={file.id}
                  file={file}
                  triggerId={`digi-file-${file.id}`}
                  onClick={() => openImage(asset.id, `digi-file-${file.id}`)}
                />
              ))}
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
        items={filteredEntries.map((entry) => entry.asset)}
        onRequestClose={() => setRouteState({ imageId: null })}
        onRequestSelectImage={(nextImage) => setRouteState({ imageId: nextImage.id })}
        selectedImageId={selectedImageId}
      />
    </>
  );
}

// - DigiFileCard -

interface DigiFileCardProps {
  file: DigiFile;
  onClick: () => void;
  triggerId: string;
}

function DigiFileCard({ file, onClick, triggerId }: DigiFileCardProps) {
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
          <div className="image-card-placeholder">
            Geen preview
          </div>
        ) : (
          <img
            src={file.preview}
            alt={altText}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
        {file.originalFormat === "tiff" && (
          <span className="image-card-status-badge">
            TIFF-JPG
          </span>
        )}
      </div>
      <div className="image-card-info">
        <div className="image-card-filename">{file.filename}</div>
        <div className="image-card-meta-row">
          {col && <div className="image-card-chapter">{col.label}</div>}
          <div className="image-card-format">{file.originalFormat.toUpperCase()}</div>
        </div>
      </div>
    </button>
  );
}
