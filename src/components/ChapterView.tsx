import { useDeferredValue, useEffect, useMemo } from "react";
import { useSetAtom } from "jotai";
import { getChapter, getChapterImages } from "@/data/imageData";
import type { ImageStatus } from "@/data/imageData";
import { useSurfaceSearchState } from "@/hooks/useSurfaceSearchState";
import { Header } from "@/components/Header";
import { ImageCard } from "@/components/ImageCard";
import { ImageLightbox } from "@/components/ImageLightbox";
import { useImageStatuses } from "@/hooks/useImageStatuses";
import { lightboxTriggerIdAtom } from "@/store/atoms";

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

interface ChapterViewProps {
  chapterId: string;
}

const statusFilters: Array<{ value: ImageStatus | null; label: string }> = [
  { value: null, label: "Alles" },
  { value: "approved", label: "Goedgekeurd" },
  { value: "review", label: "Te beoordelen" },
  { value: "needs-replacement", label: "Vervangen" },
  { value: "unset", label: "Niet ingesteld" },
];

export function ChapterView({ chapterId }: ChapterViewProps) {
  const chapter = getChapter(chapterId);
  const allChapterImages = getChapterImages(chapterId);
  const { imageId, q, setRouteState, status, view } = useSurfaceSearchState("book");
  const setLightboxTriggerId = useSetAtom(lightboxTriggerIdAtom);
  const statusMap = useImageStatuses();
  const deferredSearchQuery = useDeferredValue(q);

  const filteredImages = useMemo(() => {
    const trimmedQuery = deferredSearchQuery.trim().toLowerCase();

    return allChapterImages.filter((img) => {
      if (
        trimmedQuery &&
        !img.filename.toLowerCase().includes(trimmedQuery) &&
        !img.caption.toLowerCase().includes(trimmedQuery) &&
        !img.section.toLowerCase().includes(trimmedQuery)
      ) {
        return false;
      }

      if (!status) {
        return true;
      }

      const imageStatus = statusMap[img.id] ?? "unset";
      return imageStatus === status;
    });
  }, [allChapterImages, deferredSearchQuery, status, statusMap]);

  const activeFilterLabel =
    statusFilters.find((filter) => filter.value === status)?.label ?? "Alles";
  const selectedImageId = filteredImages.some((img) => img.id === imageId) ? imageId : null;

  useEffect(() => {
    if (imageId && !selectedImageId) {
      setRouteState({ imageId: null }, { replace: true });
    }
  }, [imageId, selectedImageId, setRouteState]);

  function openImage(nextImageId: string, triggerId: string) {
    setLightboxTriggerId(triggerId);
    setRouteState({ imageId: nextImageId });
  }

  if (!chapter) {
    return null;
  }

  return (
    <>
      <Header 
        title={`${chapter.number !== null ? `Hoofdstuk ${chapter.number}: ` : ""}${chapter.title}`}
        subtitle={chapter.subtitle}
      >
        <div className="search-bar">
          {searchIcon}
          <input
            id="chapter-search"
            name="chapter-search"
            type="text"
            aria-label="Zoek hoofdstukbeelden"
            placeholder="Zoeken"
            value={q}
            onChange={(e) => setRouteState({ q: e.target.value }, { replace: true })}
          />
        </div>

        <div className="filter-pills">
          {statusFilters.map((f) => (
            <button
              key={f.label}
              type="button"
              className={`filter-pill ${status === f.value ? "active" : ""}`}
              onClick={() => setRouteState({ status: status === f.value ? null : f.value })}
              aria-pressed={status === f.value}
            >
              {f.label}
            </button>
          ))}
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
            <div className="content-section-label">Hoofdstukwerkruimte</div>
            <h2 className="view-summary-title">{chapter.title}</h2>
            {chapter.subtitle && (
              <p className="view-summary-text">{chapter.subtitle}</p>
            )}
          </div>
          <div className="view-summary-stats">
            <div className="view-summary-stat">
              <span>Zichtbaar</span>
              <strong>{filteredImages.length}</strong>
            </div>
            <div className="view-summary-stat">
              <span>Totaal</span>
              <strong>{allChapterImages.length}</strong>
            </div>
            <div className="view-summary-stat">
              <span>Filter</span>
              <strong>{activeFilterLabel}</strong>
            </div>
          </div>
        </section>

        <section className="content-section">
          <div className="content-section-header">
            <div>
              <div className="content-section-label">Resultaten</div>
              <h2 className="content-section-title">Beeldresultaten</h2>
            </div>
            <div className="content-section-meta">
              {view === "grid" ? "Rasterweergave" : "Lijstweergave"}
            </div>
          </div>

          {filteredImages.length > 0 ? (
            <div className={`image-grid ${view === "list" ? "list-mode" : ""}`}>
              {filteredImages.map((img) => (
                <ImageCard
                  key={img.id}
                  image={img}
                  triggerId={`chapter-image-${img.id}`}
                  onClick={() => openImage(img.id, `chapter-image-${img.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"></div>
              <div className="empty-state-text">
                Geen beelden komen overeen met je filters
              </div>
            </div>
          )}
        </section>
      </div>

      <ImageLightbox
        items={filteredImages}
        onRequestClose={() => setRouteState({ imageId: null })}
        onRequestSelectImage={(nextImage) => setRouteState({ imageId: nextImage.id })}
        selectedImageId={selectedImageId}
      />
    </>
  );
}
