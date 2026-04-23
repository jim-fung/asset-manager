"use client";

import { useMemo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { chapters, images } from "@/data/imageData";
import { digiCollections } from "@/data/digiFilesData";
import {
  buildSurfaceSearchString,
  readLooseRouteSearchState,
  type RouteSurface,
} from "@/routeSearch";
import { mobileSidebarOpenAtom, sidebarCollapsedAtom } from "@/store/atoms";
import { serverAssignmentsAtom } from "@/store/serverAtoms";
import { getChapterImageCountWithAssignments } from "@/utils/viewModelHelpers";
import { digiFiles } from "@/data/digiFilesData";
import { ConditionalTooltip } from "@/components/ConditionalTooltip";
import { UserDisplay } from "@/components/UserDisplay";
import {
  HomeIcon,
  ChapterIcon,
  FolderIcon,
  AllFilesIcon,
} from "@/components/Icons";

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setMobileSidebarOpen = useSetAtom(mobileSidebarOpenAtom);
  const isSidebarCollapsed = useAtomValue(sidebarCollapsedAtom);
  const assignments = useAtomValue(serverAssignmentsAtom);
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
  const getShortHint = (label: string) =>
    label.trim().charAt(0).toUpperCase();

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
        <ul className="sidebar-nav-list" role="list">
          <li className="sidebar-nav-item">
            <ConditionalTooltip show={isSidebarCollapsed} content="Overzicht">
              <Link
                className={`sidebar-item ${isActive(pathname, "/") ? "active" : ""}`}
                onClick={() => setMobileSidebarOpen(false)}
                title="Overzicht"
                href="/"
                data-nav-group="library"
              >
                <HomeIcon />
                <span className="sidebar-item-label">Overzicht</span>
                <span className="sidebar-item-hint" aria-hidden="true">O</span>
              </Link>
            </ConditionalTooltip>
          </li>
        </ul>

        <div className="sidebar-section-label">Hoofdstukken</div>
        <ul className="sidebar-nav-list" role="list">
          {chapters.map((ch) => (
            <li key={ch.id} className="sidebar-nav-item">
              <ConditionalTooltip show={isSidebarCollapsed} content={ch.title}>
                <Link
                  className={`sidebar-item ${isActive(pathname, `/book/${ch.id}`) ? "active" : ""}`}
                  onClick={() => setMobileSidebarOpen(false)}
                  title={ch.title}
                  href={`/book/${ch.id}${getLinkSearch("book")}`}
                  data-nav-group="chapter"
                >
                  <ChapterIcon />
                  <span className="sidebar-item-label">
                    {ch.number !== null ? `${ch.number}. ` : ""}
                    {ch.title}
                  </span>
                  <span className="sidebar-item-count">{getChapterImageCountWithAssignments(ch.id, assignments, images)}</span>
                  <span className="sidebar-item-hint" aria-hidden="true">
                    {ch.number !== null ? String(ch.number) : getShortHint(ch.title)}
                  </span>
                </Link>
              </ConditionalTooltip>
            </li>
          ))}
        </ul>

        <div className="sidebar-section-label">Digitale bestanden</div>
        <ul className="sidebar-nav-list" role="list">
          <li className="sidebar-nav-item">
            <ConditionalTooltip show={isSidebarCollapsed} content="Alle collecties">
              <Link
                className={`sidebar-item ${isActive(pathname, "/digi-files") ? "active" : ""}`}
                onClick={() => setMobileSidebarOpen(false)}
                title="Alle collecties"
                href={`/digi-files${getLinkSearch("digi")}`}
                data-nav-group="digi"
              >
                <AllFilesIcon />
                <span className="sidebar-item-label">Alle collecties</span>
                <span className="sidebar-item-count">{digiFiles.length}</span>
                <span className="sidebar-item-hint" aria-hidden="true">A</span>
              </Link>
            </ConditionalTooltip>
          </li>

          {digiCollections.map((col) => (
            <li key={col.id} className="sidebar-nav-item">
              <ConditionalTooltip show={isSidebarCollapsed} content={col.label}>
                <Link
                  className={`sidebar-item ${isActive(pathname, `/digi-files/${col.id}`) ? "active" : ""}`}
                  onClick={() => setMobileSidebarOpen(false)}
                  title={col.label}
                  href={`/digi-files/${col.id}${getLinkSearch("digi")}`}
                  data-nav-group="digi"
                >
                  <FolderIcon />
                  <span className="sidebar-item-label">{col.label}</span>
                  <span className="sidebar-item-count">{col.fileCount}</span>
                  <span className="sidebar-item-hint" aria-hidden="true">{getShortHint(col.label)}</span>
                </Link>
              </ConditionalTooltip>
            </li>
          ))}
        </ul>
      </nav>

      <UserDisplay />
    </>
  );
}
