import { useAtom } from "jotai";
import { selectedChapterAtom } from "@/store/atoms";
import { chapters, images } from "@/data/imageData";
import type { ImageStatus } from "@/data/imageData";
import { useImageStatuses } from "@/hooks/useImageStatuses";

const chapterIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

const homeIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
  </svg>
);

export function Sidebar() {
  const [selectedChapter, setSelectedChapter] = useAtom(selectedChapterAtom);
  const statusMap = useImageStatuses();

  const statusCounts = images.reduce(
    (acc, img) => {
      const s = statusMap[img.id] ?? "unset";
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    },
    {} as Record<ImageStatus, number>,
  );

  return (
    <>
      <div className="sidebar-header">
        <div className="sidebar-logo">Winston van der Bok</div>
        <div className="sidebar-logo-sub">Image Asset Manager</div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`sidebar-item ${selectedChapter === null ? "active" : ""}`}
          onClick={() => setSelectedChapter(null)}
        >
          {homeIcon}
          <span>Overview</span>
        </button>

        <div className="sidebar-section-label">Chapters</div>

        {chapters.map((ch) => (
          <button
            key={ch.id}
            className={`sidebar-item ${selectedChapter === ch.id ? "active" : ""}`}
            onClick={() => setSelectedChapter(ch.id)}
          >
            {chapterIcon}
            <span>
              {ch.number !== null ? `${ch.number}. ` : ""}
              {ch.title}
            </span>
            <span className="sidebar-item-count">{ch.imageCount}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-stats">
        <div className="sidebar-stat-row">
          <span className="sidebar-stat-label">Total images</span>
          <span className="sidebar-stat-value">{images.length}</span>
        </div>
        <div className="sidebar-stat-row">
          <span className="sidebar-stat-label" style={{ color: "var(--color-approved)" }}>
            Approved
          </span>
          <span className="sidebar-stat-value" style={{ color: "var(--color-approved)" }}>
            {statusCounts.approved || 0}
          </span>
        </div>
        <div className="sidebar-stat-row">
          <span className="sidebar-stat-label" style={{ color: "var(--color-review)" }}>
            Review
          </span>
          <span className="sidebar-stat-value" style={{ color: "var(--color-review)" }}>
            {statusCounts.review || 0}
          </span>
        </div>
        <div className="sidebar-stat-row">
          <span className="sidebar-stat-label" style={{ color: "var(--color-needs-replacement)" }}>
            Replace
          </span>
          <span className="sidebar-stat-value" style={{ color: "var(--color-needs-replacement)" }}>
            {statusCounts["needs-replacement"] || 0}
          </span>
        </div>

      </div>
    </>
  );
}
