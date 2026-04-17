import { useDeferredValue, useMemo } from "react";
import { useAtom, useSetAtom } from "jotai";
import { searchQueryAtom, filterStatusAtom, viewModeAtom, openLightboxAtom } from "@/store/atoms";
import { getChapter, getChapterImages } from "@/data/imageData";
import type { ImageStatus } from "@/data/imageData";
import { Header } from "@/components/Header";
import { ImageCard } from "@/components/ImageCard";
import { useImageStatuses } from "@/hooks/useImageStatuses";

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
  { value: null, label: "All" },
  { value: "approved", label: "Approved" },
  { value: "review", label: "Review" },
  { value: "needs-replacement", label: "Replace" },
  { value: "unset", label: "Unset" },
];

export function ChapterView({ chapterId }: ChapterViewProps) {
  const chapter = getChapter(chapterId);
  const allChapterImages = getChapterImages(chapterId);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [filterStatus, setFilterStatus] = useAtom(filterStatusAtom);
  const [viewMode, setViewMode] = useAtom(viewModeAtom);
  const openLightbox = useSetAtom(openLightboxAtom);
  const statusMap = useImageStatuses();
  const deferredSearchQuery = useDeferredValue(searchQuery);

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

      if (!filterStatus) {
        return true;
      }

      const status = statusMap[img.id] ?? "unset";
      return status === filterStatus;
    });
  }, [allChapterImages, deferredSearchQuery, filterStatus, statusMap]);

  const activeFilterLabel =
    statusFilters.find((filter) => filter.value === filterStatus)?.label ?? "All";

  if (!chapter) return null;

  return (
    <>
      <Header 
        title={`${chapter.number !== null ? `Chapter ${chapter.number}: ` : ""}${chapter.title}`}
        subtitle={chapter.titleNl}
      >
        <div className="search-bar">
          {searchIcon}
          <input
            id="chapter-search"
            name="chapter-search"
            type="text"
            aria-label="Search chapter images"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          {statusFilters.map((f) => (
            <button
              key={f.label}
              type="button"
              className={`filter-pill ${filterStatus === f.value ? "active" : ""}`}
              onClick={() => setFilterStatus(filterStatus === f.value ? null : f.value)}
              aria-pressed={filterStatus === f.value}
            >
              {f.label}
            </button>
          ))}
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
            <div className="content-section-label">Chapter Workspace</div>
            <h2 className="view-summary-title">{chapter.titleNl}</h2>
            {chapter.subtitle && (
              <p className="view-summary-text">{chapter.subtitle}</p>
            )}
          </div>
          <div className="view-summary-stats">
            <div className="view-summary-stat">
              <span>Visible</span>
              <strong>{filteredImages.length}</strong>
            </div>
            <div className="view-summary-stat">
              <span>Total</span>
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
              <div className="content-section-label">Results</div>
              <h2 className="content-section-title">Asset results</h2>
            </div>
            <div className="content-section-meta">
              {viewMode === "grid" ? "Grid workspace" : "List workspace"}
            </div>
          </div>

          {filteredImages.length > 0 ? (
            <div className={`image-grid ${viewMode === "list" ? "list-mode" : ""}`}>
              {filteredImages.map((img) => (
                <ImageCard
                  key={img.id}
                  image={img}
                  triggerId={`chapter-image-${img.id}`}
                  onClick={() =>
                    openLightbox({
                      image: img,
                      items: filteredImages,
                      triggerId: `chapter-image-${img.id}`,
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"></div>
              <div className="empty-state-text">
                No images match your filters
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
