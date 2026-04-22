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
import { useLocalStorageMigration } from "./useLocalStorageMigration";

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
          fetch("/api/user/statuses").then((r) => r.json()),
          fetch("/api/user/notes").then((r) => r.json()),
          fetch("/api/user/assignments").then((r) => r.json()),
          fetch("/api/user/preferences").then((r) => r.json()),
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
