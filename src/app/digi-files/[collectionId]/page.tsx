"use client";

import { useParams, notFound } from "next/navigation";
import { DigiFilesView } from "@/components/DigiFilesView";
import { getCollection } from "@/data/digiFilesData";

export default function CollectionPage() {
  const params = useParams<{ collectionId: string }>();
  const collectionId = params.collectionId;

  if (!collectionId || !getCollection(collectionId)) {
    notFound();
  }

  return <DigiFilesView collectionId={collectionId} />;
}
