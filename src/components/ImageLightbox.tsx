"use client";

import { useMemo } from "react";
import { PhotoSlider } from "react-photo-view";
import type { DataType } from "react-photo-view/dist/types";
import { useAtomValue } from "jotai";
import { lightboxTriggerIdAtom } from "@/store/atoms";
import type { ServerImageViewModel } from "@/types/server";

interface ImageLightboxProps {
  items: readonly ServerImageViewModel[];
  onRequestClose: () => void;
  onRequestSelectImage: (image: ServerImageViewModel) => void;
  selectedImageId: string | null;
  onAssignDigiFile?: (digiFileId: string, chapterId: string | null) => void;
}

export function ImageLightbox({
  items,
  onRequestClose,
  onRequestSelectImage,
  selectedImageId,
}: ImageLightboxProps) {
  const lightboxTriggerId = useAtomValue(lightboxTriggerIdAtom);

  const images = useMemo<DataType[]>(
    () =>
      items.map((item) => ({
        key: item.id,
        src: item.src,
      })),
    [items],
  );

  const currentIndex = useMemo(() => {
    if (!selectedImageId) return -1;
    return items.findIndex((item) => item.id === selectedImageId);
  }, [items, selectedImageId]);

  return (
    <PhotoSlider
      images={images}
      visible={currentIndex >= 0}
      onClose={() => {
        onRequestClose();
        const triggerElement = lightboxTriggerId
          ? (document.getElementById(lightboxTriggerId) as HTMLElement | null)
          : null;
        triggerElement?.focus();
      }}
      index={Math.max(currentIndex, 0)}
      onIndexChange={(index) => {
        const next = items[index];
        if (next) onRequestSelectImage(next);
      }}
      loop={items.length > 1}
      maskClosable
    />
  );
}
