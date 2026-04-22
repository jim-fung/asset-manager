import { translateArchiveTextToDutch } from "./archiveTextNl";

/** Status of an image in the book production pipeline */
export type ImageStatus = "approved" | "review" | "needs-replacement" | "unset";

/** Version variant of an image asset */
export type ImageVersion = "regular" | "optimized" | "print";

/** The three possible versions of a single image */
export interface ImageVersions {
  /** Canonical served asset - always present */
  readonly regular: string;
  /** Web-optimised export (compressed, resized for screen) */
  readonly optimized?: string;
  /** High-resolution, colour-corrected export ready for print */
  readonly print?: string;
}

/** A single image asset used in the book */
export interface ImageAsset {
  readonly id: string;
  readonly filename: string;
  /** Lightweight preview used for dashboards and grids */
  readonly preview: string;
  /** Canonical src for the lightbox and any consumers that need the served asset */
  readonly src: string;
  /** All available version paths for this image */
  readonly versions: ImageVersions;
  readonly chapter: string;
  readonly chapterId: string;
  readonly section: string;
  readonly caption: string;
  readonly alt: string;
  /** Short description / identification of the image from the book layout */
  readonly description: string;
}

/** A chapter/section of the book */
export interface Chapter {
  readonly id: string;
  readonly number: number | null;
  readonly title: string;
  readonly titleNl: string;
  readonly subtitle: string;
  readonly imageCount: number;
}

/** Raw chapter definitions without computed imageCount */
const rawChapters: readonly Omit<Chapter, "imageCount">[] = [
  {
    id: "voorwoord",
    number: null,
    title: "Voorwoord",
    titleNl: "Voorwoord",
    subtitle: "Openende beschouwingen over Winstons leven en nalatenschap",
  },
  {
    id: "inleiding",
    number: null,
    title: "Inleiding - Een labyrint van wegen",
    titleNl: "Inleiding - Een labyrint van wegen",
    subtitle: "Een labyrint van paden - de reis begint",
  },
  {
    id: "hoofdstuk-1",
    number: 1,
    title: "De Kalihna-cultuur",
    titleNl: "De Kalihna Cultuur",
    subtitle:
      "Oorsprong, ceremonies, rituelen, muziek en de rouwtraditie van Epekodonoh",
  },
  {
    id: "hoofdstuk-2",
    number: 2,
    title: "Kinderjaren tussen werelden",
    titleNl: "Kinderjaren tussen werelden",
    subtitle:
      "Van Calbo naar Paramaribo - pleegmoeders en vroege vorming",
  },
  {
    id: "hoofdstuk-3",
    number: 3,
    title: "Terug in Suriname",
    titleNl: "Terug in Suriname",
    subtitle: "Opnieuw verbinding maken met wortels en identiteit herontdekken",
  },
  {
    id: "hoofdstuk-4",
    number: 4,
    title: "Waka Tjopu",
    titleNl: "Waka Tjopu",
    subtitle: "De uitgeholde kano - reizen over de rivieren van Suriname",
  },
  {
    id: "hoofdstuk-5",
    number: 5,
    title: "Zelfstandig ondernemer, kunstenaar, vriend, docent",
    titleNl: "Zelfstandig ondernemer, kunstenaar, vriend, docent",
    subtitle:
      "Grafisch ontwerp, vriendschappen, de 1492-opdracht en kunst als gemeenschapsdienst",
  },
  {
    id: "hoofdstuk-6",
    number: 6,
    title: "Op leven en dood",
    titleNl: "Op leven en dood",
    subtitle:
      "Het Monument der Inheemsen, Ingi Sten en Winstons overlijden",
  },
  {
    id: "epiloog",
    number: null,
    title: "Epiloog - Mijn Epekodonoh",
    titleNl: "Epiloog - Mijn Epekodonoh",
    subtitle: "Julia's afscheidsgedicht - \"Mijn Epekodonoh\"",
  },
];

/**
 * Construct an ImageAsset from its components.
 * Accepts the chapter list explicitly to avoid hidden closure dependencies.
 */
function img(
  chapterList: readonly Omit<Chapter, "imageCount">[],
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
      // TODO: Supply optimized and print variants when they become available.
      // For now, the lightbox will fall back to `src` if these are undefined.
    },
    chapter: chapterList.find((c) => c.id === chapterId)?.title ?? chapterId,
    chapterId,
    section: translateArchiveTextToDutch(section),
    caption: translateArchiveTextToDutch(caption),
    alt: translateArchiveTextToDutch(alt),
    description: translateArchiveTextToDutch(description),
  };
}

/** Complete image registry - every image in the book mapped to its chapter */
export const images: readonly ImageAsset[] = [
  // -- Voorwoord --
  img(rawChapters, "image84.jpg", "voorwoord", "Voorwoord", "Winston van der Bok portret", "", "Portrait of Winston van der Bok, 2018"),

  // -- Inleiding --
  img(rawChapters, "image21.jpg", "inleiding", "Een labyrint van wegen", "Cover / route visual", "", "The Labyrinth (2018). Acrylic on canvas (80x60cm)"),
  img(rawChapters, "image51.jpg", "inleiding", "Een labyrint van wegen", "", "", "Miniature painting from the book layout"),
  img(rawChapters, "image92.jpg", "inleiding", "Een labyrint van wegen", "", "", "Werehpai Petroglyph (2018). Acrylic on canvas (90x70cm)"),

  // -- Hoofdstuk 1 - Kalihna Cultuur --
  img(rawChapters, "image62.jpg", "hoofdstuk-1", "Hoofdstuk 1 opening", "", "", "The Passage (1998). Acrylic on canvas"),
  img(rawChapters, "image93.jpg", "hoofdstuk-1", "The Passage", "The Passage (1998). Acrylic on canvas", "", "The Passage (1998). Acrylic on canvas"),
  img(rawChapters, "image45.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "Werehpai Petroglyph (2018). Acrylic on canvas (90x70cm)", "", "1977 - Winston's graphic advertising designs for the tobacco industry"),
  img(rawChapters, "image109.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "", "", "Maluana (2021). Natural pigments on wood"),
  img(rawChapters, "image33.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "Zoo humain: Les indig?nes des Cara?bes", "Zoo humain : Les indig?nes des Cara?bes au jardin d", "Zoo humain: Les indig?nes des Cara?bes au Jardin d'Acclimatation, Paris (1892)"),
  img(rawChapters, "image26.png", "hoofdstuk-1", "Werehpai Petroglyph", "", "", "Pencil drawing by Johan van der Bok (2015)"),
  img(rawChapters, "image69.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "", "", "Hope for the Future (2005). Acrylic on canvas (70x100cm)"),
  img(rawChapters, "image39.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "", "", "Werehpai Petroglyph site - petroglyphs in the rainforest"),
  img(rawChapters, "image38.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "", "", "Old Man (1991). Oil on canvas"),
  img(rawChapters, "image89.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "", "", "Children. Pen drawing (1992)"),
  img(rawChapters, "image24.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "", "", "Bofroe / Ignatius van der Bok. Oil on canvas (1992)"),
  img(rawChapters, "image1.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "", "", "Sambura drum - traditional Kalihna percussion instrument"),
  img(rawChapters, "image5.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "", "", "Tante Es en Winston, Paramaribo, 1952"),
  img(rawChapters, "image52.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "", "", "Sunflower (2019). Acrylic on canvas (90x70cm)"),
  img(rawChapters, "image17.png", "hoofdstuk-1", "Werehpai Petroglyph", "", "", "Stardancers; Defenders of the Amazon; The Guardian"),
  img(rawChapters, "image111.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "", "", "Epekodonoh, Galibi 1973"),
  img(rawChapters, "image86.jpg", "hoofdstuk-1", "Werehpai Petroglyph", "", "", "Powersigns (2015). Acrylic on wood (75x23cm)"),
  img(rawChapters, "image96.png", "hoofdstuk-1", "Asamiya / Mother and Child", "Asamiya (1956)", "", "Asamiya (1956) - Winston's mother, photograph"),
  img(rawChapters, "image10.jpg", "hoofdstuk-1", "Asamiya / Mother and Child", "Mother and child (1991). Pen drawing on paper", "", "The Spirit of the Sunflower (2009). Acrylic on canvas"),
  img(rawChapters, "image117.jpg", "hoofdstuk-1", "Asamiya / Mother and Child", "Mother and Child, watercolour on paper", "", "Sambura (2007). Acrylic on canvas (114x74cm)"),
  img(rawChapters, "image90.jpg", "hoofdstuk-1", "Asamiya / Mother and Child", "", "", "Artwork from the Kalihna culture section"),
  img(rawChapters, "image98.jpg", "hoofdstuk-1", "Asamiya / Mother and Child", "", "", "Pet Monkey. Oil on canvas (1992)"),
  img(rawChapters, "image32.jpg", "hoofdstuk-1", "Asamiya / Mother and Child", "", "", "Icons (2005). Acrylic on canvas (44x65cm)"),
  img(rawChapters, "image130.jpg", "hoofdstuk-1", "Asamiya / Mother and Child", "", "", "Artwork from the Kalihna culture section"),
  img(rawChapters, "image58.jpg", "hoofdstuk-1", "Spirit of the Tides", "Spirit of the Tides (2018). Acrylic on canvas (110x70cm)", "", "The Seven Sisters (2017). Acrylic on wood (215x37.5cm)"),
  img(rawChapters, "image106.jpg", "hoofdstuk-1", "Spirit of the Tides", "", "", "Norma - portrait, pastel drawing (1973)"),
  img(rawChapters, "image31.jpg", "hoofdstuk-1", "Sambura rituelen", "Sambura - het begin van alles", "", "Sambura Players (1992). Oil on canvas"),
  img(rawChapters, "image73.jpg", "hoofdstuk-1", "Karawasi", "Karawasi - liederen om te huilen", "", "Dancing Women (2010). Acrylic on canvas"),
  img(rawChapters, "image77.jpg", "hoofdstuk-1", "Dans", "Dancing Women (2010). Acrylic on canvas", "", "Dancing Women (2010). Acrylic on canvas"),
  img(rawChapters, "image2.jpg", "hoofdstuk-1", "Sambura en Karawasi", "", "", "Book cover design - publication"),
  img(rawChapters, "image80.jpg", "hoofdstuk-1", "Sambura en Karawasi", "Maraka", "", "Maraka - traditional Kalihna rattle instrument"),
  img(rawChapters, "image112.png", "hoofdstuk-1", "Sambura en Karawasi", "", "", "Dancing Amazonas (1998). Acrylic on board (44x36cm)"),
  img(rawChapters, "image120.jpg", "hoofdstuk-1", "Sambura en Karawasi", "", "", "Exhibition announcement poster"),
  img(rawChapters, "image123.jpg", "hoofdstuk-1", "Sambura en Karawasi", "", "", "Book cover design - publication"),
  img(rawChapters, "image59.jpg", "hoofdstuk-1", "Sambura en Karawasi", "", "", "Dancing Couples (2005). Acrylic on canvas (82x52cm)"),

  // -- Hoofdstuk 2 - Kinderjaren --
  img(rawChapters, "image16.jpg", "hoofdstuk-2", "Kinderjaren tussen werelden", "", "", "Asamiya (1956) - Winston's mother, photograph"),
  img(rawChapters, "image79.jpg", "hoofdstuk-2", "Kinderjaren tussen werelden", "", "", "Maraka - traditional Kalihna rattle instrument"),
  img(rawChapters, "image55.jpg", "hoofdstuk-2", "Kinderjaren tussen werelden", "", "", "Boy and Bird. Acrylic on canvas"),
  img(rawChapters, "image57.jpg", "hoofdstuk-2", "Kinderjaren tussen werelden", "", "", "Elselyn Fa-Si-Oen (1956) - Winston's foster mother 'Tante Es'"),
  img(rawChapters, "image19.jpg", "hoofdstuk-2", "Kinderjaren tussen werelden", "", "", "Graphic advertising designs for the tobacco industry (1977)"),
  img(rawChapters, "image129.jpg", "hoofdstuk-2", "Kinderjaren tussen werelden", "", "", "Spirit of the Tides (2018). Acrylic on canvas (110x70cm)"),
  img(rawChapters, "image6.jpg", "hoofdstuk-2", "Tante Es", "Elselyn Fa-Si-Oen en Winston", "", "Elselyn Fa-Si-Oen and Winston - foster mother and son"),
  img(rawChapters, "image13.jpg", "hoofdstuk-2", "Tante Es", "", "", "The Flute Player (2001). Acrylic on canvas (95x65cm)"),
  img(rawChapters, "image114.jpg", "hoofdstuk-2", "Tante Es", "", "", "Graphic design logos and corporate identity work"),
  img(rawChapters, "image127.jpg", "hoofdstuk-2", "Tante Es", "", "", "Photos from Alice Elzinga - Winston in the USA, 1957"),
  img(rawChapters, "image64.jpg", "hoofdstuk-2", "Tante Es", "", "", "Paramaribo, 1956 - photo by Tante Es"),
  img(rawChapters, "image97.jpg", "hoofdstuk-2", "Tante Es", "", "", "Pet Monkey. Oil on canvas (1992)"),
  img(rawChapters, "image128.jpg", "hoofdstuk-2", "Tante Es", "", "", "Winston, 1947 - photo by Tante Es"),
  img(rawChapters, "image119.jpg", "hoofdstuk-2", "Tante Es", "", "", "Epekondonoh. Oil on canvas (1992)"),

  // -- Hoofdstuk 3 - Terug in Suriname --
  img(rawChapters, "image74.jpg", "hoofdstuk-3", "Terug in Suriname", "", "", "Portrait from the Return to Suriname period"),
  img(rawChapters, "image61.png", "hoofdstuk-3", "Terug in Suriname", "", "", "Daily life in the village of Paradijs (Katholieke Illustratie, 1947)"),
  img(rawChapters, "image9.png", "hoofdstuk-3", "Terug in Suriname", "", "", "P?yai and Helpers (2017). Acrylic on canvas"),
  img(rawChapters, "image103.jpg", "hoofdstuk-3", "Terug in Suriname", "", "", "The Flute Player (2001). Acrylic on canvas (95x65cm)"),
  img(rawChapters, "image46.png", "hoofdstuk-3", "Terug in Suriname", "", "", "Artwork from the Return to Suriname period"),
  img(rawChapters, "image30.jpg", "hoofdstuk-3", "Terug in Suriname", "", "", "Graphic advertising designs for the tobacco industry (1977)"),
  img(rawChapters, "image20.jpg", "hoofdstuk-3", "Terug in Suriname", "", "", "Matrimonium (2011). Acrylic on paper (25x20cm)"),
  img(rawChapters, "image100.jpg", "hoofdstuk-3", "Terug in Suriname", "", "", "The Battle (1992). Oil on canvas"),
  img(rawChapters, "image25.png", "hoofdstuk-3", "Terug in Suriname", "", "", "Family photo, 1976"),
  img(rawChapters, "image107.jpg", "hoofdstuk-3", "Terug in Suriname", "", "", "Norma - portrait, pastel drawing"),
  img(rawChapters, "image22.jpg", "hoofdstuk-3", "Terug in Suriname", "", "", "Iveraldo van der Bok - son of Winston, pastel drawing (1980)"),
  img(rawChapters, "image28.jpg", "hoofdstuk-3", "Terug in Suriname", "", "", "Iveraldo van der Bok - family portrait"),

  // -- Hoofdstuk 4 - Waka Tjopu --
  img(rawChapters, "image60.jpg", "hoofdstuk-4", "Waka Tjopu", "", "", "Artwork from the Waka Tjopu artists collective"),
  img(rawChapters, "image37.jpg", "hoofdstuk-4", "Waka Tjopu", "", "", "Kusari - Julius van der Bok (1950). Photograph"),
  img(rawChapters, "image71.jpg", "hoofdstuk-4", "Waka Tjopu", "", "", "Cartoon by Steve Ammersingh (1987)"),
  img(rawChapters, "image7.jpg", "hoofdstuk-4", "Waka Tjopu", "", "", "Artwork from the Waka Tjopu collective"),
  img(rawChapters, "image82.jpg", "hoofdstuk-4", "Waka Tjopu", "", "", "Rhythm of Dancers - painting"),
  img(rawChapters, "image102.jpg", "hoofdstuk-4", "Waka Tjopu", "", "", "In the port of Paramaribo - photograph"),
  img(rawChapters, "image56.jpg", "hoofdstuk-4", "Waka Tjopu", "", "", "Winston and Ray Daal, 1987"),

  // -- Hoofdstuk 5 - Kunstenaar & Ondernemer --
  img(rawChapters, "image99.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Family (1992). Pastel on paper (60x45cm)"),
  img(rawChapters, "image27.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Graphic design work - advertisement"),
  img(rawChapters, "image91.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Miniature table painting - Hotel Residence Inn commission"),
  img(rawChapters, "image49.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Graphic design work - advertisement"),
  img(rawChapters, "image81.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Graphic design work - publication"),
  img(rawChapters, "image50.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Logos and graphic corporate identity designs"),
  img(rawChapters, "image115.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Wodi. Hijaro (1995). Acrylic on canvas (20x20cm)"),
  img(rawChapters, "image125.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Book covers - graphic design work"),
  img(rawChapters, "image126.png", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Paramaribo, Palmentuin 1953 - photo by Tante Es"),
  img(rawChapters, "image12.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Paramaribo, Palmentuin 1953 - photo by Tante Es"),
  img(rawChapters, "image3.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Winston van der Bok: Poster 1492-1992"),
  img(rawChapters, "image124.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Logos and graphic corporate identity designs"),
  img(rawChapters, "image94.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Graphic design work"),
  img(rawChapters, "image68.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Graphic design work"),
  img(rawChapters, "image75.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Graphic design work"),
  img(rawChapters, "image65.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Graphic design work - illustration"),
  img(rawChapters, "image47.jpg", "hoofdstuk-5", "Zelfstandig ondernemer", "", "", "Zoo humain: Caribbean Indians exhibited at the Jardin d'Acclimatation, Paris (1892)"),
  img(rawChapters, "image88.jpg", "hoofdstuk-5", "5.2 Een onverwachte ontmoeting", "Een onverwachte ontmoeting, een jarenlange vriendschap", "", "An unexpected encounter, a lifelong friendship - portrait photograph"),
  img(rawChapters, "image101.jpg", "hoofdstuk-5", "Paranak?r?", "Paranak?r? - de geesten uit de zee", "", "Paranak?r? - de geesten uit de zee (Spirits from the Sea)"),
  img(rawChapters, "image36.jpg", "hoofdstuk-5", "500 jaar 'ontdekking'", "De komst van de grote kannibaal", "", "Winston, Waka Tjopu collective - group photograph"),
  img(rawChapters, "image4.jpg", "hoofdstuk-5", "Herdenking 1492-1992", "Kuluwayak poster/herdenkingszegel (1992)", "", "Matrimonium (2011). Acrylic on paper (25x20cm)"),
  img(rawChapters, "image121.jpg", "hoofdstuk-5", "Herdenking 1492-1992", "", "", "Timespirit (1995). Oil on canvas"),
  img(rawChapters, "image23.jpg", "hoofdstuk-5", "Kunst als gemeenschapsdienst", "Vlechtwerk en ritme", "", "Timespirit (1995). Oil on canvas"),
  img(rawChapters, "image122.png", "hoofdstuk-5", "Kunst als gemeenschapsdienst", "", "", "Epekondonoh. Oil on canvas (1992)"),
  img(rawChapters, "image53.png", "hoofdstuk-5", "Kunst als gemeenschapsdienst", "", "", "Large-format artwork - community service project"),
  img(rawChapters, "image8.jpg", "hoofdstuk-5", "Kunst als gemeenschapsdienst", "", "", "Daily life in the village of Paradijs (Katholieke Illustratie, 1947)"),
  img(rawChapters, "image42.jpg", "hoofdstuk-5", "Kunst als gemeenschapsdienst", "", "", "Spirits of the Dance (2005). Acrylic on canvas (100x70cm)"),
  img(rawChapters, "image67.jpg", "hoofdstuk-5", "Kunst als gemeenschapsdienst", "", "", "Graphic design - community arts project"),
  img(rawChapters, "image44.jpg", "hoofdstuk-5", "Kunst als gemeenschapsdienst", "", "", "The Guardian (1998). Acrylic on paper (40x68cm)"),
  img(rawChapters, "image54.jpg", "hoofdstuk-5", "Verhalen als grondstof", "Nature Eyes. Acrylic on paper (15x15cm)", "", "Nature Eyes. Acrylic on paper (15x15cm)"),
  img(rawChapters, "image105.jpg", "hoofdstuk-5", "Verhalen als grondstof", "", "", "His Masterpiece (2013). Acrylic on canvas (100x120cm)"),
  img(rawChapters, "image95.jpg", "hoofdstuk-5", "Levend erfgoed", "", "", "P?yai Maraka (2011). Acrylic on board (45x52cm)"),
  img(rawChapters, "image14.jpg", "hoofdstuk-5", "Levend erfgoed", "", "", "Kunstinstallatie met rouw-elementen van Kurt Nahar (2023)"),
  img(rawChapters, "image87.jpg", "hoofdstuk-5", "Levend erfgoed", "Spirit of the Waves (2018). Acrylic on canvas (80x60)", "", "Powersigns (2015). Acrylic on wood (75x23cm)"),
  img(rawChapters, "image70.jpg", "hoofdstuk-5", "Levend erfgoed", "", "", "Spirit of the Waves (2018). Acrylic on canvas (80x60cm)"),
  img(rawChapters, "image83.jpg", "hoofdstuk-5", "Kleuren uit de aarde", "Compositie - licht en donker", "", "Winston van der Bok, 2018 - portrait photograph"),
  img(rawChapters, "image63.jpg", "hoofdstuk-5", "Kleuren uit de aarde", "", "", "Rhythm of Dancers - composition, year unknown"),
  img(rawChapters, "image116.jpg", "hoofdstuk-5", "Rood - levenskracht", "Rhythm of Dancers", "", "Maiden (2001). Mixed media on paper on canvas (21x20cm)"),
  img(rawChapters, "image104.jpg", "hoofdstuk-5", "Rood - levenskracht", "", "", "Nature Eyes. Acrylic on paper (15x15cm)"),
  img(rawChapters, "image43.jpg", "hoofdstuk-5", "Rood - levenskracht", "", "", "Artwork from the Red - Life Force section"),
  img(rawChapters, "image113.jpg", "hoofdstuk-5", "Spirits of the Dance", "Spirits of the Dance (2005). Acrylic on canvas (100x70cm)", "", "Paramaribo, Palmentuin 1953 - portrait photograph"),
  img(rawChapters, "image41.jpg", "hoofdstuk-5", "Spirits of the Dance", "", "", "Artwork from the Spirits of the Dance series"),
  img(rawChapters, "image110.png", "hoofdstuk-5", "Spirits of the Dance", "", "", "Mother and Child (1991). Pen drawing on paper"),
  img(rawChapters, "image118.jpg", "hoofdstuk-5", "Spirits of the Dance", "", "", "Winston, 1960 - photo by Alice Elzinga"),

  // -- Hoofdstuk 6 - Op leven en dood --
  img(rawChapters, "image48.jpg", "hoofdstuk-6", "Op leven en dood", "", "", "Artwork from the Life and Death chapter"),
  img(rawChapters, "image40.jpg", "hoofdstuk-6", "Op leven en dood", "", "", "Transformations (2010). Acrylic on canvas (95x66cm)"),
  img(rawChapters, "image72.png", "hoofdstuk-6", "Op leven en dood", "", "", "Restaurant Colakreek - mural commission"),
  img(rawChapters, "image34.jpg", "hoofdstuk-6", "Op leven en dood", "", "", "Artwork from the Life and Death chapter"),
  img(rawChapters, "image66.jpg", "hoofdstuk-6", "Op leven en dood", "", "", "Nurturing Nature (2018). Acrylic on canvas (67x97.5cm)"),
  img(rawChapters, "image108.jpg", "hoofdstuk-6", "Op leven en dood", "", "", "Johan van der Bok (2000) - Winston's brother, photograph"),
  img(rawChapters, "image11.jpg", "hoofdstuk-6", "Op leven en dood", "The Spirit of the Sunflower (2009). Acrylic on canvas", "", "The Spirit of the Sunflower (2009). Acrylic on canvas"),
  img(rawChapters, "image78.jpg", "hoofdstuk-6", "Het Monument der Inheemsen", "Monument der Inheemsen - ontwerp", "", "Girl (1998). Pen Drawing - design sketch"),
  img(rawChapters, "image29.jpg", "hoofdstuk-6", "Het Monument der Inheemsen", "Nationaal Monument der Inheemsen - ontwerp Winston", "", "Nationaal Monument der Inheemsen - Winston's design proposal"),
  img(rawChapters, "image18.jpg", "hoofdstuk-6", "Nalatenschap", "Image carriers", "", "Alice Elzinga (1956) - Winston's second foster mother"),
  img(rawChapters, "image15.jpg", "hoofdstuk-6", "Ingi Sten", "Ingi Sten expositie (2024) - Kurt Nahar curator", "", "Ingi Sten - miniature table painting, Hotel Residence Inn commission"),

  // -- Epiloog --
  img(rawChapters, "image35.jpg", "epiloog", "Winston van der Bok overleed op 25 september 2021", "", "", "The Maneater (1992). Oil on canvas"),
  img(rawChapters, "image85.jpg", "epiloog", "Winston van der Bok overleed op 25 september 2021", "Brief Arno", "", "Asamiya (1956). Mother and Child, watercolour on paper"),
  img(rawChapters, "image76.jpg", "epiloog", "The Last Dance", "The Last Dance (2000). Acrylic on canvas", "", "The Last Dance (2000). Acrylic on canvas"),
];

/** All chapters with computed image counts (immutable, no post-construction mutation) */
export const chapters: readonly Chapter[] = rawChapters.map((ch) => ({
  ...ch,
  imageCount: images.filter((img) => img.chapterId === ch.id).length,
}));

/** Get images for a specific chapter */
export const getChapterImages = (chapterId: string): readonly ImageAsset[] =>
  images.filter((img) => img.chapterId === chapterId);

/** Get a chapter by its ID */
export const getChapter = (chapterId: string): Chapter | undefined =>
  chapters.find((c) => c.id === chapterId);
