import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  activeVersionAtom,
  imageNotesMapAtom,
  imageStatusMapAtom,
  lightboxTriggerIdAtom,
} from "@/store/atoms";
import type { ImageAsset, ImageStatus, ImageVersion } from "@/data/imageData";

interface ImageLightboxProps {
  items: ImageAsset[];
  onRequestClose: () => void;
  onRequestSelectImage: (image: ImageAsset) => void;
  selectedImageId: string | null;
}

const statusOptions: { value: ImageStatus; label: string }[] = [
  { value: "unset", label: "Niet ingesteld" },
  { value: "approved", label: "Goedgekeurd" },
  { value: "review", label: "Te beoordelen" },
  { value: "needs-replacement", label: "Vervangen" },
];

const versionTabs: { value: ImageVersion; label: string; icon: string }[] = [
  { value: "regular", label: "Standaard", icon: "" },
  { value: "optimized", label: "Geoptimaliseerd", icon: "" },
  { value: "print", label: "Drukklaar", icon: "" },
];

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

function getFocusableElements(root: HTMLElement | null): HTMLElement[] {
  if (!root) {
    return [];
  }

  return Array.from(root.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) =>
      !element.hasAttribute("disabled") &&
      element.getAttribute("aria-hidden") !== "true",
  );
}

function isTextInput(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

export function ImageLightbox({
  items,
  onRequestClose,
  onRequestSelectImage,
  selectedImageId,
}: ImageLightboxProps) {
  const [statusMap, setStatusMap] = useAtom(imageStatusMapAtom);
  const [notesMap, setNotesMap] = useAtom(imageNotesMapAtom);
  const [activeVersion, setActiveVersion] = useAtom(activeVersionAtom);
  const lightboxTriggerId = useAtomValue(lightboxTriggerIdAtom);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const fallbackFocusRef = useRef<HTMLElement | null>(null);
  const selectedImage = useMemo(
    () => items.find((item) => item.id === selectedImageId) ?? null,
    [items, selectedImageId],
  );

  const close = useCallback(() => {
    onRequestClose();
  }, [onRequestClose]);

  useEffect(() => {
    if (!selectedImage) {
      return;
    }

    setActiveVersion("regular");
  }, [selectedImage, setActiveVersion]);

  const currentIndex = selectedImage
    ? Math.max(
        items.findIndex((item) => item.id === selectedImage.id),
        0,
      )
    : -1;

  const goTo = useCallback(
    (delta: number) => {
      if (!items.length || currentIndex === -1) {
        return;
      }

      const nextIndex = (currentIndex + delta + items.length) % items.length;
      onRequestSelectImage(items[nextIndex]);
    },
    [currentIndex, items, onRequestSelectImage],
  );

  useEffect(() => {
    if (!selectedImage) {
      return;
    }

    fallbackFocusRef.current =
      (document.activeElement as HTMLElement | null) ?? null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;

      const triggerElement = lightboxTriggerId
        ? (document.getElementById(lightboxTriggerId) as HTMLElement | null)
        : null;

      (triggerElement ?? fallbackFocusRef.current)?.focus?.();
    };
  }, [lightboxTriggerId, selectedImage]);

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key === "Tab") {
        const focusableElements = getFocusableElements(overlayRef.current);

        if (!focusableElements.length) {
          event.preventDefault();
          return;
        }

        const currentElement = document.activeElement as HTMLElement | null;
        const currentPosition = focusableElements.findIndex(
          (element) => element === currentElement,
        );

        if (event.shiftKey) {
          const previousPosition =
            currentPosition <= 0
              ? focusableElements.length - 1
              : currentPosition - 1;
          focusableElements[previousPosition]?.focus();
          event.preventDefault();
          return;
        }

        const nextPosition =
          currentPosition === -1 || currentPosition === focusableElements.length - 1
            ? 0
            : currentPosition + 1;
        focusableElements[nextPosition]?.focus();
        event.preventDefault();
        return;
      }

      if (isTextInput(event.target)) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(-1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(1);
      }
    },
    [close, goTo],
  );

  if (!selectedImage) {
    return null;
  }

  const currentStatus: ImageStatus =
    (statusMap[selectedImage.id] as ImageStatus) ?? "unset";
  const currentNotes = notesMap[selectedImage.id] ?? "";
  const altText =
    selectedImage.alt ||
    selectedImage.description ||
    selectedImage.caption ||
    selectedImage.filename;

  const versionSrc =
    activeVersion === "optimized"
      ? (selectedImage.versions.optimized ?? selectedImage.src)
      : activeVersion === "print"
        ? (selectedImage.versions.print ?? selectedImage.src)
        : selectedImage.src;

  const versionAvailable: Record<ImageVersion, boolean> = {
    regular: true,
    optimized: Boolean(selectedImage.versions.optimized),
    print: Boolean(selectedImage.versions.print),
  };

  const hasAnyAltVersion =
    versionAvailable.optimized || versionAvailable.print;

  return (
    <div
      ref={overlayRef}
      className="lightbox-overlay"
      onClick={close}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label={`Details van ${selectedImage.filename}`}
    >
      <div className="lightbox-content" onClick={(event) => event.stopPropagation()}>
        <button
          ref={closeButtonRef}
          type="button"
          className="lightbox-close"
          onClick={close}
          title="Sluiten (Esc)"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {items.length > 1 && (
          <>
            <button
              type="button"
              className="lightbox-nav prev"
              onClick={(event) => {
                event.stopPropagation();
                goTo(-1);
              }}
              title="Vorige"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              className="lightbox-nav next"
              onClick={(event) => {
                event.stopPropagation();
                goTo(1);
              }}
              title="Volgende"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}

        {hasAnyAltVersion && (
          <div className="lightbox-version-bar">
            {versionTabs.map((tab) => {
              const available = versionAvailable[tab.value];
              return (
                <button
                  key={tab.value}
                  type="button"
                  className={[
                    "lightbox-version-tab",
                    activeVersion === tab.value ? "active" : "",
                    !available ? "disabled" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => available && setActiveVersion(tab.value)}
                  title={
                    available
                      ? `Bekijk versie: ${tab.label}`
                      : `Versie ${tab.label} is nog niet beschikbaar`
                  }
                  disabled={!available}
                  aria-pressed={activeVersion === tab.value}
                >
                  <span className="lightbox-version-tab-icon" aria-hidden="true">
                    {tab.icon}
                  </span>
                  {tab.label}
                  {!available && (
                    <span className="lightbox-version-tab-badge" aria-hidden="true"></span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <img
          key={`${selectedImage.id}-${activeVersion}`}
          src={versionSrc}
          alt={altText}
          className="lightbox-main-image"
        />
      </div>

      <div className="lightbox-panel" onClick={(event) => event.stopPropagation()}>
        <h2 className="lightbox-panel-title">{selectedImage.filename}</h2>

        <div className="lightbox-meta-row">
          <span className="lightbox-meta-label">Hoofdstuk</span>
          <span className="lightbox-meta-value">{selectedImage.chapter}</span>
        </div>

        <div className="lightbox-meta-row">
          <span className="lightbox-meta-label">Sectie</span>
          <span className="lightbox-meta-value">{selectedImage.section}</span>
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
                  <span className="lightbox-versions-panel-dot" aria-hidden="true" />
                  {tab.label}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="lightbox-meta-row lightbox-form-row">
          <label className="lightbox-meta-label" htmlFor="lightbox-status-select">
            Status
          </label>
          <select
            id="lightbox-status-select"
            name="lightbox-status"
            className="lightbox-status-select"
            value={currentStatus}
            onChange={(event) =>
              setStatusMap((prev) => ({
                ...prev,
                [selectedImage.id]: event.target.value as ImageStatus,
              }))
            }
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="lightbox-form-row">
          <label className="lightbox-meta-label" htmlFor="lightbox-notes">
            Notities
          </label>
          <textarea
            id="lightbox-notes"
            name="lightbox-notes"
            className="lightbox-notes-area"
            placeholder="Voeg productienotities toe"
            value={currentNotes}
            onChange={(event) =>
              setNotesMap((prev) => ({
                ...prev,
                [selectedImage.id]: event.target.value,
              }))
            }
          />
        </div>
      </div>
    </div>
  );
}
