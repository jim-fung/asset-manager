import { useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { selectedCollectionAtom, selectedImageAtom } from "@/store/atoms";
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
  const setSelectedImage = useSetAtom(selectedImageAtom);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const collection = selectedCollection ? getCollection(selectedCollection) : null;

  // Which files to show
  const sourceFiles = selectedCollection
    ? getCollectionFiles(selectedCollection)
    : digiFiles;

  // Filter by search
  const filteredFiles = searchQuery.trim()
    ? sourceFiles.filter((f) =>
        f.filename.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : sourceFiles;

  const title = collection ? collection.label : "Digital Files";
  const subtitle = collection
    ? collection.description
    : `${digiFiles.length} files across ${digiCollections.length} collections`;

  return (
    <>
      <Header title={title} subtitle={subtitle}>
        <div className="search-bar">
          {searchIcon}
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="view-toggle">
          <button
            className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
            title="Grid view"
          >
            {gridIcon}
          </button>
          <button
            className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
            title="List view"
          >
            {listIcon}
          </button>
        </div>
      </Header>

      {/* Content */}
      <div className="page-content">
        {filteredFiles.length > 0 ? (
          <div className={`image-grid ${viewMode === "list" ? "list-mode" : ""}`}>
            {filteredFiles.map((file) => (
              <DigiFileCard
                key={file.id}
                file={file}
                onClick={() => setSelectedImage(digiFileToImageAsset(file))}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon"></div>
            <div className="empty-state-text">No files match your search</div>
          </div>
        )}
      </div>
    </>
  );
}

// - DigiFileCard -

interface DigiFileCardProps {
  file: DigiFile;
  onClick: () => void;
}

function DigiFileCard({ file, onClick }: DigiFileCardProps) {
  const [imgError, setImgError] = useState(false);
  const col = getCollection(file.collectionId);

  return (
    <div className="image-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}>
      <div className="image-card-thumb">
        {imgError ? (
          <div className="image-card-placeholder" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
            No preview
          </div>
        ) : (
          <img
            src={file.src}
            alt={file.filename}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
        {file.originalFormat === "tiff" && (
          <span className="image-card-status-badge" style={{ position: "absolute", top: 6, left: 6, background: "var(--color-accent)", color: "#fff", fontSize: "0.65rem", padding: "2px 6px", borderRadius: 4, fontWeight: 600, letterSpacing: "0.04em" }}>
            TIFF-JPG
          </span>
        )}
      </div>
      <div className="image-card-info">
        <div className="image-card-filename">{file.filename}</div>
        {col && <div className="image-card-chapter">{col.label}</div>}
      </div>
    </div>
  );
}
