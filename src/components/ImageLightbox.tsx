import { useCallback, useEffect } from "react";
import { useAtom } from "jotai";
import {
  selectedImageAtom,
  imageStatusMapAtom,
  imageNotesMapAtom,
  activeVersionAtom,
} from "@/store/atoms";
import { getChapterImages } from "@/data/imageData";
import type { ImageStatus, ImageVersion } from "@/data/imageData";

const statusOptions: { value: ImageStatus; label: string }[] = [
  { value: "unset", label: "Unset" },
  { value: "approved", label: "✓ Approved" },
  { value: "review", label: "⟳ Needs Review" },
  { value: "needs-replacement", label: "✕ Needs Replacement" },
];

const versionTabs: { value: ImageVersion; label: string; icon: string }[] = [
  { value: "regular", label: "Regular", icon: "○" },
  { value: "optimized", label: "Optimised", icon: "◎" },
  { value: "print", label: "Print Ready", icon: "◉" },
];

export function ImageLightbox() {
  const [selectedImage, setSelectedImage] = useAtom(selectedImageAtom);
  const [statusMap, setStatusMap] = useAtom(imageStatusMapAtom);
  const [notesMap, setNotesMap] = useAtom(imageNotesMapAtom);
  const [activeVersion, setActiveVersion] = useAtom(activeVersionAtom);

  const close = useCallback(() => setSelectedImage(null), [setSelectedImage]);

  // Reset to regular version whenever a new image is opened
  useEffect(() => {
    setActiveVersion("regular");
  }, [selectedImage?.id, setActiveVersion]);

  const chapterImages = selectedImage
    ? getChapterImages(selectedImage.chapterId)
    : [];
  const currentIndex = selectedImage
    ? chapterImages.findIndex((i) => i.id === selectedImage.id)
    : -1;

  const goTo = useCallback(
    (delta: number) => {
      if (!chapterImages.length) return;
      const next =
        (currentIndex + delta + chapterImages.length) % chapterImages.length;
      setSelectedImage(chapterImages[next]);
    },
    [chapterImages, currentIndex, setSelectedImage],
  );

  // Keyboard navigation
  useEffect(() => {
    if (!selectedImage) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") goTo(-1);
      if (e.key === "ArrowRight") goTo(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedImage, close, goTo]);

  if (!selectedImage) return null;

  const currentStatus: ImageStatus =
    (statusMap[selectedImage.id] as ImageStatus) ?? "unset";
  const currentNotes = notesMap[selectedImage.id] ?? "";

  // Resolve src for the active version tab
  const versionSrc: string =
    activeVersion === "optimized"
      ? (selectedImage.versions.optimized ?? selectedImage.src)
      : activeVersion === "print"
        ? (selectedImage.versions.print ?? selectedImage.src)
        : selectedImage.src;

  // Which version tabs are available for this image
  const versionAvailable: Record<ImageVersion, boolean> = {
    regular: true,
    optimized: Boolean(selectedImage.versions.optimized),
    print: Boolean(selectedImage.versions.print),
  };

  const hasAnyAltVersion =
    versionAvailable.optimized || versionAvailable.print;

  return (
    <div className="lightbox-overlay" onClick={close}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={close} title="Close (Esc)">
          ✕
        </button>

        {chapterImages.length > 1 && (
          <>
            <button
              className="lightbox-nav prev"
              onClick={() => goTo(-1)}
              title="Previous (←)"
            >
              ‹
            </button>
            <button
              className="lightbox-nav next"
              onClick={() => goTo(1)}
              title="Next (→)"
            >
              ›
            </button>
          </>
        )}

        {/* Version tab bar — always shown so users know versions exist */}
        <div className="lightbox-version-bar">
          {versionTabs.map((tab) => {
            const available = versionAvailable[tab.value];
            return (
              <button
                key={tab.value}
                className={[
                  "lightbox-version-tab",
                  activeVersion === tab.value ? "active" : "",
                  !available ? "disabled" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => available && setActiveVersion(tab.value)}
                title={
                  available
                    ? `View ${tab.label} version`
                    : `${tab.label} version not yet available`
                }
                disabled={!available}
              >
                <span className="lightbox-version-tab-icon">{tab.icon}</span>
                {tab.label}
                {!available && (
                  <span className="lightbox-version-tab-badge">—</span>
                )}
              </button>
            );
          })}
          {!hasAnyAltVersion && (
            <span className="lightbox-version-hint">
              Add optimised / print paths in imageData.ts to unlock
            </span>
          )}
        </div>

        <img
          key={`${selectedImage.id}-${activeVersion}`}
          src={versionSrc}
          alt={selectedImage.caption || selectedImage.filename}
          className="lightbox-main-image"
        />
      </div>

      <div className="lightbox-panel" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox-panel-title">Image Details</div>

        <div className="lightbox-meta-row">
          <span className="lightbox-meta-label">Filename</span>
          <span className="lightbox-meta-value">{selectedImage.filename}</span>
        </div>

        <div className="lightbox-meta-row">
          <span className="lightbox-meta-label">Chapter</span>
          <span className="lightbox-meta-value">{selectedImage.chapter}</span>
        </div>

        <div className="lightbox-meta-row">
          <span className="lightbox-meta-label">Section</span>
          <span className="lightbox-meta-value">{selectedImage.section}</span>
        </div>

        {selectedImage.description && (
          <div className="lightbox-meta-row">
            <span className="lightbox-meta-label">Description</span>
            <span className="lightbox-meta-value">
              {selectedImage.description}
            </span>
          </div>
        )}

        {selectedImage.caption && (
          <div className="lightbox-meta-row">
            <span className="lightbox-meta-label">Caption</span>
            <span className="lightbox-meta-value">
              {selectedImage.caption}
            </span>
          </div>
        )}

        <div className="lightbox-meta-row">
          <span className="lightbox-meta-label">Position</span>
          <span className="lightbox-meta-value">
            {currentIndex + 1} of {chapterImages.length} in this chapter
          </span>
        </div>

        {/* Versions overview in the panel */}
        <div className="lightbox-meta-row">
          <span className="lightbox-meta-label">Versions</span>
          <div className="lightbox-versions-panel">
            {versionTabs.map((tab) => (
              <div
                key={tab.value}
                className={[
                  "lightbox-versions-panel-item",
                  versionAvailable[tab.value] ? "available" : "missing",
                ].join(" ")}
              >
                <span className="lightbox-versions-panel-dot" />
                {tab.label}
              </div>
            ))}
          </div>
        </div>

        <div className="lightbox-meta-row" style={{ border: "none" }}>
          <span className="lightbox-meta-label">Status</span>
          <select
            className="lightbox-status-select"
            value={currentStatus}
            onChange={(e) =>
              setStatusMap((prev) => ({
                ...prev,
                [selectedImage.id]: e.target.value as ImageStatus,
              }))
            }
          >
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span
            className="lightbox-meta-label"
            style={{ display: "block", marginBottom: 6 }}
          >
            Notes
          </span>
          <textarea
            className="lightbox-notes-area"
            placeholder="Add production notes…"
            value={currentNotes}
            onChange={(e) =>
              setNotesMap((prev) => ({
                ...prev,
                [selectedImage.id]: e.target.value,
              }))
            }
          />
        </div>
      </div>
    </div>
  );
}
