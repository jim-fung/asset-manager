import { useAtom, useSetAtom } from "jotai";
import { selectedChapterAtom, openLightboxAtom } from "@/store/atoms";
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
  const openLightbox = useSetAtom(openLightboxAtom);
  const statusMap = useImageStatuses();

  const statusCounts = images.reduce(
    (acc, img) => {
      const s: ImageStatus = (statusMap[img.id] as ImageStatus) ?? "unset";
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    },
    {} as Record<ImageStatus, number>,
  );

  const stats = [
    { label: "Total Assets", value: images.length, tone: "accent" },
    { label: "Approved", value: statusCounts.approved || 0, tone: "approved" },
    { label: "Needs Review", value: statusCounts.review || 0, tone: "review" },
    {
      label: "Needs Replacement",
      value: statusCounts["needs-replacement"] || 0,
      tone: "replace",
    },
  ];

  return (
    <>
      <Header
        title="Asset Library"
        subtitle={`${chapters.length} chapters and ${images.length} tracked assets`}
      />

      <div className="page-content">
        <section className="overview-hero">
          <div className="overview-copy">
            <div className="content-section-label">Workspace Overview</div>
            <h1 className="overview-title">Winston van der Bok archive</h1>
            <p className="overview-subtitle">
              Review print-book assets, move across chapter directories, and inspect
              digital collections from a single manager workspace.
            </p>
          </div>
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className={`stat-card ${stat.tone}`}>
                <div className="stat-card-value">{stat.value}</div>
                <div className="stat-card-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="content-section">
          <div className="content-section-header">
            <div>
              <div className="content-section-label">Library</div>
              <h2 className="content-section-title">Chapter directories</h2>
            </div>
            <div className="content-section-meta">{chapters.length} chapters</div>
          </div>

          <div className="chapter-cards-grid">
          {chapters.map((ch) => {
            const chImages = getChapterImages(ch.id);
            const previewImages = chImages.slice(0, 4);

            return (
              <button
                key={ch.id}
                type="button"
                className="chapter-card"
                onClick={() => setSelectedChapter(ch.id)}
                aria-label={`Open ${ch.title}`}
              >
                <div className="chapter-card-preview">
                  {previewImages.map((img, i) => (
                    <img
                      key={img.id + i}
                      src={img.preview}
                      alt={img.alt || img.description || img.caption || img.filename}
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
              </button>
            );
          })}
          </div>
        </section>

        <section className="content-section">
          <div className="content-section-header">
            <div>
              <div className="content-section-label">Preview Grid</div>
              <h2 className="content-section-title">All assets</h2>
            </div>
            <div className="content-section-meta">
              {images.length} images, opens the shared lightbox
            </div>
          </div>

          <div className="overview-images-grid">
            {images.map((img) => {
              const s: ImageStatus = (statusMap[img.id] as ImageStatus) ?? "unset";
              return (
                <button
                  key={img.id}
                  type="button"
                  id={`overview-image-${img.id}`}
                  className="overview-image-button"
                  onClick={() =>
                    openLightbox({
                      image: img,
                      items: images,
                      triggerId: `overview-image-${img.id}`,
                    })
                  }
                  title={`${img.filename} ${img.section}`}
                  aria-label={`Open ${img.filename}`}
                >
                  <img
                    src={img.preview}
                    alt={img.alt || img.description || img.caption || img.filename}
                    loading="lazy"
                  />
                  <div className={`image-card-status ${s}`} aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
