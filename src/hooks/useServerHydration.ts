"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSetAtom } from "jotai";
import {
  serverStatusMapAtom,
  serverNotesMapAtom,
  serverAssignmentsAtom,
  serverPreferencesAtom,
  isHydratedAtom,
  hydrationErrorAtom,
} from "@/store/serverAtoms";
import type { ImageStatus } from "@/data/imageData";
import { useLocalStorageMigration } from "./useLocalStorageMigration";

const MAX_RETRIES = 1;
const RETRY_DELAY_MS = 2000;

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
  const setHydrationError = useSetAtom(hydrationErrorAtom);
  const { hasMigrated } = useLocalStorageMigration();
  const retryCount = useRef(0);

  const hydrate = useCallback(async () => {
    retryCount.current = 0;
    let lastError: string | null = null;

    while (retryCount.current <= MAX_RETRIES) {
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
        setHydrationError(null);
        return;
      } catch (error) {
        console.error("Failed to hydrate server data:", error);
        lastError = error instanceof Error ? error.message : String(error);

        if (retryCount.current < MAX_RETRIES) {
          retryCount.current += 1;
          console.warn(`Retrying hydration (attempt ${retryCount.current}/${MAX_RETRIES})...`);
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        } else {
          break;
        }
      }
    }

    setHydrationError(lastError);
  }, [setStatusMap, setNotesMap, setAssignmentsMap, setPreferences, setHydrated, setHydrationError]);

  useEffect(() => {
    if (hasMigrated) {
      hydrate();
    }
  }, [hasMigrated, hydrate]);
}
