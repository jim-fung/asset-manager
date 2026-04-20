"use client";

import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { chapters, getChapterImages, images } from "@/data/imageData";
import { useSurfaceSearchState } from "@/hooks/useSurfaceSearchState";
import { useSyncedImageId } from "@/hooks/useSyncedImageId";
import { useLightboxOpener } from "@/hooks/useLightboxOpener";
import { useImageStatuses } from "@/hooks/useImageStatuses";
import { Header } from "@/components/Header";
import { ImageLightbox } from "@/components/ImageLightbox";
import { ImageIcon } from "@/components/Icons";
import { statusCountsAtom } from "@/store/derivedAtoms";
import { getImageAltText, resolveStatus } from "@/utils/imageHelpers";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function OverviewDashboard() {
  useDocumentTitle("Overzicht");
  const router = useRouter();
  const { imageId, setRouteState } = useSurfaceSearchState("overview");
  const openImage = useLightboxOpener(setRouteState);
  const statusMap = useImageStatuses();
  const statusCounts = useAtomValue(statusCountsAtom);
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

  const chapterImagesMap = useMemo(
    () => new Map(chapters.map((ch) => [ch.id, getChapterImages(ch.id)])),
    [],
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
            const chImages = chapterImagesMap.get(ch.id) ?? [];
            const previewImages = chImages.slice(0, 4);

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
                    <span>{ch.imageCount} beelden</span>
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
            {images.map((img) => {
              const s = resolveStatus(img.id, statusMap);
              return (
                <button
                  key={img.id}
                  type="button"
                  id={`overview-image-${img.id}`}
                  className="overview-image-button"
                  onClick={() => openImage(img.id, `overview-image-${img.id}`)}
                  title={`${img.filename} ${img.section}`}
                  aria-label={`Openen ${img.filename}`}
                >
                  <img
                    src={img.preview}
                    alt={getImageAltText(img)}
                    loading="lazy"
                  />
                  <div className={`image-card-status ${s}`} aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <ImageLightbox
        items={images}
        onRequestClose={() => setRouteState({ imageId: null })}
        onRequestSelectImage={(nextImage) => setRouteState({ imageId: nextImage.id })}
        selectedImageId={selectedImageId}
      />
    </>
  );
}
