"use client";

import { useParams, notFound } from "next/navigation";
import { ChapterView } from "@/components/ChapterView";
import { getChapter } from "@/data/imageData";

export default function ChapterPage() {
  const params = useParams<{ chapterId: string }>();
  const chapterId = params.chapterId;

  if (!chapterId || !getChapter(chapterId)) {
    notFound();
  }

  return <ChapterView chapterId={chapterId} />;
}
