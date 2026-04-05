/** Status of an image in the book production pipeline */
export type ImageStatus = "approved" | "review" | "needs-replacement" | "unset";

/** A single image asset used in the book */
export interface ImageAsset {
  id: string;
  filename: string;
  src: string;
  chapter: string;
  chapterId: string;
  section: string;
  caption: string;
  alt: string;
  status: ImageStatus;
  notes: string;
}

/** A chapter/section of the book */
export interface Chapter {
  id: string;
  number: number | null;
  title: string;
  titleNl: string;
  subtitle: string;
  imageCount: number;
}

/** All chapters in the book */
export const chapters: Chapter[] = [
  {
    id: "voorwoord",
    number: null,
    title: "Foreword",
    titleNl: "Voorwoord",
    subtitle: "Opening reflections on Winston's life and legacy",
    imageCount: 0,
  },
  {
    id: "inleiding",
    number: null,
    title: "Introduction",
    titleNl: "Inleiding – Een labyrint van wegen",
    subtitle: "A labyrinth of paths — the journey begins",
    imageCount: 0,
  },
  {
    id: "hoofdstuk-1",
    number: 1,
    title: "The Kalihna Culture",
    titleNl: "De Kalihna Cultuur",
    subtitle:
      "Origins, ceremonies, rituals, music, and the Epekodonoh mourning tradition",
    imageCount: 0,
  },
  {
    id: "hoofdstuk-2",
    number: 2,
    title: "Childhood Between Worlds",
    titleNl: "Kinderjaren tussen werelden",
    subtitle:
      "From Calbo to Paramaribo — foster mothers and early formation",
    imageCount: 0,
  },
  {
    id: "hoofdstuk-3",
    number: 3,
    title: "Return to Suriname",
    titleNl: "Terug in Suriname",
    subtitle: "Reconnecting with roots and rediscovering identity",
    imageCount: 0,
  },
  {
    id: "hoofdstuk-4",
    number: 4,
    title: "Waka Tjopu",
    titleNl: "Waka Tjopu",
    subtitle: "The dugout canoe — journeys on the rivers of Suriname",
    imageCount: 0,
  },
  {
    id: "hoofdstuk-5",
    number: 5,
    title: "Artist & Entrepreneur",
    titleNl: "Zelfstandig ondernemer, kunstenaar, vriend, docent",
    subtitle:
      "Graphic design, friendships, the 1492 commission, and art as community service",
    imageCount: 0,
  },
  {
    id: "hoofdstuk-6",
    number: 6,
    title: "Life and Death",
    titleNl: "Op leven en dood",
    subtitle:
      "The Monument of the Indigenous Peoples, Ingi Sten, and Winston's passing",
    imageCount: 0,
  },
  {
    id: "epiloog",
    number: null,
    title: "Epilogue",
    titleNl: "Epiloog – Mijn Epekodonoh",
    subtitle: "Julia's farewell poem — \"My Epekodonoh\"",
    imageCount: 0,
  },
];

function img(
  filename: string,
  chapterId: string,
  section: string,
  caption: string = "",
  alt: string = "",
): ImageAsset {
  return {
    id: filename.replace(/\.\w+$/, ""),
    filename,
    src: `/images/book/${filename}`,
    chapter: chapters.find((c) => c.id === chapterId)?.title ?? chapterId,
    chapterId,
    section,
    caption,
    alt,
    status: "unset",
    notes: "",
  };
}

/** Complete image registry — every image in the book mapped to its chapter */
export const images: ImageAsset[] = [
  // ── Voorwoord ──────────────────────────────────────────
  img("image84.jpg", "voorwoord", "Voorwoord", "Winston van der Bok portret"),

  // ── Inleiding ──────────────────────────────────────────
  img("image21.jpg", "inleiding", "Een labyrint van wegen", "Cover / route visual"),
  img("image51.jpg", "inleiding", "Een labyrint van wegen"),
  img("image92.jpg", "inleiding", "Een labyrint van wegen"),

  // ── Hoofdstuk 1 — Kalihna Cultuur ──────────────────────
  img("image62.jpg", "hoofdstuk-1", "Hoofdstuk 1 opening"),
  img("image93.jpg", "hoofdstuk-1", "The Passage", "The Passage (1998). Acrylic on canvas"),
  img("image45.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "Werehpai Petroglyph (2018). Acrylic on canvas (90×70cm)"),
  img("image109.jpg", "hoofdstuk-1", "Werehpai Petroglyph"),
  img("image33.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "Zoo humain: Les indigènes des Caraïbes", "Zoo humain : Les indigènes des Caraïbes au jardin d"),
  img("image26.png", "hoofdstuk-1", "Werehpai Petroglyph"),
  img("image69.jpg", "hoofdstuk-1", "Werehpai Petroglyph"),
  img("image39.jpg", "hoofdstuk-1", "Werehpai Petroglyph"),
  img("image38.jpg", "hoofdstuk-1", "Werehpai Petroglyph"),
  img("image89.jpg", "hoofdstuk-1", "Werehpai Petroglyph"),
  img("image24.jpg", "hoofdstuk-1", "Werehpai Petroglyph"),
  img("image1.jpg", "hoofdstuk-1", "Werehpai Petroglyph"),
  img("image5.jpg", "hoofdstuk-1", "Werehpai Petroglyph"),
  img("image52.jpg", "hoofdstuk-1", "Werehpai Petroglyph"),
  img("image17.png", "hoofdstuk-1", "Werehpai Petroglyph"),
  img("image111.jpg", "hoofdstuk-1", "Werehpai Petroglyph"),
  img("image86.jpg", "hoofdstuk-1", "Werehpai Petroglyph"),
  img("image96.png", "hoofdstuk-1", "Asamiya / Mother and Child", "Asamiya (1956)"),
  img("image10.jpg", "hoofdstuk-1", "Asamiya / Mother and Child", "Mother and child (1991). Pen drawing on paper"),
  img("image117.jpg", "hoofdstuk-1", "Asamiya / Mother and Child", "Mother and Child, watercolour on paper"),
  img("image90.jpg", "hoofdstuk-1", "Asamiya / Mother and Child"),
  img("image98.jpg", "hoofdstuk-1", "Asamiya / Mother and Child"),
  img("image32.jpg", "hoofdstuk-1", "Asamiya / Mother and Child"),
  img("image130.jpg", "hoofdstuk-1", "Asamiya / Mother and Child"),
  img("image58.jpg", "hoofdstuk-1", "Spirit of the Tides", "Spirit of the Tides (2018). Acrylic on canvas (110×70cm)"),
  img("image106.jpg", "hoofdstuk-1", "Spirit of the Tides"),
  img("image31.jpg", "hoofdstuk-1", "Sambura rituelen", "Sambura — het begin van alles"),
  img("image73.jpg", "hoofdstuk-1", "Karawasi", "Karawasi — liederen om te huilen"),
  img("image77.jpg", "hoofdstuk-1", "Dans", "Dancing Women (2010). Acrylic on canvas"),
  img("image2.jpg", "hoofdstuk-1", "Sambura en Karawasi"),
  img("image80.jpg", "hoofdstuk-1", "Sambura en Karawasi", "Maraka"),
  img("image112.png", "hoofdstuk-1", "Sambura en Karawasi"),
  img("image120.jpg", "hoofdstuk-1", "Sambura en Karawasi"),
  img("image123.jpg", "hoofdstuk-1", "Sambura en Karawasi"),
  img("image59.jpg", "hoofdstuk-1", "Sambura en Karawasi"),

  // ── Hoofdstuk 2 — Kinderjaren ──────────────────────────
  img("image16.jpg", "hoofdstuk-2", "Kinderjaren tussen werelden"),
  img("image79.jpg", "hoofdstuk-2", "Kinderjaren tussen werelden"),
  img("image55.jpg", "hoofdstuk-2", "Kinderjaren tussen werelden"),
  img("image57.jpg", "hoofdstuk-2", "Kinderjaren tussen werelden"),
  img("image19.jpg", "hoofdstuk-2", "Kinderjaren tussen werelden"),
  img("image129.jpg", "hoofdstuk-2", "Kinderjaren tussen werelden"),
  img("image6.jpg", "hoofdstuk-2", "Tante Es", "Elselyn Fa-Si-Oen en Winston"),
  img("image13.jpg", "hoofdstuk-2", "Tante Es"),
  img("image114.jpg", "hoofdstuk-2", "Tante Es"),
  img("image127.jpg", "hoofdstuk-2", "Tante Es"),
  img("image64.jpg", "hoofdstuk-2", "Tante Es"),
  img("image97.jpg", "hoofdstuk-2", "Tante Es"),
  img("image128.jpg", "hoofdstuk-2", "Tante Es"),
  img("image119.jpg", "hoofdstuk-2", "Tante Es"),

  // ── Hoofdstuk 3 — Terug in Suriname ────────────────────
  img("image74.jpg", "hoofdstuk-3", "Terug in Suriname"),
  img("image61.png", "hoofdstuk-3", "Terug in Suriname"),
  img("image9.png", "hoofdstuk-3", "Terug in Suriname"),
  img("image103.jpg", "hoofdstuk-3", "Terug in Suriname"),
  img("image46.png", "hoofdstuk-3", "Terug in Suriname"),
  img("image30.jpg", "hoofdstuk-3", "Terug in Suriname"),
  img("image20.jpg", "hoofdstuk-3", "Terug in Suriname"),
  img("image100.jpg", "hoofdstuk-3", "Terug in Suriname"),
  img("image25.png", "hoofdstuk-3", "Terug in Suriname"),
  img("image107.jpg", "hoofdstuk-3", "Terug in Suriname"),
  img("image22.jpg", "hoofdstuk-3", "Terug in Suriname"),
  img("image28.jpg", "hoofdstuk-3", "Terug in Suriname"),

  // ── Hoofdstuk 4 — Waka Tjopu ───────────────────────────
  img("image60.jpg", "hoofdstuk-4", "Waka Tjopu"),
  img("image37.jpg", "hoofdstuk-4", "Waka Tjopu"),
  img("image71.jpg", "hoofdstuk-4", "Waka Tjopu"),
  img("image7.jpg", "hoofdstuk-4", "Waka Tjopu"),
  img("image82.jpg", "hoofdstuk-4", "Waka Tjopu"),
  img("image102.jpg", "hoofdstuk-4", "Waka Tjopu"),
  img("image56.jpg", "hoofdstuk-4", "Waka Tjopu"),

  // ── Hoofdstuk 5 — Kunstenaar & Ondernemer ──────────────
  img("image99.jpg", "hoofdstuk-5", "Zelfstandig ondernemer"),
  img("image27.jpg", "hoofdstuk-5", "Zelfstandig ondernemer"),
  img("image91.jpg", "hoofdstuk-5", "Zelfstandig ondernemer"),
  img("image49.jpg", "hoofdstuk-5", "Zelfstandig ondernemer"),
  img("image81.jpg", "hoofdstuk-5", "Zelfstandig ondernemer"),
  img("image50.jpg", "hoofdstuk-5", "Zelfstandig ondernemer"),
  img("image115.jpg", "hoofdstuk-5", "Zelfstandig ondernemer"),
  img("image125.jpg", "hoofdstuk-5", "Zelfstandig ondernemer"),
  img("image126.png", "hoofdstuk-5", "Zelfstandig ondernemer"),
  img("image12.jpg", "hoofdstuk-5", "Zelfstandig ondernemer"),
  img("image3.jpg", "hoofdstuk-5", "Zelfstandig ondernemer"),
  img("image124.jpg", "hoofdstuk-5", "Zelfstandig ondernemer"),
  img("image94.jpg", "hoofdstuk-5", "Zelfstandig ondernemer"),
  img("image68.jpg", "hoofdstuk-5", "Zelfstandig ondernemer"),
  img("image75.jpg", "hoofdstuk-5", "Zelfstandig ondernemer"),
  img("image65.jpg", "hoofdstuk-5", "Zelfstandig ondernemer"),
  img("image47.jpg", "hoofdstuk-5", "Zelfstandig ondernemer"),
  img("image88.jpg", "hoofdstuk-5", "5.2 Een onverwachte ontmoeting", "Een onverwachte ontmoeting, een jarenlange vriendschap"),
  img("image101.jpg", "hoofdstuk-5", "Paranakïrï", "Paranakïrï — de geesten uit de zee"),
  img("image36.jpg", "hoofdstuk-5", "500 jaar 'ontdekking'", "De komst van de grote kannibaal"),
  img("image4.jpg", "hoofdstuk-5", "Herdenking 1492–1992", "Kuluwayak poster/herdenkingszegel (1992)"),
  img("image121.jpg", "hoofdstuk-5", "Herdenking 1492–1992"),
  img("image23.jpg", "hoofdstuk-5", "Kunst als gemeenschapsdienst", "Vlechtwerk en ritme"),
  img("image122.png", "hoofdstuk-5", "Kunst als gemeenschapsdienst"),
  img("image53.png", "hoofdstuk-5", "Kunst als gemeenschapsdienst"),
  img("image8.jpg", "hoofdstuk-5", "Kunst als gemeenschapsdienst"),
  img("image42.jpg", "hoofdstuk-5", "Kunst als gemeenschapsdienst"),
  img("image67.jpg", "hoofdstuk-5", "Kunst als gemeenschapsdienst"),
  img("image44.jpg", "hoofdstuk-5", "Kunst als gemeenschapsdienst"),
  img("image54.jpg", "hoofdstuk-5", "Verhalen als grondstof", "Nature Eyes. Acrylic on paper (15×15cm)"),
  img("image105.jpg", "hoofdstuk-5", "Verhalen als grondstof"),
  img("image95.jpg", "hoofdstuk-5", "Levend erfgoed"),
  img("image14.jpg", "hoofdstuk-5", "Levend erfgoed"),
  img("image87.jpg", "hoofdstuk-5", "Levend erfgoed", "Spirit of the Waves (2018). Acrylic on canvas (80×60)"),
  img("image70.jpg", "hoofdstuk-5", "Levend erfgoed"),
  img("image83.jpg", "hoofdstuk-5", "Kleuren uit de aarde", "Compositie — licht en donker"),
  img("image63.jpg", "hoofdstuk-5", "Kleuren uit de aarde"),
  img("image116.jpg", "hoofdstuk-5", "Rood — levenskracht", "Rhythm of Dancers"),
  img("image104.jpg", "hoofdstuk-5", "Rood — levenskracht"),
  img("image43.jpg", "hoofdstuk-5", "Rood — levenskracht"),
  img("image113.jpg", "hoofdstuk-5", "Spirits of the Dance", "Spirits of the Dance (2005). Acrylic on canvas (100×70cm)"),
  img("image41.jpg", "hoofdstuk-5", "Spirits of the Dance"),
  img("image110.png", "hoofdstuk-5", "Spirits of the Dance"),
  img("image118.jpg", "hoofdstuk-5", "Spirits of the Dance"),

  // ── Hoofdstuk 6 — Op leven en dood ─────────────────────
  img("image48.jpg", "hoofdstuk-6", "Op leven en dood"),
  img("image40.jpg", "hoofdstuk-6", "Op leven en dood"),
  img("image72.png", "hoofdstuk-6", "Op leven en dood"),
  img("image34.jpg", "hoofdstuk-6", "Op leven en dood"),
  img("image66.jpg", "hoofdstuk-6", "Op leven en dood"),
  img("image108.jpg", "hoofdstuk-6", "Op leven en dood"),
  img("image11.jpg", "hoofdstuk-6", "Op leven en dood", "The Spirit of the Sunflower (2009). Acrylic on canvas"),
  img("image78.jpg", "hoofdstuk-6", "Het Monument der Inheemsen", "Monument der Inheemsen — ontwerp"),
  img("image29.jpg", "hoofdstuk-6", "Het Monument der Inheemsen", "Nationaal Monument der Inheemsen — ontwerp Winston"),
  img("image18.jpg", "hoofdstuk-6", "Nalatenschap", "Image carriers"),
  img("image15.jpg", "hoofdstuk-6", "Ingi Sten", "Ingi Sten expositie (2024) — Kurt Nahar curator"),

  // ── Epiloog ────────────────────────────────────────────
  img("image35.jpg", "epiloog", "Winston van der Bok overleed op 25 september 2021"),
  img("image85.jpg", "epiloog", "Winston van der Bok overleed op 25 september 2021", "Brief Arno"),
  img("image76.jpg", "epiloog", "The Last Dance", "The Last Dance (2000). Acrylic on canvas"),
];

// Compute image counts per chapter
chapters.forEach((ch) => {
  ch.imageCount = images.filter((img) => img.chapterId === ch.id).length;
});

/** Get images for a specific chapter */
export function getChapterImages(chapterId: string): ImageAsset[] {
  return images.filter((img) => img.chapterId === chapterId);
}

/** Get a chapter by its ID */
export function getChapter(chapterId: string): Chapter | undefined {
  return chapters.find((c) => c.id === chapterId);
}

/** Search images by query (matches filename, caption, section, chapter) */
export function searchImages(query: string): ImageAsset[] {
  const q = query.toLowerCase();
  return images.filter(
    (img) =>
      img.filename.toLowerCase().includes(q) ||
      img.caption.toLowerCase().includes(q) ||
      img.section.toLowerCase().includes(q) ||
      img.chapter.toLowerCase().includes(q) ||
      img.notes.toLowerCase().includes(q),
  );
}

/** Get images filtered by status */
export function getImagesByStatus(status: ImageStatus): ImageAsset[] {
  return images.filter((img) => img.status === status);
}

/** Stats summary */
export function getStats() {
  return {
    totalImages: images.length,
    totalChapters: chapters.length,
    byStatus: {
      approved: images.filter((i) => i.status === "approved").length,
      review: images.filter((i) => i.status === "review").length,
      "needs-replacement": images.filter((i) => i.status === "needs-replacement").length,
      unset: images.filter((i) => i.status === "unset").length,
    },
    byChapter: chapters.map((ch) => ({
      id: ch.id,
      title: ch.title,
      count: ch.imageCount,
    })),
  };
}
