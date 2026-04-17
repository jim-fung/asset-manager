import { useDeferredValue, useMemo, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { selectedCollectionAtom, openLightboxAtom } from "@/store/atoms";
import {
  digiCollections,
  digiFiles,
  getCollection,
  getCollectionFiles,
  digiFileToImageAsset,
  type DigiFile,
} from "@/data/digiFilesData";
import { Header } from "@/components/Header";

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

export function DigiFilesView() {
  const [selectedCollection] = useAtom(selectedCollectionAtom);
  const openLightbox = useSetAtom(openLightboxAtom);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const collection = selectedCollection ? getCollection(selectedCollection) : null;

  // Which files to show
  const sourceFiles = selectedCollection
    ? getCollectionFiles(selectedCollection)
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

  const title = collection ? collection.label : "Digital Files";
  const subtitle = collection
    ? collection.description
    : `${digiFiles.length} files across ${digiCollections.length} collections`;
  const scopeLabel = collection ? "Collection workspace" : "Digital archive";

  return (
    <>
      <Header title={title} subtitle={subtitle}>
        <div className="search-bar">
          {searchIcon}
          <input
            id="digi-files-search"
            name="digi-files-search"
            type="text"
            aria-label="Search digital files"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="view-toggle">
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
            title="Grid view"
            aria-pressed={viewMode === "grid"}
          >
            {gridIcon}
          </button>
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
            title="List view"
            aria-pressed={viewMode === "list"}
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
              {collection ? collection.label : "Digital collection explorer"}
            </h2>
            <p className="view-summary-text">{subtitle}</p>
          </div>
          <div className="view-summary-stats">
            <div className="view-summary-stat">
              <span>Visible</span>
              <strong>{filteredFiles.length}</strong>
            </div>
            <div className="view-summary-stat">
              <span>Total</span>
              <strong>{sourceFiles.length}</strong>
            </div>
            <div className="view-summary-stat">
              <span>Mode</span>
              <strong>{viewMode === "grid" ? "Grid" : "List"}</strong>
            </div>
          </div>
        </section>

        <section className="content-section">
          <div className="content-section-header">
            <div>
              <div className="content-section-label">Results</div>
              <h2 className="content-section-title">Digital assets</h2>
            </div>
            <div className="content-section-meta">
              Uses preview-ready assets across grid and lightbox
            </div>
          </div>

          {filteredFiles.length > 0 ? (
            <div className={`image-grid ${viewMode === "list" ? "list-mode" : ""}`}>
              {filteredEntries.map(({ file, asset }) => (
                <DigiFileCard
                  key={file.id}
                  file={file}
                  triggerId={`digi-file-${file.id}`}
                  onClick={() =>
                    openLightbox({
                      image: asset,
                      items: filteredEntries.map((entry) => entry.asset),
                      triggerId: `digi-file-${file.id}`,
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"></div>
              <div className="empty-state-text">No files match your search</div>
            </div>
          )}
        </section>
      </div>
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
  const altText = col ? `${file.filename} from ${col.label}` : file.filename;

  return (
    <button
      type="button"
      id={triggerId}
      className="image-card"
      onClick={onClick}
      aria-label={`Open ${file.filename}`}
    >
      <div className="image-card-thumb">
        {imgError ? (
          <div className="image-card-placeholder">
            No preview
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
