import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { useNavigate } from "react-router";
import { chapters, getChapterImages, images } from "@/data/imageData";
import type { ImageStatus } from "@/data/imageData";
import { useSurfaceSearchState } from "@/hooks/useSurfaceSearchState";
import { useImageStatuses } from "@/hooks/useImageStatuses";
import { Header } from "@/components/Header";
import { ImageLightbox } from "@/components/ImageLightbox";
import { lightboxTriggerIdAtom } from "@/store/atoms";

const imageIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

export function OverviewDashboard() {
  const navigate = useNavigate();
  const { imageId, setRouteState } = useSurfaceSearchState("overview");
  const setLightboxTriggerId = useSetAtom(lightboxTriggerIdAtom);
  const statusMap = useImageStatuses();
  const selectedImageId = images.some((img) => img.id === imageId) ? imageId : null;

  const statusCounts = images.reduce(
    (acc, img) => {
      const s: ImageStatus = (statusMap[img.id] as ImageStatus) ?? "unset";
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    },
    {} as Record<ImageStatus, number>,
  );

  const stats = [
    { label: "Totaal beelden", value: images.length, tone: "accent" },
    { label: "Goedgekeurd", value: statusCounts.approved || 0, tone: "approved" },
    { label: "Te beoordelen", value: statusCounts.review || 0, tone: "review" },
    {
      label: "Te vervangen",
      value: statusCounts["needs-replacement"] || 0,
      tone: "replace",
    },
  ];

  useEffect(() => {
    if (imageId && !selectedImageId) {
      setRouteState({ imageId: null }, { replace: true });
    }
  }, [imageId, selectedImageId, setRouteState]);

  function openImage(imageId: string, triggerId: string) {
    setLightboxTriggerId(triggerId);
    setRouteState({ imageId });
  }

  return (
    <>
      <Header
        title="Beeldbibliotheek"
        subtitle={`${chapters.length} hoofdstukken en ${images.length} geregistreerde beelden`}
      />

      <div className="page-content">
        <section className="overview-hero">
          <div className="overview-copy">
            <div className="content-section-label">Werkruimteoverzicht</div>
            <h1 className="overview-title">Archief Winston van der Bok</h1>
            <p className="overview-subtitle">
              Bekijk boekbeelden, navigeer door hoofdstukmappen en inspecteer
              digitale collecties vanuit een centrale beheerwerkruimte.
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
              <div className="content-section-label">Bibliotheek</div>
              <h2 className="content-section-title">Hoofdstukmappen</h2>
            </div>
            <div className="content-section-meta">{chapters.length} hoofdstukken</div>
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
                onClick={() => navigate(`/book/${ch.id}`)}
                aria-label={`Openen ${ch.title}`}
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
                    {ch.number !== null ? `Hoofdstuk ${ch.number}` : ch.title}
                  </div>
                  <div className="chapter-card-title">{ch.title}</div>
                  <div className="chapter-card-desc">{ch.subtitle}</div>
                  <div className="chapter-card-meta">
                    {imageIcon}
                    <span>{ch.imageCount} beelden</span>
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
              <div className="content-section-label">Voorvertoningsraster</div>
              <h2 className="content-section-title">Alle beelden</h2>
            </div>
            <div className="content-section-meta">
              {images.length} beelden, opent de gedeelde lightbox
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
                  onClick={() => openImage(img.id, `overview-image-${img.id}`)}
                  title={`${img.filename} ${img.section}`}
                  aria-label={`Openen ${img.filename}`}
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

      <ImageLightbox
        items={images}
        onRequestClose={() => setRouteState({ imageId: null })}
        onRequestSelectImage={(nextImage) => setRouteState({ imageId: nextImage.id })}
        selectedImageId={selectedImageId}
      />
    </>
  );
}
