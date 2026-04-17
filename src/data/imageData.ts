import { translateArchiveTextToDutch } from "./archiveTextNl";

/** Status of an image in the book production pipeline */
export type ImageStatus = "approved" | "review" | "needs-replacement" | "unset";

/** Version variant of an image asset */
export type ImageVersion = "regular" | "optimized" | "print";

/** The three possible versions of a single image */
export interface ImageVersions {
  /** Canonical served asset - always present */
  regular: string;
  /** Web-optimised export (compressed, resized for screen) */
  optimized?: string;
  /** High-resolution, colour-corrected export ready for print */
  print?: string;
}

/** A single image asset used in the book */
export interface ImageAsset {
  id: string;
  filename: string;
  /** Lightweight preview used for dashboards and grids */
  preview: string;
  /** Canonical src for the lightbox and any consumers that need the served asset */
  src: string;
  /** All available version paths for this image */
  versions: ImageVersions;
  chapter: string;
  chapterId: string;
  section: string;
  caption: string;
  alt: string;
  /** Short description / identification of the image from the book layout */
  description: string;
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
    title: "Voorwoord",
    titleNl: "Voorwoord",
    subtitle: "Openende beschouwingen over Winstons leven en nalatenschap",
    imageCount: 0,
  },
  {
    id: "inleiding",
    number: null,
    title: "Inleiding - Een labyrint van wegen",
    titleNl: "Inleiding - Een labyrint van wegen",
    subtitle: "Een labyrint van paden - de reis begint",
    imageCount: 0,
  },
  {
    id: "hoofdstuk-1",
    number: 1,
    title: "De Kalihna-cultuur",
    titleNl: "De Kalihna Cultuur",
    subtitle:
      "Oorsprong, ceremonies, rituelen, muziek en de rouwtraditie van Epekodonoh",
    imageCount: 0,
  },
  {
    id: "hoofdstuk-2",
    number: 2,
    title: "Kinderjaren tussen werelden",
    titleNl: "Kinderjaren tussen werelden",
    subtitle:
      "Van Calbo naar Paramaribo - pleegmoeders en vroege vorming",
    imageCount: 0,
  },
  {
    id: "hoofdstuk-3",
    number: 3,
    title: "Terug in Suriname",
    titleNl: "Terug in Suriname",
    subtitle: "Opnieuw verbinding maken met wortels en identiteit herontdekken",
    imageCount: 0,
  },
  {
    id: "hoofdstuk-4",
    number: 4,
    title: "Waka Tjopu",
    titleNl: "Waka Tjopu",
    subtitle: "De uitgeholde kano - reizen over de rivieren van Suriname",
    imageCount: 0,
  },
  {
    id: "hoofdstuk-5",
    number: 5,
    title: "Zelfstandig ondernemer, kunstenaar, vriend, docent",
    titleNl: "Zelfstandig ondernemer, kunstenaar, vriend, docent",
    subtitle:
      "Grafisch ontwerp, vriendschappen, de 1492-opdracht en kunst als gemeenschapsdienst",
    imageCount: 0,
  },
  {
    id: "hoofdstuk-6",
    number: 6,
    title: "Op leven en dood",
    titleNl: "Op leven en dood",
    subtitle:
      "Het Monument der Inheemsen, Ingi Sten en Winstons overlijden",
    imageCount: 0,
  },
  {
    id: "epiloog",
    number: null,
    title: "Epiloog - Mijn Epekodonoh",
    titleNl: "Epiloog - Mijn Epekodonoh",
    subtitle: "Julia's afscheidsgedicht - \"Mijn Epekodonoh\"",
    imageCount: 0,
  },
];

function img(
  filename: string,
  chapterId: string,
  section: string,
  caption: string = "",
  alt: string = "",
  description: string = "",
): ImageAsset {
  const preview = `/previews/book/${filename.replace(/\.[^.]+$/, ".jpg")}`;
  return {
    id: filename.replace(/\.\w+$/, ""),
    filename,
    preview,
    src: preview,
    versions: {
      regular: preview,
      // Future alternate variants can still be supplied explicitly if needed.
    },
    chapter: chapters.find((c) => c.id === chapterId)?.title ?? chapterId,
    chapterId,
    section: translateArchiveTextToDutch(section),
    caption: translateArchiveTextToDutch(caption),
    alt: translateArchiveTextToDutch(alt),
    description: translateArchiveTextToDutch(description),
    status: "unset",
    notes: "",
  };
}

/** Complete image registry - every image in the book mapped to its chapter */
export const images: ImageAsset[] = [
  // -- Voorwoord --
  img("image84.jpg", "voorwoord", "Voorwoord", "Winston van der Bok portret", "", "Portrait of Winston van der Bok, 2018"),

  // -- Inleiding --
  img("image21.jpg", "inleiding", "Een labyrint van wegen", "Cover / route visual", "", "The Labyrinth (2018). Acrylic on canvas (80x60cm)"),
  img("image51.jpg", "inleiding", "Een labyrint van wegen", "", "", "Miniature painting from the book layout"),
  img("image92.jpg", "inleiding", "Een labyrint van wegen", "", "", "Werehpai Petroglyph (2018). Acrylic on canvas (90x70cm)"),

  // -- Hoofdstuk 1 - Kalihna Cultuur --
  img("image62.jpg", "hoofdstuk-1", "Hoofdstuk 1 opening", "", "", "The Passage (1998). Acrylic on canvas"),
  img("image93.jpg", "hoofdstuk-1", "The Passage", "The Passage (1998). Acrylic on canvas", "", "The Passage (1998). Acrylic on canvas"),
  img("image45.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "Werehpai Petroglyph (2018). Acrylic on canvas (90x70cm)", "", "1977 - Winston's graphic advertising designs for the tobacco industry"),
  img("image109.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "", "", "Maluana (2021). Natural pigments on wood"),
  img("image33.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "Zoo humain: Les indig?nes des Cara?bes", "Zoo humain : Les indig?nes des Cara?bes au jardin d", "Zoo humain: Les indig?nes des Cara?bes au Jardin d'Acclimatation, Paris (1892)"),
  img("image26.png", "hoofdstuk-1", "Werehpai Petroglyph", "", "", "Pencil drawing by Johan van der Bok (2015)"),
  img("image69.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "", "", "Hope for the Future (2005). Acrylic on canvas (70x100cm)"),
  img("image39.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "", "", "Werehpai Petroglyph site - petroglyphs in the rainforest"),
  img("image38.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "", "", "Old Man (1991). Oil on canvas"),
  img("image89.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "", "", "Children. Pen drawing (1992)"),
  img("image24.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "", "", "Bofroe / Ignatius van der Bok. Oil on canvas (1992)"),
  img("image1.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "", "", "Sambura drum - traditional Kalihna percussion instrument"),
  img("image5.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "", "", "Tante Es en Winston, Paramaribo, 1952"),
  img("image52.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "", "", "Sunflower (2019). Acrylic on canvas (90x70cm)"),
  img("image17.png", "hoofdstuk-1", "Werehpai Petroglyph", "", "", "Stardancers; Defenders of the Amazon; The Guardian"),
  img("image111.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "", "", "Epekodonoh, Galibi 1973"),
  img("image86.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "", "", "Powersigns (2015). Acrylic on wood (75x23cm)"),
  img("image96.png", "hoofdstuk-1", "Asamiya / Mother and Child", "Asamiya (1956)", "", "Asamiya (1956) - Winston's mother, photograph"),
  img("image10.jpg", "hoofdstuk-1", "Asamiya / Mother and Child", "Mother and child (1991). Pen drawing on paper", "", "The Spirit of the Sunflower (2009). Acrylic on canvas"),
  img("image117.jpg", "hoofdstuk-1", "Asamiya / Mother and Child", "Mother and Child, watercolour on paper", "", "Sambura (2007). Acrylic on canvas (114x74cm)"),
  img("image90.jpg", "hoofdstuk-1", "Asamiya / Mother and Child", "", "", "Artwork from the Kalihna culture section"),
  img("image98.jpg", "hoofdstuk-1", "Asamiya / Mother and Child", "", "", "Pet Monkey. Oil on canvas (1992)"),
  img("image32.jpg", "hoofdstuk-1", "Asamiya / Mother and Child", "", "", "Icons (2005). Acrylic on canvas (44x65cm)"),
  img("image130.jpg", "hoofdstuk-1", "Asamiya / Mother and Child", "", "", "Artwork from the Kalihna culture section"),
  img("image58.jpg", "hoofdstuk-1", "Spirit of the Tides", "Spirit of the Tides (2018). Acrylic on canvas (110x70cm)", "", "The Seven Sisters (2017). Acrylic on wood (215x37.5cm)"),
  img("image106.jpg", "hoofdstuk-1", "Spirit of the Tides", "", "", "Norma - portrait, pastel drawing (1973)"),
  img("image31.jpg", "hoofdstuk-1", "Sambura rituelen", "Sambura - het begin van alles", "", "Sambura Players (1992). Oil on canvas"),
  img("image73.jpg", "hoofdstuk-1", "Karawasi", "Karawasi - liederen om te huilen", "", "Dancing Women (2010). Acrylic on canvas"),
  img("image77.jpg", "hoofdstuk-1", "Dans", "Dancing Women (2010). Acrylic on canvas", "", "Dancing Women (2010). Acrylic on canvas"),
  img("image2.jpg", "hoofdstuk-1", "Sambura en Karawasi", "", "", "Book cover design - publication"),
  img("image80.jpg", "hoofdstuk-1", "Sambura en Karawasi", "Maraka", "", "Maraka - traditional Kalihna rattle instrument"),
  img("image112.png", "hoofdstuk-1", "Sambura en Karawasi", "", "", "Dancing Amazonas (1998). Acrylic on board (44x36cm)"),
  img("image120.jpg", "hoofdstuk-1", "Sambura en Karawasi", "", "", "Exhibition announcement poster"),
  img("image123.jpg", "hoofdstuk-1", "Sambura en Karawasi", "", "", "Book cover design - publication"),
  img("image59.jpg", "hoofdstuk-1", "Sambura en Karawasi", "", "", "Dancing Couples (2005). Acrylic on canvas (82x52cm)"),

  // -- Hoofdstuk 2 - Kinderjaren --
  img("image16.jpg", "hoofdstuk-2", "Kinderjaren tussen werelden", "", "", "Asamiya (1956) - Winston's mother, photograph"),
  img("image79.jpg", "hoofdstuk-2", "Kinderjaren tussen werelden", "", "", "Maraka - traditional Kalihna rattle instrument"),
  img("image55.jpg", "hoofdstuk-2", "Kinderjaren tussen werelden", "", "", "Boy and Bird. Acrylic on canvas"),
  img("image57.jpg", "hoofdstuk-2", "Kinderjaren tussen werelden", "", "", "Elselyn Fa-Si-Oen (1956) - Winston's foster mother 'Tante Es'"),
  img("image19.jpg", "hoofdstuk-2", "Kinderjaren tussen werelden", "", "", "Graphic advertising designs for the tobacco industry (1977)"),
  img("image129.jpg", "hoofdstuk-2", "Kinderjaren tussen werelden", "", "", "Spirit of the Tides (2018). Acrylic on canvas (110x70cm)"),
  img("image6.jpg", "hoofdstuk-2", "Tante Es", "Elselyn Fa-Si-Oen en Winston", "", "Elselyn Fa-Si-Oen and Winston - foster mother and son"),
  img("image13.jpg", "hoofdstuk-2", "Tante Es", "", "", "The Flute Player (2001). Acrylic on canvas (95x65cm)"),
  img("image114.jpg", "hoofdstuk-2", "Tante Es", "", "", "Graphic design logos and corporate identity work"),
  img("image127.jpg", "hoofdstuk-2", "Tante Es", "", "", "Photos from Alice Elzinga - Winston in the USA, 1957"),
  img("image64.jpg", "hoofdstuk-2", "Tante Es", "", "", "Paramaribo, 1956 - photo by Tante Es"),
  img("image97.jpg", "hoofdstuk-2", "Tante Es", "", "", "Pet Monkey. Oil on canvas (1992)"),
  img("image128.jpg", "hoofdstuk-2", "Tante Es", "", "", "Winston, 1947 - photo by Tante Es"),
  img("image119.jpg", "hoofdstuk-2", "Tante Es", "", "", "Epekondonoh. Oil on canvas (1992)"),

  // -- Hoofdstuk 3 - Terug in Suriname --
  img("image74.jpg", "hoofdstuk-3", "Terug in Suriname", "", "", "Portrait from the Return to Suriname period"),
  img("image61.png", "hoofdstuk-3", "Terug in Suriname", "", "", "Daily life in the village of Paradijs (Katholieke Illustratie, 1947)"),
  img("image9.png", "hoofdstuk-3", "Terug in Suriname", "", "", "P?yai and Helpers (2017). Acrylic on canvas"),
  img("image103.jpg", "hoofdstuk-3", "Terug in Suriname", "", "", "The Flute Player (2001). Acrylic on canvas (95x65cm)"),
  img("image46.png", "hoofdstuk-3", "Terug in Suriname", "", "", "Artwork from the Return to Suriname period"),
  img("image30.jpg", "hoofdstuk-3", "Terug in Suriname", "", "", "Graphic advertising designs for the tobacco industry (1977)"),
  img("image20.jpg", "hoofdstuk-3", "Terug in Suriname", "", "", "Matrimonium (2011). Acrylic on paper (25x20cm)"),
  img("image100.jpg", "hoofdstuk-3", "Terug in Suriname", "", "", "The Battle (1992). Oil on canvas"),
  img("image25.png", "hoofdstuk-3", "Terug in Suriname", "", "", "Family photo, 1976"),
  img("image107.jpg", "hoofdstuk-3", "Terug in Suriname", "", "", "Norma - portrait, pastel drawing"),
  img("image22.jpg", "hoofdstuk-3", "Terug in Suriname", "", "", "Iveraldo van der Bok - son of Winston, pastel drawing (1980)"),
  img("image28.jpg", "hoofdstuk-3", "Terug in Suriname", "", "", "Iveraldo van der Bok - family portrait"),

  // -- Hoofdstuk 4 - Waka Tjopu --
  img("image60.jpg", "hoofdstuk-4", "Waka Tjopu", "", "", "Artwork from the Waka Tjopu artists collective"),
  img("image37.jpg", "hoofdstuk-4", "Waka Tjopu", "", "", "Kusari - Julius van der Bok (1950). Photograph"),
  img("image71.jpg", "hoofdstuk-4", "Waka Tjopu", "", "", "Cartoon by Steve Ammersingh (1987)"),
  img("image7.jpg", "hoofdstuk-4", "Waka Tjopu", "", "", "Artwork from the Waka Tjopu collective"),
  img("image82.jpg", "hoofdstuk-4", "Waka Tjopu", "", "", "Rhythm of Dancers - painting"),
  img("image102.jpg", "hoofdstuk-4", "Waka Tjopu", "", "", "In the port of Paramaribo - photograph"),
  img("image56.jpg", "hoofdstuk-4", "Waka Tjopu", "", "", "Winston and Ray Daal, 1987"),

  // -- Hoofdstuk 5 - Kunstenaar & Ondernemer --
  img("image99.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Family (1992). Pastel on paper (60x45cm)"),
  img("image27.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Graphic design work - advertisement"),
  img("image91.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Miniature table painting - Hotel Residence Inn commission"),
  img("image49.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Graphic design work - advertisement"),
  img("image81.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Graphic design work - publication"),
  img("image50.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Logos and graphic corporate identity designs"),
  img("image115.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Wodi. Hijaro (1995). Acrylic on canvas (20x20cm)"),
  img("image125.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Book covers - graphic design work"),
  img("image126.png", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Paramaribo, Palmentuin 1953 - photo by Tante Es"),
  img("image12.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Paramaribo, Palmentuin 1953 - photo by Tante Es"),
  img("image3.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Winston van der Bok: Poster 1492-1992"),
  img("image124.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Logos and graphic corporate identity designs"),
  img("image94.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Graphic design work"),
  img("image68.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Graphic design work"),
  img("image75.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Graphic design work"),
  img("image65.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Graphic design work - illustration"),
  img("image47.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Zoo humain: Caribbean Indians exhibited at the Jardin d'Acclimatation, Paris (1892)"),
  img("image88.jpg", "hoofdstuk-5", "5.2 Een onverwachte ontmoeting", "Een onverwachte ontmoeting, een jarenlange vriendschap", "", "An unexpected encounter, a lifelong friendship - portrait photograph"),
  img("image101.jpg", "hoofdstuk-5", "Paranak?r?", "Paranak?r? - de geesten uit de zee", "", "Paranak?r? - de geesten uit de zee (Spirits from the Sea)"),
  img("image36.jpg", "hoofdstuk-5", "500 jaar 'ontdekking'", "De komst van de grote kannibaal", "", "Winston, Waka Tjopu collective - group photograph"),
  img("image4.jpg", "hoofdstuk-5", "Herdenking 1492-1992", "Kuluwayak poster/herdenkingszegel (1992)", "", "Matrimonium (2011). Acrylic on paper (25x20cm)"),
  img("image121.jpg", "hoofdstuk-5", "Herdenking 1492-1992", "", "", "Timespirit (1995). Oil on canvas"),
  img("image23.jpg", "hoofdstuk-5", "Kunst als gemeenschapsdienst", "Vlechtwerk en ritme", "", "Timespirit (1995). Oil on canvas"),
  img("image122.png", "hoofdstuk-5", "Kunst als gemeenschapsdienst", "", "", "Epekondonoh. Oil on canvas (1992)"),
  img("image53.png", "hoofdstuk-5", "Kunst als gemeenschapsdienst", "", "", "Large-format artwork - community service project"),
  img("image8.jpg", "hoofdstuk-5", "Kunst als gemeenschapsdienst", "", "", "Daily life in the village of Paradijs (Katholieke Illustratie, 1947)"),
  img("image42.jpg", "hoofdstuk-5", "Kunst als gemeenschapsdienst", "", "", "Spirits of the Dance (2005). Acrylic on canvas (100x70cm)"),
  img("image67.jpg", "hoofdstuk-5", "Kunst als gemeenschapsdienst", "", "", "Graphic design - community arts project"),
  img("image44.jpg", "hoofdstuk-5", "Kunst als gemeenschapsdienst", "", "", "The Guardian (1998). Acrylic on paper (40x68cm)"),
  img("image54.jpg", "hoofdstuk-5", "Verhalen als grondstof", "Nature Eyes. Acrylic on paper (15x15cm)", "", "Nature Eyes. Acrylic on paper (15x15cm)"),
  img("image105.jpg", "hoofdstuk-5", "Verhalen als grondstof", "", "", "His Masterpiece (2013). Acrylic on canvas (100x120cm)"),
  img("image95.jpg", "hoofdstuk-5", "Levend erfgoed", "", "", "P?yai Maraka (2011). Acrylic on board (45x52cm)"),
  img("image14.jpg", "hoofdstuk-5", "Levend erfgoed", "", "", "Kunstinstallatie met rouw-elementen van Kurt Nahar (2023)"),
  img("image87.jpg", "hoofdstuk-5", "Levend erfgoed", "Spirit of the Waves (2018). Acrylic on canvas (80x60)", "", "Powersigns (2015). Acrylic on wood (75x23cm)"),
  img("image70.jpg", "hoofdstuk-5", "Levend erfgoed", "", "", "Spirit of the Waves (2018). Acrylic on canvas (80x60cm)"),
  img("image83.jpg", "hoofdstuk-5", "Kleuren uit de aarde", "Compositie - licht en donker", "", "Winston van der Bok, 2018 - portrait photograph"),
  img("image63.jpg", "hoofdstuk-5", "Kleuren uit de aarde", "", "", "Rhythm of Dancers - composition, year unknown"),
  img("image116.jpg", "hoofdstuk-5", "Rood - levenskracht", "Rhythm of Dancers", "", "Maiden (2001). Mixed media on paper on canvas (21x20cm)"),
  img("image104.jpg", "hoofdstuk-5", "Rood - levenskracht", "", "", "Nature Eyes. Acrylic on paper (15x15cm)"),
  img("image43.jpg", "hoofdstuk-5", "Rood - levenskracht", "", "", "Artwork from the Red - Life Force section"),
  img("image113.jpg", "hoofdstuk-5", "Spirits of the Dance", "Spirits of the Dance (2005). Acrylic on canvas (100x70cm)", "", "Paramaribo, Palmentuin 1953 - portrait photograph"),
  img("image41.jpg", "hoofdstuk-5", "Spirits of the Dance", "", "", "Artwork from the Spirits of the Dance series"),
  img("image110.png", "hoofdstuk-5", "Spirits of the Dance", "", "", "Mother and Child (1991). Pen drawing on paper"),
  img("image118.jpg", "hoofdstuk-5", "Spirits of the Dance", "", "", "Winston, 1960 - photo by Alice Elzinga"),

  // -- Hoofdstuk 6 - Op leven en dood --
  img("image48.jpg", "hoofdstuk-6", "Op leven en dood", "", "", "Artwork from the Life and Death chapter"),
  img("image40.jpg", "hoofdstuk-6", "Op leven en dood", "", "", "Transformations (2010). Acrylic on canvas (95x66cm)"),
  img("image72.png", "hoofdstuk-6", "Op leven en dood", "", "", "Restaurant Colakreek - mural commission"),
  img("image34.jpg", "hoofdstuk-6", "Op leven en dood", "", "", "Artwork from the Life and Death chapter"),
  img("image66.jpg", "hoofdstuk-6", "Op leven en dood", "", "", "Nurturing Nature (2018). Acrylic on canvas (67x97.5cm)"),
  img("image108.jpg", "hoofdstuk-6", "Op leven en dood", "", "", "Johan van der Bok (2000) - Winston's brother, photograph"),
  img("image11.jpg", "hoofdstuk-6", "Op leven en dood", "The Spirit of the Sunflower (2009). Acrylic on canvas", "", "The Spirit of the Sunflower (2009). Acrylic on canvas"),
  img("image78.jpg", "hoofdstuk-6", "Het Monument der Inheemsen", "Monument der Inheemsen - ontwerp", "", "Girl (1998). Pen Drawing - design sketch"),
  img("image29.jpg", "hoofdstuk-6", "Het Monument der Inheemsen", "Nationaal Monument der Inheemsen - ontwerp Winston", "", "Nationaal Monument der Inheemsen - Winston's design proposal"),
  img("image18.jpg", "hoofdstuk-6", "Nalatenschap", "Image carriers", "", "Alice Elzinga (1956) - Winston's second foster mother"),
  img("image15.jpg", "hoofdstuk-6", "Ingi Sten", "Ingi Sten expositie (2024) - Kurt Nahar curator", "", "Ingi Sten - miniature table painting, Hotel Residence Inn commission"),

  // -- Epiloog --
  img("image35.jpg", "epiloog", "Winston van der Bok overleed op 25 september 2021", "", "", "The Maneater (1992). Oil on canvas"),
  img("image85.jpg", "epiloog", "Winston van der Bok overleed op 25 september 2021", "Brief Arno", "", "Asamiya (1956). Mother and Child, watercolour on paper"),
  img("image76.jpg", "epiloog", "The Last Dance", "The Last Dance (2000). Acrylic on canvas", "", "The Last Dance (2000). Acrylic on canvas"),
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
