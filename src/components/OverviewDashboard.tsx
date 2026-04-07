import { useAtom } from "jotai";
import { selectedChapterAtom, selectedImageAtom } from "@/store/atoms";
import { chapters, getChapterImages, images } from "@/data/imageData";
import type { ImageStatus } from "@/data/imageData";
import { useImageStatuses } from "@/hooks/useImageStatuses";
import { Header } from "@/components/Header";

const imageIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

export function OverviewDashboard() {
  const [, setSelectedChapter] = useAtom(selectedChapterAtom);
  const [, setSelectedImage] = useAtom(selectedImageAtom);
  const statusMap = useImageStatuses();

  const statusCounts = images.reduce(
    (acc, img) => {
      const s: ImageStatus = (statusMap[img.id] as ImageStatus) ?? "unset";
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    },
    {} as Record<ImageStatus, number>,
  );

  return (
    <>
      <Header title="Dashboard" />

      <div className="page-content">
        {/* Hero */}
        <div className="overview-hero">
          <h1 className="overview-title">Winston van der Bok</h1>
          <p className="overview-subtitle">
            Image asset manager for the printed book. Track, review, and organize
            all {images.length} images across {chapters.length} chapters.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-value">{images.length}</div>
            <div className="stat-card-label">Total Images</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-value" style={{ color: "var(--color-approved)" }}>
              {statusCounts.approved || 0}
            </div>
            <div className="stat-card-label">Approved</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-value" style={{ color: "var(--color-review)" }}>
              {statusCounts.review || 0}
            </div>
            <div className="stat-card-label">Needs Review</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-value" style={{ color: "var(--color-needs-replacement)" }}>
              {statusCounts["needs-replacement"] || 0}
            </div>
            <div className="stat-card-label">Needs Replacement</div>
          </div>
        </div>

        {/* Chapter Cards */}
        <div className="sidebar-section-label" style={{ paddingLeft: 0, marginBottom: 12 }}>
          Chapters
        </div>
        <div className="chapter-cards-grid">
          {chapters.map((ch) => {
            const chImages = getChapterImages(ch.id);
            const previewImages = chImages.slice(0, 4);

            return (
              <div
                key={ch.id}
                className="chapter-card"
                onClick={() => setSelectedChapter(ch.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelectedChapter(ch.id)}
              >
                <div className="chapter-card-preview">
                  {previewImages.map((img, i) => (
                    <img
                      key={img.id + i}
                      src={img.src}
                      alt={img.caption || img.filename}
                      loading="lazy"
                    />
                  ))}
                  {/* Fill empty preview slots with dark placeholders */}
                  {Array.from({ length: Math.max(0, 4 - previewImages.length) }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      style={{ background: "var(--color-bg-elevated)" }}
                    />
                  ))}
                </div>
                <div className="chapter-card-body">
                  <div className="chapter-card-number">
                    {ch.number !== null ? `Chapter ${ch.number}` : ch.titleNl}
                  </div>
                  <div className="chapter-card-title">{ch.title}</div>
                  <div className="chapter-card-desc">{ch.subtitle}</div>
                  <div className="chapter-card-meta">
                    {imageIcon}
                    <span>{ch.imageCount} images</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent / all images preview */}
        <div
          className="sidebar-section-label"
          style={{ paddingLeft: 0, marginTop: 40, marginBottom: 12 }}
        >
          All Images ({images.length})
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
            gap: 4,
          }}
        >
          {images.map((img) => {
            const s: ImageStatus = (statusMap[img.id] as ImageStatus) ?? "unset";
            return (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img)}
                style={{
                  aspectRatio: "1",
                  borderRadius: 6,
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                  border: `2px solid transparent`,
                  transition: "border-color 150ms ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "var(--color-accent)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "transparent")
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelectedImage(img)}
                title={`${img.filename}  ${img.section}`}
              >
                <img
                  src={img.src}
                  alt={img.caption || img.filename}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div
                  className={`image-card-status ${s}`}
                  style={{ top: 4, right: 4, width: 8, height: 8, borderWidth: 1 }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
