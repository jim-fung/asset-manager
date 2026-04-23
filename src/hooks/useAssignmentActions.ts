"use client";

import { useCallback } from "react";
import { useSetAtom } from "jotai";
import { serverAssignmentsAtom } from "@/store/serverAtoms";
import { assignDigiFileToChapter, unassignDigiFile } from "@/app/actions/assignmentActions";

export function useAssignDigiFile() {
  const setAssignments = useSetAtom(serverAssignmentsAtom);

  return useCallback(
    async (digiFileId: string, chapterId: string) => {
      setAssignments((prev) => ({ ...prev, [digiFileId]: chapterId }));
      try {
        const formData = new FormData();
        formData.append("digiFileId", digiFileId);
        formData.append("chapterId", chapterId);
        await assignDigiFileToChapter(formData);
      } catch (error) {
        console.error("Failed to assign digi file to chapter:", error);
      }
    },
    [setAssignments],
  );
}

export function useUnassignDigiFile() {
  const setAssignments = useSetAtom(serverAssignmentsAtom);

  return useCallback(
    async (digiFileId: string) => {
      setAssignments((prev) => {
        const next = { ...prev };
        delete next[digiFileId];
        return next;
      });
      try {
        const formData = new FormData();
        formData.append("digiFileId", digiFileId);
        await unassignDigiFile(formData);
      } catch (error) {
        console.error("Failed to unassign digi file:", error);
      }
    },
    [setAssignments],
  );
}