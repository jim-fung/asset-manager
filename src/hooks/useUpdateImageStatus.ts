"use client";

import { useCallback } from "react";
import { useSetAtom } from "jotai";
import { serverStatusMapAtom } from "@/store/serverAtoms";
import { updateImageStatus } from "@/app/actions/imageActions";
import type { ImageStatus } from "@/data/imageData";

export function useUpdateImageStatus() {
  const setStatusMap = useSetAtom(serverStatusMapAtom);

  return useCallback(
    async (imageId: string, status: ImageStatus) => {
      setStatusMap((prev) => ({ ...prev, [imageId]: status }));
      try {
        const formData = new FormData();
        formData.append("imageId", imageId);
        formData.append("status", status);
        await updateImageStatus(formData);
      } catch (error) {
        console.error("Failed to persist image status:", error);
      }
    },
    [setStatusMap],
  );
}