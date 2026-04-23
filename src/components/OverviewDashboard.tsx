"use client";

import { memo, useMemo } from "react";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { chapters, images } from "@/data/imageData";
import { digiFiles } from "@/data/digiFilesData";
import { serverAssignmentsAtom } from "@/store/serverAtoms";
import { useSurfaceSearchState } from "@/hooks/useSurfaceSearchState";
import { useSyncedImageId } from "@/hooks/useSyncedImageId";
import { useLightboxOpener } from "@/hooks/useLightboxOpener";
import { Header } from "@/components/Header";
import { ImageLightbox } from "@/components/ImageLightbox";
import { ImageIcon } from "@/components/Icons";
import { statusCountsAtom } from "@/store/derivedAtoms";
import { getImageAltText, resolveStatus } from "@/utils/imageHelpers";
import { bookImageToViewModel } from "@/utils/viewModelHelpers";
import {
  getChapterContentsWithAssignments,
  getChapterImageCountWithAssignments,
} from "@/utils/viewModelHelpers";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

interface OverviewGridItemProps {
  image: typeof images[number];
  onOpen: (imageId: string, triggerId: string) => void;
}

const OverviewGridItem = memo(function OverviewGridItem({ image, onOpen }: OverviewGridItemProps) {
  const triggerId = `overview-image-${image.id}`;

  return (
    <button
      type="button"
      id={triggerId}
      className="overview-image-button"
      onClick={() => onOpen(image.id, triggerId)}
      title={`${image.filename} ${image.section}`}
      aria-label={`Openen ${image.filename}`}
    >
      <img
        src={image.preview}
        alt={getImageAltText(image)}
        loading="lazy"
      />
      <div className={`image-card-status ${"unset"}`} aria-hidden="true" />
    </button>
  );
});

export function OverviewDashboard() {
  useDocumentTitle("Overzicht");
  const router = useRouter();
  const { imageId, setRouteState } = useSurfaceSearchState("overview");
  const openImage = useLightboxOpener(setRouteState);
  const statusCounts = useAtomValue(statusCountsAtom);
  const assignments = useAtomValue(serverAssignmentsAtom);
  const selectedImageId = useSyncedImageId(images, imageId, setRouteState);

  const stats = [
    { label: "Totaal beelden", value: images.length, tone: "accent" },
    { label: "Goedgekeurd", value: statusCounts.approved || 0, tone: "approved" },
    { label: "Te beoordelen", value: statusCounts.review || 0, tone: "review" },
    {
      label: "Te vervangen",
      value: statusCounts["needs-replacement"] || 0,
      tone: "replace",
    },
  ];

  const chapterContentsMap = useMemo(
    () =>
      new Map(
        chapters.map((ch) => [
          ch.id,
          getChapterContentsWithAssignments(
            ch.id,
            assignments,
            chapters,
            images,
            digiFiles,
          ),
        ]),
      ),
    [assignments],
  );

  return (
    <>
      <Header
        title="Beeldbibliotheek"
        subtitle={`${chapters.length} hoofdstukken en ${images.length} geregistreerde beelden`}
      />

      <div className="page-content">
        <section className="overview-hero">
          <div className="overview-copy">
            <div className="content-section-label">Werkruimteoverzicht</div>
            <h1 className="overview-title">Archief Winston van der Bok</h1>
            <p className="overview-subtitle">
              Bekijk boekbeelden, navigeer door hoofdstukmappen en inspecteer
              digitale collecties vanuit een centrale beheerwerkruimte.
            </p>
            <p className="overview-explainer">
              Deze omgeving is bedoeld als redactiewerkruimte voor het boekarchief:
              je gebruikt haar om beeldselecties per hoofdstuk snel terug te vinden,
              beoordelingen en notities vast te leggen, en bronmateriaal uit de
              digitale mappen naast het boekmateriaal te controleren.
            </p>
            <div className="overview-purpose-list" aria-label="Doel van deze werkruimte">
              <span className="overview-purpose-item">Hoofdstukken vergelijken en doorlopen</span>
              <span className="overview-purpose-item">Beelden markeren voor controle of vervanging</span>
              <span className="overview-purpose-item">Digitale collecties koppelen aan het boekproject</span>
            </div>
          </div>
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className={`stat-card ${stat.tone}`}>
                <div className="stat-card-value">{stat.value}</div>
                <div className="stat-card-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="content-section">
          <div className="content-section-header">
            <div>
              <div className="content-section-label">Bibliotheek</div>
              <h2 className="content-section-title">Hoofdstukmappen</h2>
            </div>
            <div className="content-section-meta">{chapters.length} hoofdstukken</div>
          </div>

          <div className="chapter-cards-grid">
          {chapters.map((ch) => {
            const chContents = chapterContentsMap.get(ch.id) ?? [];
            const previewImages = chContents.slice(0, 4);
            const dynamicCount = getChapterImageCountWithAssignments(
              ch.id,
              assignments,
              images,
            );

            return (
              <button
                key={ch.id}
                type="button"
                className="chapter-card"
                onClick={() => router.push(`/book/${ch.id}`)}
                aria-label={`Openen ${ch.title}`}
              >
                <div className="chapter-card-preview">
                  {previewImages.map((img, i) => (
                    <img
                      key={img.id + i}
                      src={img.preview}
                      alt={getImageAltText(img)}
                      loading="lazy"
                    />
                  ))}
                  {/* Fill empty preview slots with dark placeholders */}
                  {Array.from({ length: Math.max(0, 4 - previewImages.length) }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      style={{ background: "var(--color-bg-elevated)" }}
                    />
                  ))}
                </div>
                <div className="chapter-card-body">
                  <div className="chapter-card-number">
                    {ch.number !== null ? `Hoofdstuk ${ch.number}` : ch.title}
                  </div>
                  <div className="chapter-card-title">{ch.title}</div>
                  <div className="chapter-card-desc">{ch.subtitle}</div>
                  <div className="chapter-card-meta">
                    <ImageIcon />
                    <span>{dynamicCount} beelden</span>
                  </div>
                </div>
              </button>
            );
          })}
          </div>
        </section>

        <section className="content-section">
          <div className="content-section-header">
            <div>
              <div className="content-section-label">Voorvertoningsraster</div>
              <h2 className="content-section-title">Alle beelden</h2>
            </div>
            <div className="content-section-meta">
              {images.length} beelden, opent de gedeelde lightbox
            </div>
          </div>

          <div className="overview-images-grid">
            {images.map((img) => (
              <OverviewGridItem key={img.id} image={img} onOpen={openImage} />
            ))}
          </div>
        </section>
      </div>

      <ImageLightbox
        items={images.map(bookImageToViewModel)}
        onRequestClose={() => setRouteState({ imageId: null })}
        onRequestSelectImage={(nextImage) => setRouteState({ imageId: nextImage.id })}
        selectedImageId={selectedImageId}
      />
    </>
  );
}
