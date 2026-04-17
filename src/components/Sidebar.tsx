import { useAtom, useSetAtom } from "jotai";
import { selectedChapterAtom, activeSectionAtom, selectedCollectionAtom, mobileSidebarOpenAtom } from "@/store/atoms";
import { chapters, images } from "@/data/imageData";
import { digiCollections, digiFiles } from "@/data/digiFilesData";
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

const folderIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const allFilesIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
    <path d="M3 9V7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v2" />
  </svg>
);

export function Sidebar() {
  const [selectedChapter, setSelectedChapter] = useAtom(selectedChapterAtom);
  const [activeSection, setActiveSection] = useAtom(activeSectionAtom);
  const [selectedCollection, setSelectedCollection] = useAtom(selectedCollectionAtom);
  const setMobileSidebarOpen = useSetAtom(mobileSidebarOpenAtom);
  const statusMap = useImageStatuses();

  const statusCounts = images.reduce(
    (acc, img) => {
      const s = statusMap[img.id] ?? "unset";
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    },
    {} as Record<ImageStatus, number>,
  );

  function goBook(chapterId: string | null) {
    setActiveSection("book");
    setSelectedChapter(chapterId);
    setMobileSidebarOpen(false);
  }

  function goDigiFiles(collectionId: string | null) {
    setActiveSection("digi-files");
    setSelectedCollection(collectionId);
    setMobileSidebarOpen(false);
  }

  return (
    <>
      <div className="sidebar-header">
        <div className="sidebar-brand-mark" aria-hidden="true">
          WV
        </div>
        <div className="sidebar-brand-copy">
          <div className="sidebar-logo">Winston van der Bok</div>
          <div className="sidebar-logo-sub">Image Asset Manager</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Library</div>

        <button
          type="button"
          className={`sidebar-item ${activeSection === "book" && selectedChapter === null ? "active" : ""}`}
          onClick={() => goBook(null)}
          title="Overview"
        >
          {homeIcon}
          <span className="sidebar-item-label">Overview</span>
        </button>

        <div className="sidebar-section-label">Chapters</div>

        {chapters.map((ch) => (
          <button
            key={ch.id}
            type="button"
            className={`sidebar-item ${activeSection === "book" && selectedChapter === ch.id ? "active" : ""}`}
            onClick={() => goBook(ch.id)}
            title={ch.title}
          >
            {chapterIcon}
            <span className="sidebar-item-label">
              {ch.number !== null ? `${ch.number}. ` : ""}
              {ch.title}
            </span>
            <span className="sidebar-item-count">{ch.imageCount}</span>
          </button>
        ))}

        <div className="sidebar-section-label">Digital Files</div>

        <button
          type="button"
          className={`sidebar-item ${activeSection === "digi-files" && selectedCollection === null ? "active" : ""}`}
          onClick={() => goDigiFiles(null)}
          title="All Collections"
        >
          {allFilesIcon}
          <span className="sidebar-item-label">All Collections</span>
          <span className="sidebar-item-count">{digiFiles.length}</span>
        </button>

        {digiCollections.map((col) => (
          <button
            key={col.id}
            type="button"
            className={`sidebar-item ${activeSection === "digi-files" && selectedCollection === col.id ? "active" : ""}`}
            onClick={() => goDigiFiles(col.id)}
            title={col.label}
          >
            {folderIcon}
            <span className="sidebar-item-label">{col.label}</span>
            <span className="sidebar-item-count">{col.fileCount}</span>
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
