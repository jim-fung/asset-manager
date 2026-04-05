import { useCallback, useEffect } from "react";
import { useAtom } from "jotai";
import { selectedImageAtom, imageStatusMapAtom, imageNotesMapAtom } from "@/store/atoms";
import { getChapterImages } from "@/data/imageData";
import type { ImageStatus } from "@/data/imageData";

const statusOptions: { value: ImageStatus; label: string }[] = [
  { value: "unset", label: "Unset" },
  { value: "approved", label: "✓ Approved" },
  { value: "review", label: "⟳ Needs Review" },
  { value: "needs-replacement", label: "✕ Needs Replacement" },
];

export function ImageLightbox() {
  const [selectedImage, setSelectedImage] = useAtom(selectedImageAtom);
  const [statusMap, setStatusMap] = useAtom(imageStatusMapAtom);
  const [notesMap, setNotesMap] = useAtom(imageNotesMapAtom);

  const close = useCallback(() => setSelectedImage(null), [setSelectedImage]);

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

  const currentStatus: ImageStatus = (statusMap[selectedImage.id] as ImageStatus) ?? "unset";
  const currentNotes = notesMap[selectedImage.id] ?? "";

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

        <img
          src={selectedImage.src}
          alt={selectedImage.caption || selectedImage.filename}
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
