"use client";

import { useEffect, useRef, useState } from "react";
import { useAtomValue } from "jotai";
import { chapters, images } from "@/data/imageData";
import { statusSelectOptions } from "@/utils/statusConfig";
import { isImageStatus } from "@/utils/typeGuards";
import { useUpdateImageStatus } from "@/hooks/useUpdateImageStatus";
import { useUpdateImageNotes } from "@/hooks/useUpdateImageNotes";
import { useAssignDigiFile, useUnassignDigiFile } from "@/hooks/useAssignmentActions";
import { serverAssignmentsAtom, serverNotesMapAtom, serverStatusMapAtom } from "@/store/serverAtoms";

interface ImageMenuState {
  src: string;
  alt: string;
  x: number;
  y: number;
  imageId: string | null;
  sourceType: "book" | "digi" | null;
}

const UNASSIGNED_CHAPTER = "__none__";
const bookChapterMap = new Map(images.map((image) => [image.id, image.chapterId]));

function deriveImageContextFromSrc(
  src: string,
): { imageId: string | null; sourceType: "book" | "digi" | null } {
  try {
    const url = new URL(src, window.location.origin);
    const parts = url.pathname.split("/").filter(Boolean);
    const previewsIndex = parts.indexOf("previews");
    if (previewsIndex === -1) return { imageId: null, sourceType: null };

    const domain = parts[previewsIndex + 1];
    if (domain === "book") {
      const filename = decodeURIComponent(parts[previewsIndex + 2] ?? "");
      const imageId = filename.replace(/\.[^.]+$/, "");
      return { imageId: imageId || null, sourceType: "book" };
    }

    if (domain === "digi-files") {
      const collectionId = parts[previewsIndex + 2] ?? "";
      const filename = decodeURIComponent(parts[previewsIndex + 3] ?? "");
      if (!collectionId || !filename) return { imageId: null, sourceType: null };
      return { imageId: `${collectionId}__${filename}`, sourceType: "digi" };
    }
  } catch {
    return { imageId: null, sourceType: null };
  }

  return { imageId: null, sourceType: null };
}

export function GlobalImageContextMenu() {
  const [menu, setMenu] = useState<ImageMenuState | null>(null);
  const [draftNote, setDraftNote] = useState("");
  const menuRef = useRef<HTMLDivElement | null>(null);
  const statusMap = useAtomValue(serverStatusMapAtom);
  const notesMap = useAtomValue(serverNotesMapAtom);
  const notesMapRef = useRef(notesMap);
  const assignmentsMap = useAtomValue(serverAssignmentsAtom);
  const updateStatus = useUpdateImageStatus();
  const updateNotes = useUpdateImageNotes();
  const assignDigi = useAssignDigiFile();
  const unassignDigi = useUnassignDigiFile();

  useEffect(() => {
    notesMapRef.current = notesMap;
  }, [notesMap]);

  useEffect(() => {
    const onContextMenu = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const img = target.closest("img");
      if (!(img instanceof HTMLImageElement)) return;
      if (!img.src) return;
      const inferred = deriveImageContextFromSrc(img.src);

      const resolvedImageId = img.dataset.imageId ?? inferred.imageId;
      setDraftNote(resolvedImageId ? (notesMapRef.current[resolvedImageId] ?? "") : "");
      event.preventDefault();
      setMenu({
        src: img.src,
        alt: img.alt || "image",
        x: event.clientX,
        y: event.clientY,
        imageId: resolvedImageId,
        sourceType:
          img.dataset.sourceType === "book" || img.dataset.sourceType === "digi"
            ? img.dataset.sourceType
            : inferred.sourceType,
      });
    };

    const closeMenu = () => setMenu(null);
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (
        menuRef.current &&
        target instanceof Node &&
        menuRef.current.contains(target)
      ) {
        return;
      }
      closeMenu();
    };

    document.addEventListener("contextmenu", onContextMenu, true);
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("scroll", closeMenu, true);
    window.addEventListener("resize", closeMenu);
    window.addEventListener("blur", closeMenu);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("resize", closeMenu);
      window.removeEventListener("blur", closeMenu);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, []);

  if (!menu) return null;

  const imageId = menu.imageId;
  const currentStatus = imageId ? (statusMap[imageId] ?? "unset") : "unset";
  const currentChapterId = imageId
    ? (assignmentsMap[imageId] ?? bookChapterMap.get(imageId) ?? UNASSIGNED_CHAPTER)
    : UNASSIGNED_CHAPTER;

  return (
    <div
      ref={menuRef}
      className="image-context-menu"
      style={{
        left: `max(12px, min(${menu.x}px, calc(100vw - 292px)))`,
        top: `max(12px, min(${menu.y}px, calc(100vh - 432px)))`,
      }}
      role="menu"
      aria-label={`Options for ${menu.alt}`}
    >
      {imageId && (
        <>
          <div className="image-context-menu-section">
            <label className="image-context-menu-label" htmlFor="ctx-chapter">
              Assign to chapter
            </label>
            <select
              id="ctx-chapter"
              className="image-context-menu-select"
              value={currentChapterId}
              onChange={async (event) => {
                const value = event.target.value;
                if (value === UNASSIGNED_CHAPTER) {
                  if (menu.sourceType === "digi") {
                    await unassignDigi(imageId);
                  }
                  return;
                }
                await assignDigi(imageId, value);
              }}
            >
              {menu.sourceType === "digi" && (
                <option value={UNASSIGNED_CHAPTER}>Niet toegewezen</option>
              )}
              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.number !== null ? `${chapter.number}. ` : ""}
                  {chapter.title}
                </option>
              ))}
            </select>
          </div>

          <div className="image-context-menu-section">
            <label className="image-context-menu-label" htmlFor="ctx-status">
              Set status
            </label>
            <select
              id="ctx-status"
              className="image-context-menu-select"
              value={currentStatus}
              onChange={async (event) => {
                const nextStatus = event.target.value;
                if (!isImageStatus(nextStatus)) return;
                await updateStatus(imageId, nextStatus);
              }}
            >
              {statusSelectOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="image-context-menu-section">
            <label className="image-context-menu-label" htmlFor="ctx-note">
              Write note
            </label>
            <textarea
              id="ctx-note"
              className="image-context-menu-notes"
              value={draftNote}
              onChange={(event) => setDraftNote(event.target.value)}
              placeholder="Voeg notitie toe"
            />
            <button
              type="button"
              className="image-context-menu-save"
              onClick={async () => {
                await updateNotes(imageId, draftNote);
                setMenu(null);
              }}
            >
              Save note
            </button>
          </div>
        </>
      )}

      {!imageId && (
        <div className="image-context-menu-section">
          <div className="image-context-menu-hint">
            Could not identify this image for chapter/status/note actions.
          </div>
        </div>
      )}
    </div>
  );
}
