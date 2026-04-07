import { useAtom } from "jotai";
import { searchQueryAtom, filterStatusAtom, viewModeAtom, selectedImageAtom } from "@/store/atoms";
import { getChapter, getChapterImages } from "@/data/imageData";
import type { ImageStatus } from "@/data/imageData";
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
  const [, setSelectedImage] = useAtom(selectedImageAtom);
  const statusMap = useImageStatuses();

  if (!chapter) return null;

  // Apply filters
  let filteredImages = allChapterImages;

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredImages = filteredImages.filter(
      (img) =>
        img.filename.toLowerCase().includes(q) ||
        img.caption.toLowerCase().includes(q) ||
        img.section.toLowerCase().includes(q),
    );
  }

  if (filterStatus) {
    filteredImages = filteredImages.filter((img) => {
      const s = statusMap[img.id] ?? "unset";
      return s === filterStatus;
    });
  }

  return (
    <>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">
            {chapter.number !== null ? `Chapter ${chapter.number}: ` : ""}
            {chapter.title}
          </div>
          <div className="page-subtitle">{chapter.titleNl}</div>
        </div>

        <div className="search-bar">
          {searchIcon}
          <input
            type="text"
            placeholder="Search images"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          {statusFilters.map((f) => (
            <button
              key={f.label}
              className={`filter-pill ${filterStatus === f.value ? "active" : ""}`}
              onClick={() => setFilterStatus(filterStatus === f.value ? null : f.value)}
            >
              {f.label}
            </button>
          ))}
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
      </div>

      {/* Content */}
      <div className="page-content">
        {chapter.subtitle && (
          <p style={{ color: "var(--color-text-secondary)", marginBottom: 24, fontSize: "0.88rem", lineHeight: 1.6, maxWidth: 680 }}>
            {chapter.subtitle}
          </p>
        )}

        {filteredImages.length > 0 ? (
          <div className={`image-grid ${viewMode === "list" ? "list-mode" : ""}`}>
            {filteredImages.map((img) => (
              <ImageCard key={img.id} image={img} onClick={() => setSelectedImage(img)} />
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
      </div>
    </>
  );
}
