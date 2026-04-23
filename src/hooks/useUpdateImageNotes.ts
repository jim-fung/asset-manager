"use client";

import { useCallback } from "react";
import { useSetAtom } from "jotai";
import { serverNotesMapAtom } from "@/store/serverAtoms";
import { updateImageNotes } from "@/app/actions/imageActions";

export function useUpdateImageNotes() {
  const setNotesMap = useSetAtom(serverNotesMapAtom);

  return useCallback(
    async (imageId: string, notes: string) => {
      setNotesMap((prev) => ({ ...prev, [imageId]: notes }));
      try {
        const formData = new FormData();
        formData.append("imageId", imageId);
        formData.append("notes", notes);
        await updateImageNotes(formData);
      } catch (error) {
        console.error("Failed to persist image notes:", error);
      }
    },
    [setNotesMap],
  );
}