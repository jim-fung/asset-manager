"use client";

import { Suspense } from "react";
import { DigiFilesView } from "@/components/DigiFilesView";

export default function DigiFilesPage() {
  return (
    <Suspense>
      <DigiFilesView collectionId={null} />
    </Suspense>
  );
}
