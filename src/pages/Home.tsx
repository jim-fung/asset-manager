import { useAtomValue } from "jotai";
import { selectedChapterAtom } from "@/store/atoms";
import { Layout } from "@/components/Layout";
import { Sidebar } from "@/components/Sidebar";
import { ChapterView } from "@/components/ChapterView";
import { OverviewDashboard } from "@/components/OverviewDashboard";
import { ImageLightbox } from "@/components/ImageLightbox";

export function HomePage() {
  const selectedChapter = useAtomValue(selectedChapterAtom);

  return (
    <Layout sidebar={<Sidebar />}>
      {selectedChapter ? (
        <ChapterView chapterId={selectedChapter} />
      ) : (
        <OverviewDashboard />
      )}
      <ImageLightbox />
    </Layout>
  );
}
