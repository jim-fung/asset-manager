"use client";

import { useDeferredValue, useMemo } from "react";
import { useAtomValue } from "jotai";
import { chapters, getChapter, images } from "@/data/imageData";
import { digiFiles } from "@/data/digiFilesData";
import { serverAssignmentsAtom } from "@/store/serverAtoms";
import { useSurfaceSearchState } from "@/hooks/useSurfaceSearchState";
import { useSyncedImageId } from "@/hooks/useSyncedImageId";
import { useImageStatuses } from "@/hooks/useImageStatuses";
import { useLightboxOpener } from "@/hooks/useLightboxOpener";
import { useAssignDigiFile, useUnassignDigiFile } from "@/hooks/useAssignmentActions";
import { getChapterContentsWithAssignments } from "@/utils/viewModelHelpers";
import type { ServerImageViewModel } from "@/types/server";
import type { RouteViewMode } from "@/routeSearch";
import { Header } from "@/components/Header";
import { ImageCard } from "@/components/ImageCard";
import { ImageLightbox } from "@/components/ImageLightbox";
import { SearchIcon, GridIcon, ListIcon } from "@/components/Icons";
import { statusFilterOptions } from "@/utils/statusConfig";
import { allOf, matchesQuery, matchesStatus } from "@/utils/predicates";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChapterViewProps {
  chapterId: string;
}

export function ChapterView({ chapterId }: ChapterViewProps) {
  const chapter = getChapter(chapterId);
  useDocumentTitle(chapter ? `Hoofdstuk ${chapter.number}: ${chapter.title}` : undefined);
  const assignments = useAtomValue(serverAssignmentsAtom);
  const assignDigiFile = useAssignDigiFile();
  const unassignDigiFile = useUnassignDigiFile();
  const { imageId, q, setRouteState, status, view } = useSurfaceSearchState("book");
  const openImage = useLightboxOpener(setRouteState);
  const statusMap = useImageStatuses();
  const deferredSearchQuery = useDeferredValue(q);

  const allChapterViewModels: ServerImageViewModel[] = useMemo(
    () => getChapterContentsWithAssignments(chapterId, assignments, chapters, images, digiFiles),
    [chapterId, assignments],
  );

  const filteredViewModels = useMemo(
    () =>
      allChapterViewModels.filter(
        allOf(matchesQuery(deferredSearchQuery), matchesStatus(status, statusMap)),
      ),
    [allChapterViewModels, deferredSearchQuery, status, statusMap],
  );

  const activeFilterLabel =
    statusFilterOptions.find((filter) => filter.value === status)?.label ?? "Alles";
  const selectedImageId = useSyncedImageId(filteredViewModels, imageId, setRouteState);

  const handleAssignDigiFile = (digiFileId: string, chapterId: string | null) => {
    if (chapterId) {
      assignDigiFile(digiFileId, chapterId);
    }
  };

  const handleRemoveFromChapter = async (digiFileId: string) => {
    await unassignDigiFile(digiFileId);
  };

  if (!chapter) {
    return (
      <div className="page-content">
        <section className="view-summary">
          <div className="view-summary-copy">
            <div className="content-section-label">Fout</div>
            <h1 className="view-summary-title">Hoofdstuk niet gevonden</h1>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      <Header
        title={`${chapter.number !== null ? `Hoofdstuk ${chapter.number}: ` : ""}${chapter.title}`}
        subtitle={chapter.subtitle}
      >
        <div className="header-search-wrap">
          <SearchIcon />
          <Input
          id="chapter-search"
          name="chapter-search"
          className="header-search-field"
          placeholder="Zoeken"
          value={q}
          aria-label="Zoek hoofdstukbeelden"
          onChange={(e) => setRouteState({ q: e.target.value }, { replace: true })}
          />
        </div>

        <div className="filter-pills">
          {statusFilterOptions.map((f) => (
            <Button
              key={f.value ?? "all"}
              size="sm"
              variant={status === f.value ? "soft" : "outline"}
              onClick={() =>
                setRouteState({ status: status === f.value ? null : f.value })
              }
              aria-pressed={status === f.value}
            >
              {f.label}
            </Button>
          ))}
        </div>

        <div className="segmented-control" role="group" aria-label="Weergave wisselen">
          <button
            type="button"
            className={`segment-item ${view === "grid" ? "active" : ""}`}
            onClick={() => setRouteState({ view: "grid" as RouteViewMode })}
            aria-label="Rasterweergave"
            aria-pressed={view === "grid"}
          >
            <GridIcon />
          </button>
          <button
            type="button"
            className={`segment-item ${view === "list" ? "active" : ""}`}
            onClick={() => setRouteState({ view: "list" as RouteViewMode })}
            aria-label="Lijstweergave"
            aria-pressed={view === "list"}
          >
            <ListIcon />
          </button>
        </div>
      </Header>

      {/* Content */}
      <div className="page-content">
        <section className="view-summary">
          <div className="view-summary-copy">
            <div className="content-section-label">Hoofdstukwerkruimte</div>
            <h1 className="view-summary-title">{chapter.title}</h1>
            {chapter.subtitle && (
              <p className="view-summary-text">{chapter.subtitle}</p>
            )}
          </div>
          <div className="view-summary-stats">
            <div className="view-summary-stat">
              <span>Zichtbaar</span>
              <strong>{filteredViewModels.length}</strong>
            </div>
            <div className="view-summary-stat">
              <span>Totaal</span>
              <strong>{allChapterViewModels.length}</strong>
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

          {filteredViewModels.length > 0 ? (
            <div className={`image-grid ${view === "list" ? "list-mode" : ""}`}>
              {filteredViewModels.map((vm) => (
                <ImageCard
                  key={vm.id}
                  image={vm}
                  triggerId={`chapter-image-${vm.id}`}
                  onClick={() => openImage(vm.id, `chapter-image-${vm.id}`)}
                  onRemove={vm.canRemoveFromChapter ? () => handleRemoveFromChapter(vm.id) : undefined}
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
        items={filteredViewModels}
        onRequestClose={() => setRouteState({ imageId: null })}
        onRequestSelectImage={(nextImage) => setRouteState({ imageId: nextImage.id })}
        selectedImageId={selectedImageId}
        onAssignDigiFile={handleAssignDigiFile}
      />
    </>
  );
}
