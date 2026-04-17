import { useMemo } from "react";
import { useSetAtom } from "jotai";
import { Link, useLocation, useSearchParams } from "react-router";
import { chapters, images } from "@/data/imageData";
import { digiCollections, digiFiles } from "@/data/digiFilesData";
import type { ImageStatus } from "@/data/imageData";
import { useImageStatuses } from "@/hooks/useImageStatuses";
import {
  buildSurfaceSearchString,
  readLooseRouteSearchState,
  type RouteSurface,
} from "@/routeSearch";
import { mobileSidebarOpenAtom } from "@/store/atoms";

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
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const setMobileSidebarOpen = useSetAtom(mobileSidebarOpenAtom);
  const statusMap = useImageStatuses();
  const currentRouteState = useMemo(
    () => readLooseRouteSearchState(searchParams),
    [searchParams],
  );

  const statusCounts = images.reduce(
    (acc, img) => {
      const s = statusMap[img.id] ?? "unset";
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    },
    {} as Record<ImageStatus, number>,
  );

  function getLinkSearch(targetSurface: RouteSurface) {
    return buildSurfaceSearchString(targetSurface, {
      ...currentRouteState,
      imageId: null,
    });
  }

  function isActive(pathname: string, expectedPath: string) {
    return pathname === expectedPath;
  }

  return (
    <>
      <div className="sidebar-header">
        <div className="sidebar-brand-mark" aria-hidden="true">
          WV
        </div>
        <div className="sidebar-brand-copy">
          <div className="sidebar-logo">Winston van der Bok</div>
          <div className="sidebar-logo-sub">Beeldbeheer</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Bibliotheek</div>

        <Link
          className={`sidebar-item ${isActive(location.pathname, "/") ? "active" : ""}`}
          onClick={() => setMobileSidebarOpen(false)}
          title="Overzicht"
          to="/"
        >
          {homeIcon}
          <span className="sidebar-item-label">Overzicht</span>
        </Link>

        <div className="sidebar-section-label">Hoofdstukken</div>

        {chapters.map((ch) => (
          <Link
            key={ch.id}
            className={`sidebar-item ${isActive(location.pathname, `/book/${ch.id}`) ? "active" : ""}`}
            onClick={() => setMobileSidebarOpen(false)}
            title={ch.title}
            to={{
              pathname: `/book/${ch.id}`,
              search: getLinkSearch("book"),
            }}
          >
            {chapterIcon}
            <span className="sidebar-item-label">
              {ch.number !== null ? `${ch.number}. ` : ""}
              {ch.title}
            </span>
            <span className="sidebar-item-count">{ch.imageCount}</span>
          </Link>
        ))}

        <div className="sidebar-section-label">Digitale bestanden</div>

        <Link
          className={`sidebar-item ${isActive(location.pathname, "/digi-files") ? "active" : ""}`}
          onClick={() => setMobileSidebarOpen(false)}
          title="Alle collecties"
          to={{
            pathname: "/digi-files",
            search: getLinkSearch("digi"),
          }}
        >
          {allFilesIcon}
          <span className="sidebar-item-label">Alle collecties</span>
          <span className="sidebar-item-count">{digiFiles.length}</span>
        </Link>

        {digiCollections.map((col) => (
          <Link
            key={col.id}
            className={`sidebar-item ${isActive(location.pathname, `/digi-files/${col.id}`) ? "active" : ""}`}
            onClick={() => setMobileSidebarOpen(false)}
            title={col.label}
            to={{
              pathname: `/digi-files/${col.id}`,
              search: getLinkSearch("digi"),
            }}
          >
            {folderIcon}
            <span className="sidebar-item-label">{col.label}</span>
            <span className="sidebar-item-count">{col.fileCount}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-stats">
        <div className="sidebar-stat-row">
          <span className="sidebar-stat-label">Totaal beelden</span>
          <span className="sidebar-stat-value">{images.length}</span>
        </div>
        <div className="sidebar-stat-row">
          <span className="sidebar-stat-label" style={{ color: "var(--color-approved)" }}>
            Goedgekeurd
          </span>
          <span className="sidebar-stat-value" style={{ color: "var(--color-approved)" }}>
            {statusCounts.approved || 0}
          </span>
        </div>
        <div className="sidebar-stat-row">
          <span className="sidebar-stat-label" style={{ color: "var(--color-review)" }}>
            Te beoordelen
          </span>
          <span className="sidebar-stat-value" style={{ color: "var(--color-review)" }}>
            {statusCounts.review || 0}
          </span>
        </div>
        <div className="sidebar-stat-row">
          <span className="sidebar-stat-label" style={{ color: "var(--color-needs-replacement)" }}>
            Vervangen
          </span>
          <span className="sidebar-stat-value" style={{ color: "var(--color-needs-replacement)" }}>
            {statusCounts["needs-replacement"] || 0}
          </span>
        </div>
      </div>
    </>
  );
}
