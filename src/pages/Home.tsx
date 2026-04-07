import { useAtomValue } from "jotai";
import { activeSectionAtom, selectedChapterAtom } from "@/store/atoms";
import { Layout } from "@/components/Layout";
import { Sidebar } from "@/components/Sidebar";
import { ChapterView } from "@/components/ChapterView";
import { OverviewDashboard } from "@/components/OverviewDashboard";
import { ImageLightbox } from "@/components/ImageLightbox";
import { DigiFilesView } from "@/components/DigiFilesView";

export function HomePage() {
  const activeSection = useAtomValue(activeSectionAtom);
  const selectedChapter = useAtomValue(selectedChapterAtom);

  return (
    <Layout sidebar={<Sidebar />}>
      {activeSection === "digi-files" ? (
        <DigiFilesView />
      ) : selectedChapter ? (
        <ChapterView chapterId={selectedChapter} />
      ) : (
        <OverviewDashboard />
      )}
      <ImageLightbox />
    </Layout>
  );
}
