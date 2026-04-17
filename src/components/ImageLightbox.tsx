import {
  useCallback,
  useMemo,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  Dialog,
  SegmentedControl,
  Select,
  TextArea,
} from "@radix-ui/themes";
import {
  activeVersionAtom,
  lightboxTriggerIdAtom,
} from "@/store/atoms";
import { imageNotesAtom, imageStatusAtom } from "@/store/derivedAtoms";
import type { ImageAsset, ImageVersion } from "@/data/imageData";
import { getImageAltText } from "@/utils/imageHelpers";
import { statusSelectOptions } from "@/utils/statusConfig";
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon } from "@/components/Icons";

interface ImageLightboxProps {
  items: readonly ImageAsset[];
  onRequestClose: () => void;
  onRequestSelectImage: (image: ImageAsset) => void;
  selectedImageId: string | null;
}

const versionTabs: readonly { readonly value: ImageVersion; readonly label: string }[] = [
  { value: "regular", label: "Standaard" },
  { value: "optimized", label: "Geoptimaliseerd" },
  { value: "print", label: "Drukklaar" },
];

/** Prevent arrow-key navigation from firing while the user is typing */
const isTextInput = (target: EventTarget | null): boolean =>
  target instanceof HTMLInputElement ||
  target instanceof HTMLTextAreaElement ||
  target instanceof HTMLSelectElement ||
  (target instanceof HTMLElement && target.isContentEditable);

export function ImageLightbox({
  items,
  onRequestClose,
  onRequestSelectImage,
  selectedImageId,
}: ImageLightboxProps) {
  const [activeVersion, setActiveVersion] = useAtom(activeVersionAtom);
  const lightboxTriggerId = useAtomValue(lightboxTriggerIdAtom);

  const selectedImage = useMemo(
    () => items.find((item) => item.id === selectedImageId) ?? null,
    [items, selectedImageId],
  );

  // Per-image focused atoms (stable for the selected image)
  const statusAtom = useMemo(
    () => imageStatusAtom(selectedImage?.id ?? ""),
    [selectedImage?.id],
  );
  const notesAtom = useMemo(
    () => imageNotesAtom(selectedImage?.id ?? ""),
    [selectedImage?.id],
  );
  const [currentStatus, setCurrentStatus] = useAtom(statusAtom);
  const [currentNotes, setCurrentNotes] = useAtom(notesAtom);

  /** Reset to the default version whenever a new image is opened */
  // Using a ref to track previous image avoids useEffect for this
  const currentIndex = selectedImage
    ? Math.max(
        items.findIndex((item) => item.id === selectedImage.id),
        0,
      )
    : -1;

  const goTo = useCallback(
    (delta: number) => {
      if (!items.length || currentIndex === -1) return;
      const nextIndex = (currentIndex + delta + items.length) % items.length;
      onRequestSelectImage(items[nextIndex]);
    },
    [currentIndex, items, onRequestSelectImage],
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (isTextInput(event.target)) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(1);
      }
    },
    [goTo],
  );

  const altText = selectedImage ? getImageAltText(selectedImage) : "";

  const versionAvailable: Readonly<Record<ImageVersion, boolean>> = selectedImage
    ? {
        regular: true,
        optimized: Boolean(selectedImage.versions.optimized),
        print: Boolean(selectedImage.versions.print),
      }
    : { regular: true, optimized: false, print: false };

  const hasAnyAltVersion =
    versionAvailable.optimized || versionAvailable.print;

  const versionSrc = selectedImage
    ? activeVersion === "optimized"
      ? (selectedImage.versions.optimized ?? selectedImage.src)
      : activeVersion === "print"
        ? (selectedImage.versions.print ?? selectedImage.src)
        : selectedImage.src
    : "";

  return (
    <Dialog.Root
      open={selectedImageId !== null}
      onOpenChange={(open) => {
        if (!open) onRequestClose();
      }}
    >
      <Dialog.Content
        /* Make the dialog fill the full viewport */
        width="100vw"
        height="100dvh"
        maxWidth="100vw"
        align="start"
        aria-describedby={undefined}
        style={{
          padding: 0,
          borderRadius: 0,
          background: "transparent",
          display: "flex",
          overflow: "hidden",
          boxShadow: "none",
        }}
        onKeyDown={handleKeyDown}
        onOpenAutoFocus={() => {
          /* Reset version tab when a new image opens */
          setActiveVersion("regular");
        }}
        onCloseAutoFocus={(e) => {
          /* Restore focus to the card that opened the lightbox */
          e.preventDefault();
          const triggerElement = lightboxTriggerId
            ? (document.getElementById(lightboxTriggerId) as HTMLElement | null)
            : null;
          triggerElement?.focus();
        }}
      >
        {selectedImage && (
          <>
            {/* ── Image side ─────────────────────────────────────── */}
            <div className="lightbox-content">
              <Dialog.Close>
                <button
                  type="button"
                  className="lightbox-close"
                  aria-label="Sluiten (Esc)"
                  title="Sluiten (Esc)"
                >
                  <CloseIcon />
                </button>
              </Dialog.Close>

              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    className="lightbox-nav prev"
                    onClick={(e) => {
                      e.stopPropagation();
                      goTo(-1);
                    }}
                    aria-label="Vorige"
                    title="Vorige"
                  >
                    <ChevronLeftIcon />
                  </button>
                  <button
                    type="button"
                    className="lightbox-nav next"
                    onClick={(e) => {
                      e.stopPropagation();
                      goTo(1);
                    }}
                    aria-label="Volgende"
                    title="Volgende"
                  >
                    <ChevronRightIcon />
                  </button>
                </>
              )}

              {hasAnyAltVersion && (
                <SegmentedControl.Root
                  size="1"
                  className="lightbox-version-bar"
                  value={activeVersion}
                  onValueChange={(v) =>
                    v && setActiveVersion(v as ImageVersion)
                  }
                >
                  {versionTabs
                    .filter((tab) => versionAvailable[tab.value])
                    .map((tab) => (
                      <SegmentedControl.Item
                        key={tab.value}
                        value={tab.value}
                      >
                        {tab.label}
                      </SegmentedControl.Item>
                    ))}
                </SegmentedControl.Root>
              )}

              <img
                key={`${selectedImage.id}-${activeVersion}`}
                src={versionSrc}
                alt={altText}
                className="lightbox-main-image"
              />
            </div>

            {/* ── Metadata panel ─────────────────────────────────── */}
            <div className="lightbox-panel">
              <Dialog.Title className="lightbox-panel-title">
                {selectedImage.filename}
              </Dialog.Title>

              <div className="lightbox-meta-row">
                <span className="lightbox-meta-label">Hoofdstuk</span>
                <span className="lightbox-meta-value">
                  {selectedImage.chapter}
                </span>
              </div>

              <div className="lightbox-meta-row">
                <span className="lightbox-meta-label">Sectie</span>
                <span className="lightbox-meta-value">
                  {selectedImage.section}
                </span>
              </div>

              {selectedImage.description && (
                <div className="lightbox-meta-row">
                  <span className="lightbox-meta-label">Beschrijving</span>
                  <span className="lightbox-meta-value">
                    {selectedImage.description}
                  </span>
                </div>
              )}

              {selectedImage.caption && (
                <div className="lightbox-meta-row">
                  <span className="lightbox-meta-label">Bijschrift</span>
                  <span className="lightbox-meta-value">
                    {selectedImage.caption}
                  </span>
                </div>
              )}

              <div className="lightbox-meta-row">
                <span className="lightbox-meta-label">Positie</span>
                <span className="lightbox-meta-value">
                  {currentIndex + 1} van {items.length} in huidige resultaten
                </span>
              </div>

              {hasAnyAltVersion && (
                <div className="lightbox-meta-row">
                  <span className="lightbox-meta-label">Versies</span>
                  <div className="lightbox-versions-panel">
                    {versionTabs.map((tab) => (
                      <div
                        key={tab.value}
                        className={[
                          "lightbox-versions-panel-item",
                          versionAvailable[tab.value] ? "available" : "missing",
                        ].join(" ")}
                      >
                        <span
                          className="lightbox-versions-panel-dot"
                          aria-hidden="true"
                        />
                        {tab.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="lightbox-meta-row lightbox-form-row">
                <label
                  className="lightbox-meta-label"
                  htmlFor="lightbox-status-select"
                >
                  Status
                </label>
                <Select.Root
                  value={currentStatus}
                  onValueChange={(value) =>
                    setCurrentStatus(value as typeof currentStatus)
                  }
                >
                  <Select.Trigger
                    id="lightbox-status-select"
                    className="lightbox-status-trigger"
                  />
                  <Select.Content>
                    {statusSelectOptions.map((option) => (
                      <Select.Item key={option.value} value={option.value}>
                        {option.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>

              <div className="lightbox-form-row">
                <label
                  className="lightbox-meta-label"
                  htmlFor="lightbox-notes"
                >
                  Notities
                </label>
                <TextArea
                  id="lightbox-notes"
                  name="lightbox-notes"
                  className="lightbox-notes-area"
                  mt="2"
                  placeholder="Voeg productienotities toe"
                  value={currentNotes}
                  resize="vertical"
                  onChange={(event) => setCurrentNotes(event.target.value)}
                />
              </div>
            </div>
          </>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}
