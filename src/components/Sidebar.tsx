import { useMemo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { Link, useLocation, useSearchParams } from "react-router";
import { chapters, images } from "@/data/imageData";
import { digiCollections, digiFiles } from "@/data/digiFilesData";
import {
  buildSurfaceSearchString,
  readLooseRouteSearchState,
  type RouteSurface,
} from "@/routeSearch";
import { mobileSidebarOpenAtom, sidebarCollapsedAtom } from "@/store/atoms";
import { statusCountsAtom } from "@/store/derivedAtoms";
import { statusConfig } from "@/utils/statusConfig";
import { ConditionalTooltip } from "@/components/ConditionalTooltip";
import {
  HomeIcon,
  ChapterIcon,
  FolderIcon,
  AllFilesIcon,
} from "@/components/Icons";

export function Sidebar() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const setMobileSidebarOpen = useSetAtom(mobileSidebarOpenAtom);
  const isSidebarCollapsed = useAtomValue(sidebarCollapsedAtom);
  const statusCounts = useAtomValue(statusCountsAtom);
  const currentRouteState = useMemo(
    () => readLooseRouteSearchState(searchParams),
    [searchParams],
  );

  const getLinkSearch = (targetSurface: RouteSurface) =>
    buildSurfaceSearchString(targetSurface, {
      ...currentRouteState,
      imageId: null,
    });

  const isActive = (pathname: string, expectedPath: string) =>
    pathname === expectedPath;

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

        <ConditionalTooltip show={isSidebarCollapsed} content="Overzicht">
          <Link
            className={`sidebar-item ${isActive(location.pathname, "/") ? "active" : ""}`}
            onClick={() => setMobileSidebarOpen(false)}
            title="Overzicht"
            to="/"
          >
            <HomeIcon />
            <span className="sidebar-item-label">Overzicht</span>
          </Link>
        </ConditionalTooltip>

        <div className="sidebar-section-label">Hoofdstukken</div>

        {chapters.map((ch) => (
          <ConditionalTooltip key={ch.id} show={isSidebarCollapsed} content={ch.title}>
            <Link
              className={`sidebar-item ${isActive(location.pathname, `/book/${ch.id}`) ? "active" : ""}`}
              onClick={() => setMobileSidebarOpen(false)}
              title={ch.title}
              to={{
                pathname: `/book/${ch.id}`,
                search: getLinkSearch("book"),
              }}
            >
              <ChapterIcon />
              <span className="sidebar-item-label">
                {ch.number !== null ? `${ch.number}. ` : ""}
                {ch.title}
              </span>
              <span className="sidebar-item-count">{ch.imageCount}</span>
            </Link>
          </ConditionalTooltip>
        ))}

        <div className="sidebar-section-label">Digitale bestanden</div>

        <ConditionalTooltip show={isSidebarCollapsed} content="Alle collecties">
          <Link
            className={`sidebar-item ${isActive(location.pathname, "/digi-files") ? "active" : ""}`}
            onClick={() => setMobileSidebarOpen(false)}
            title="Alle collecties"
            to={{
              pathname: "/digi-files",
              search: getLinkSearch("digi"),
            }}
          >
            <AllFilesIcon />
            <span className="sidebar-item-label">Alle collecties</span>
            <span className="sidebar-item-count">{digiFiles.length}</span>
          </Link>
        </ConditionalTooltip>

        {digiCollections.map((col) => (
          <ConditionalTooltip key={col.id} show={isSidebarCollapsed} content={col.label}>
            <Link
              className={`sidebar-item ${isActive(location.pathname, `/digi-files/${col.id}`) ? "active" : ""}`}
              onClick={() => setMobileSidebarOpen(false)}
              title={col.label}
              to={{
                pathname: `/digi-files/${col.id}`,
                search: getLinkSearch("digi"),
              }}
            >
              <FolderIcon />
              <span className="sidebar-item-label">{col.label}</span>
              <span className="sidebar-item-count">{col.fileCount}</span>
            </Link>
          </ConditionalTooltip>
        ))}
      </nav>

      <div className="sidebar-stats">
        <div className="sidebar-stat-row">
          <span className="sidebar-stat-label">Totaal beelden</span>
          <span className="sidebar-stat-value">{images.length}</span>
        </div>
        <div className="sidebar-stat-row">
          <span className="sidebar-stat-label" style={{ color: "var(--color-approved)" }}>
            {statusConfig.approved.label}
          </span>
          <span className="sidebar-stat-value" style={{ color: "var(--color-approved)" }}>
            {statusCounts.approved || 0}
          </span>
        </div>
        <div className="sidebar-stat-row">
          <span className="sidebar-stat-label" style={{ color: "var(--color-review)" }}>
            {statusConfig.review.label}
          </span>
          <span className="sidebar-stat-value" style={{ color: "var(--color-review)" }}>
            {statusCounts.review || 0}
          </span>
        </div>
        <div className="sidebar-stat-row">
          <span
            className="sidebar-stat-label"
            style={{ color: "var(--color-needs-replacement)" }}
          >
            {statusConfig["needs-replacement"].label}
          </span>
          <span
            className="sidebar-stat-value"
            style={{ color: "var(--color-needs-replacement)" }}
          >
            {statusCounts["needs-replacement"] || 0}
          </span>
        </div>
      </div>
    </>
  );
}
