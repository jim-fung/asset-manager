"use client";

import { useEffect, useState } from "react";

export function useLocalStorageMigration() {
  const [hasMigrated, setHasMigrated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkMigration() {
      try {
        const response = await fetch("/api/auth/migration-status");
        const data = await response.json();
        setHasMigrated(data.migrated);
        
        if (!data.migrated) {
          await performMigration();
        }
      } catch (error) {
        console.error("Failed to check migration status:", error);
      } finally {
        setIsChecking(false);
      }
    }

    async function performMigration() {
      const statusData = localStorage.getItem("iam-status-map");
      const notesData = localStorage.getItem("iam-notes-map");

      if (!statusData && !notesData) {
        setHasMigrated(true);
        return;
      }

      try {
        const formData = new FormData();
        if (statusData) formData.append("statusData", statusData);
        if (notesData) formData.append("notesData", notesData);

        await fetch("/api/actions/migrate", {
          method: "POST",
          body: formData,
        });

        localStorage.removeItem("iam-status-map");
        localStorage.removeItem("iam-notes-map");
        setHasMigrated(true);
      } catch (error) {
        console.error("Migration failed:", error);
      }
    }

    checkMigration();
  }, []);

  return { hasMigrated, isChecking };
}
