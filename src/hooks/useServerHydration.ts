"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import {
  serverStatusMapAtom,
  serverNotesMapAtom,
  serverAssignmentsAtom,
  serverPreferencesAtom,
  isHydratedAtom,
} from "@/store/serverAtoms";
import { ImageStatus } from "@/data/imageData";
import { useLocalStorageMigration } from "./useLocalStorageMigration";

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Fetch ${url} failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export function useServerHydration() {
  const setStatusMap = useSetAtom(serverStatusMapAtom);
  const setNotesMap = useSetAtom(serverNotesMapAtom);
  const setAssignmentsMap = useSetAtom(serverAssignmentsAtom);
  const setPreferences = useSetAtom(serverPreferencesAtom);
  const setHydrated = useSetAtom(isHydratedAtom);
  const { hasMigrated } = useLocalStorageMigration();

  useEffect(() => {
    async function hydrate() {
      try {
        const [statuses, notes, assignments, preferences] = await Promise.all([
          fetchJSON<Record<string, ImageStatus>>("/api/user/statuses"),
          fetchJSON<Record<string, string>>("/api/user/notes"),
          fetchJSON<Record<string, string>>("/api/user/assignments"),
          fetchJSON<Record<string, string>>("/api/user/preferences"),
        ]);

        setStatusMap(statuses);
        setNotesMap(notes);
        setAssignmentsMap(assignments);
        setPreferences(preferences);
        setHydrated(true);
      } catch (error) {
        console.error("Failed to hydrate server data:", error);
      }
    }

    if (hasMigrated) {
      hydrate();
    }
  }, [hasMigrated, setStatusMap, setNotesMap, setAssignmentsMap, setPreferences, setHydrated]);
}
