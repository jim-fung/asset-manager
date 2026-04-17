import { Navigate, Route, Routes, useParams } from "react-router";
import { Theme } from "@radix-ui/themes";
import { AppShell } from "@/components/AppShell";
import { ChapterView } from "@/components/ChapterView";
import { DigiFilesView } from "@/components/DigiFilesView";
import { getCollection } from "@/data/digiFilesData";
import { getChapter } from "@/data/imageData";
import { HomePage } from "@/pages/Home";
import { NotFoundPage } from "@/pages/NotFound";

function ChapterRoute() {
  const { chapterId } = useParams();

  if (!chapterId || !getChapter(chapterId)) {
    return <NotFoundPage />;
  }

  return <ChapterView chapterId={chapterId} />;
}

function DigiFilesRoute() {
  const { collectionId } = useParams();

  if (collectionId && !getCollection(collectionId)) {
    return <NotFoundPage />;
  }

  return <DigiFilesView collectionId={collectionId ?? null} />;
}

export function App() {
  return (
    <Theme appearance="light" accentColor="sky" grayColor="slate" radius="small" scaling="100%">
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/book" element={<Navigate to="/" replace />} />
          <Route path="/book/:chapterId" element={<ChapterRoute />} />
          <Route path="/digi-files" element={<DigiFilesRoute />} />
          <Route path="/digi-files/:collectionId" element={<DigiFilesRoute />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Theme>
  );
}
