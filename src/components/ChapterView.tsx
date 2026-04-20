import { useDeferredValue, useMemo } from "react";
import { Button, SegmentedControl, TextField } from "@radix-ui/themes";
import { getChapter, getChapterImages } from "@/data/imageData";
import { useSurfaceSearchState } from "@/hooks/useSurfaceSearchState";
import { useSyncedImageId } from "@/hooks/useSyncedImageId";
import { useImageStatuses } from "@/hooks/useImageStatuses";
import { useLightboxOpener } from "@/hooks/useLightboxOpener";
import type { RouteViewMode } from "@/routeSearch";
import { Header } from "@/components/Header";
import { ImageCard } from "@/components/ImageCard";
import { ImageLightbox } from "@/components/ImageLightbox";
import { SearchIcon, GridIcon, ListIcon } from "@/components/Icons";
import { statusFilterOptions } from "@/utils/statusConfig";
import { allOf, matchesQuery, matchesStatus } from "@/utils/predicates";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

interface ChapterViewProps {
  chapterId: string;
}

export function ChapterView({ chapterId }: ChapterViewProps) {
  const chapter = getChapter(chapterId);
  useDocumentTitle(chapter ? `Hoofdstuk ${chapter.number}: ${chapter.title}` : undefined);
  const allChapterImages = getChapterImages(chapterId);
  const { imageId, q, setRouteState, status, view } = useSurfaceSearchState("book");
  const openImage = useLightboxOpener(setRouteState);
  const statusMap = useImageStatuses();
  const deferredSearchQuery = useDeferredValue(q);

  const filteredImages = useMemo(
    () =>
      allChapterImages.filter(
        allOf(matchesQuery(deferredSearchQuery), matchesStatus(status, statusMap)),
      ),
    [allChapterImages, deferredSearchQuery, status, statusMap],
  );

  const activeFilterLabel =
    statusFilterOptions.find((filter) => filter.value === status)?.label ?? "Alles";
  const selectedImageId = useSyncedImageId(filteredImages, imageId, setRouteState);

  if (!chapter) {
    return null;
  }

  return (
    <>
      <Header
        title={`${chapter.number !== null ? `Hoofdstuk ${chapter.number}: ` : ""}${chapter.title}`}
        subtitle={chapter.subtitle}
      >
        <TextField.Root
          id="chapter-search"
          name="chapter-search"
          className="header-search-field"
          placeholder="Zoeken"
          value={q}
          aria-label="Zoek hoofdstukbeelden"
          onChange={(e) => setRouteState({ q: e.target.value }, { replace: true })}
        >
          <TextField.Slot><SearchIcon /></TextField.Slot>
        </TextField.Root>

        <div className="filter-pills">
          {statusFilterOptions.map((f) => (
            <Button
              key={f.value ?? "all"}
              size="1"
              variant={status === f.value ? "soft" : "outline"}
              color={status === f.value ? "sky" : "gray"}
              onClick={() =>
                setRouteState({ status: status === f.value ? null : f.value })
              }
              aria-pressed={status === f.value}
            >
              {f.label}
            </Button>
          ))}
        </div>

        <SegmentedControl.Root
          size="1"
          value={view}
          onValueChange={(v) => v && setRouteState({ view: v as RouteViewMode })}
          aria-label="Weergave wisselen"
        >
          <SegmentedControl.Item value="grid" aria-label="Rasterweergave">
            <GridIcon />
          </SegmentedControl.Item>
          <SegmentedControl.Item value="list" aria-label="Lijstweergave">
            <ListIcon />
          </SegmentedControl.Item>
        </SegmentedControl.Root>
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
