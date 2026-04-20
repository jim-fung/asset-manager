const exactTranslations: Record<string, string> = {
  "Asamiya / Mother and Child": "Asamiya / Moeder en kind",
  "Cover / route visual": "Omslag / routebeeld",
  "Image carriers": "Beelddragers",
  "Werehpai Petroglyph": "Werehpai-petroglief",
  "The Passage": "De doorgang",
  "Spirit of the Tides": "Geest van de getijden",
  "Spirits of the Dance": "Geesten van de dans",
  "The Last Dance": "De laatste dans",
  "Zoo humain: Les indig?nes des Cara?bes": "Mensentuin: de inheemsen van de Cariben",
  "Zoo humain : Les indig?nes des Cara?bes au jardin d":
    "Mensentuin: de inheemsen van de Cariben in de Jardin d'Acclimatation",
  "Zoo humain: Les indig?nes des Cara?bes au Jardin d'Acclimatation, Paris (1892)":
    "Mensentuin: de inheemsen van de Cariben in de Jardin d'Acclimatation, Parijs (1892)",
  "Zoo humain: Caribbean Indians exhibited at the Jardin d'Acclimatation, Paris (1892)":
    "Mensentuin: Caribische inheemsen tentoongesteld in de Jardin d'Acclimatation, Parijs (1892)",
  "Artwork from the Kalihna culture section":
    "Kunstwerk uit het onderdeel over de Kalihna-cultuur",
  "Artwork from the Life and Death chapter":
    "Kunstwerk uit het hoofdstuk Op leven en dood",
  "Artwork from the Red - Life Force section":
    "Kunstwerk uit het onderdeel Rood - levenskracht",
  "Artwork from the Return to Suriname period":
    "Kunstwerk uit de periode Terug in Suriname",
  "Artwork from the Spirits of the Dance series":
    "Kunstwerk uit de serie Geesten van de dans",
  "Artwork from the Waka Tjopu artists collective":
    "Kunstwerk uit het kunstenaarscollectief Waka Tjopu",
  "Artwork from the Waka Tjopu collective":
    "Kunstwerk uit het Waka Tjopu-collectief",
  "Portrait from the Return to Suriname period":
    "Portret uit de periode Terug in Suriname",
  "Portrait of Winston van der Bok, 2018":
    "Portret van Winston van der Bok, 2018",
  "An unexpected encounter, a lifelong friendship - portrait photograph":
    "Een onverwachte ontmoeting, een jarenlange vriendschap - portretfoto",
  "Miniature painting from the book layout":
    "Miniatuurschildering uit de boekopmaak",
  "Exhibition announcement poster":
    "Aankondigingsposter voor een tentoonstelling",
  "Graphic design work": "Grafisch ontwerpwerk",
  "Graphic design logos and corporate identity work":
    "Grafische ontwerplogo's en huisstijlwerk",
  "Logos and graphic corporate identity designs":
    "Logo's en grafische huisstijlontwerpen",
  "Graphic design - community arts project":
    "Grafisch ontwerp - gemeenschapskunstproject",
  "Graphic design work - advertisement":
    "Grafisch ontwerpwerk - advertentie",
  "Graphic design work - illustration":
    "Grafisch ontwerpwerk - illustratie",
  "Graphic design work - publication":
    "Grafisch ontwerpwerk - publicatie",
  "Graphic advertising designs for the tobacco industry (1977)":
    "Grafische reclameontwerpen voor de tabaksindustrie (1977)",
  "1977 - Winston's graphic advertising designs for the tobacco industry":
    "1977 - Winstons grafische reclameontwerpen voor de tabaksindustrie",
  "Book cover design - publication":
    "Boekomslagontwerp - publicatie",
  "Book covers - graphic design work":
    "Boekomslagen - grafisch ontwerpwerk",
  "Miniature table painting - Hotel Residence Inn commission":
    "Miniatuurschildering op tafel - opdracht voor Hotel Residence Inn",
  "Ingi Sten - miniature table painting, Hotel Residence Inn commission":
    "Ingi Sten - miniatuurschildering op tafel, opdracht voor Hotel Residence Inn",
  "Large-format artwork - community service project":
    "Groot formaat kunstwerk - project voor gemeenschapsdienst",
  "Nationaal Monument der Inheemsen - Winston's design proposal":
    "Nationaal Monument der Inheemsen - Winstons ontwerpvoorstel",
  "Werehpai Petroglyph site - petroglyphs in the rainforest":
    "Locatie van de Werehpai-petroglief - petrogliefen in het regenwoud",
  "Paranak?r? - de geesten uit de zee (Spirits from the Sea)":
    "Paranak?r? - de geesten uit de zee (Geesten uit de zee)",
  "Prepared from TIFF-origin source material":
    "Voorbereid vanuit bronmateriaal met TIFF-oorsprong",
};

// IMPORTANT: Longer/more-specific patterns MUST precede their substring patterns to
// prevent double-translation. Pairs are applied in order via reduce.
const replacementPairs: Array<[RegExp, string]> = [
  [/Stardancers; Defenders of the Amazon; The Guardian/g, "Sterrendansers; Verdedigers van het Amazonegebied; De beschermer"],
  [/The Spirit of the Sunflower/g, "De geest van de zonnebloem"],
  [/Spirit of the Tides/g, "Geest van de getijden"],
  [/Spirit of the Waves/g, "Geest van de golven"],
  [/Spirits of the Dance/g, "Geesten van de dans"],
  [/The Last Dance/g, "De laatste dans"],
  [/The Passage/g, "De doorgang"],
  [/The Labyrinth/g, "Het labyrint"],
  [/The Battle/g, "De strijd"],
  [/The Flute Player/g, "De fluitspeler"],
  [/The Guardian/g, "De beschermer"],
  [/The Maneater/g, "De menseneter"],
  [/The Seven Sisters/g, "De zeven zussen"],
  [/Hope for the Future/g, "Hoop voor de toekomst"],
  [/Dancing Amazonas/g, "Dansende Amazonen"],
  [/Dancing Couples/g, "Dansende koppels"],
  [/Dancing Women/g, "Dansende vrouwen"],
  [/Rhythm of Dancers/g, "Ritme van dansers"],
  [/Mother and Child/g, "Moeder en kind"],
  [/Nature Eyes/g, "Natuurogen"],
  [/Boy and Bird/g, "Jongen en vogel"],
  [/Children/g, "Kinderen"],
  [/Family photo/g, "Familiefoto"],
  [/Family/g, "Familie"],
  [/Girl/g, "Meisje"],
  [/Icons/g, "Iconen"],
  [/Old Man/g, "Oude man"],
  [/Pet Monkey/g, "Aapje"],
  [/Sunflower/g, "Zonnebloem"],
  [/Transformations/g, "Transformaties"],
  [/In the port of Paramaribo/g, "In de haven van Paramaribo"],
  [/Portrait of Winston van der Bok/g, "Portret van Winston van der Bok"],
  [/Asamiya \(1956\) - Winston's mother, photograph/g, "Asamiya (1956) - Winstons moeder, foto"],
  [/Alice Elzinga \(1956\) - Winston's second foster mother/g, "Alice Elzinga (1956) - Winstons tweede pleegmoeder"],
  [/Elselyn Fa-Si-Oen \(1956\) - Winston's foster mother 'Tante Es'/g, "Elselyn Fa-Si-Oen (1956) - Winstons pleegmoeder 'Tante Es'"],
  [/Elselyn Fa-Si-Oen and Winston - foster mother and son/g, "Elselyn Fa-Si-Oen en Winston - pleegmoeder en zoon"],
  [/Johan van der Bok \(2000\) - Winston's brother, photograph/g, "Johan van der Bok (2000) - Winstons broer, foto"],
  [/Iveraldo van der Bok - son of Winston, pastel drawing/g, "Iveraldo van der Bok - zoon van Winston, pasteltekening"],
  [/Winston, Waka Tjopu collective - group photograph/g, "Winston, Waka Tjopu-collectief - groepsfoto"],
  [/Paramaribo, Palmentuin 1953 - portrait photograph/g, "Paramaribo, Palmentuin 1953 - portretfoto"],
  [/Winston van der Bok, 2018 - portrait photograph/g, "Winston van der Bok, 2018 - portretfoto"],
  [/Pencil drawing by Johan van der Bok/g, "Potloodtekening van Johan van der Bok"],
  [/Restaurant Colakreek - mural commission/g, "Restaurant Colakreek - muurschilderingsopdracht"],
  [/Book cover design/g, "Boekomslagontwerp"],
  [/Book covers/g, "Boekomslagen"],
  [/Graphic advertising designs/g, "Grafische reclameontwerpen"],
  [/Graphic design work/g, "Grafisch ontwerpwerk"],
  [/graphic corporate identity designs/g, "grafische huisstijlontwerpen"],
  [/graphic advertising designs/g, "grafische reclameontwerpen"],
  [/community arts project/g, "gemeenschapskunstproject"],
  [/community service project/g, "project voor gemeenschapsdienst"],
  [/design proposal/g, "ontwerpvoorstel"],
  [/design sketch/g, "ontwerpschets"],
  [/portrait photograph/g, "portretfoto"],
  [/group photograph/g, "groepsfoto"],
  [/portrait/g, "portret"],
  [/photograph/g, "foto"],
  [/photo by/g, "foto door"],
  [/artists collective/g, "kunstenaarscollectief"],
  [/collective/g, "collectief"],
  [/book layout/g, "boekopmaak"],
  [/illustration/g, "illustratie"],
  [/advertisement/g, "advertentie"],
  [/publication/g, "publicatie"],
  [/miniature table painting/g, "miniatuurschildering op tafel"],
  [/miniature painting/g, "miniatuurschildering"],
  [/daily life in the village of Paradijs/g, "dagelijks leven in het dorp Paradijs"],
  [/traditional Kalihna percussion instrument/g, "traditioneel Kalihna-slaginstrument"],
  [/traditional Kalihna rattle instrument/g, "traditioneel Kalihna-schudinstrument"],
  [/petroglyphs in the rainforest/g, "petrogliefen in het regenwoud"],
  [/year unknown/g, "jaar onbekend"],
  [/converted from high-res TIFF originals/g, "omgezet vanuit TIFF-originelen met hoge resolutie"],
  [/converted to JPEG/g, "omgezet naar JPEG"],
  [/high-res TIFF originals/g, "TIFF-originelen met hoge resolutie"],
  [/Acrylic on canvas/g, "Acryl op doek"],
  [/Oil on canvas/g, "Olie op doek"],
  [/Acrylic on paper/g, "Acryl op papier"],
  [/Pastel on paper/g, "Pastel op papier"],
  [/Pen drawing on paper/g, "Pentekening op papier"],
  [/Pen drawing/g, "Pentekening"],
  [/Pen Drawing/g, "Pentekening"],
  [/watercolour on paper/g, "aquarel op papier"],
  [/Natural pigments on wood/g, "natuurlijke pigmenten op hout"],
  [/Acrylic on wood/g, "Acryl op hout"],
  [/Acrylic on board/g, "Acryl op paneel"],
  [/Mixed media on paper on canvas/g, "Gemengde techniek op papier op doek"],
];

export function translateArchiveTextToDutch(value: string): string {
  if (!value) {
    return value;
  }

  const exact = exactTranslations[value];
  if (exact) {
    return exact;
  }

  return replacementPairs.reduce(
    (translated, [pattern, replacement]) => translated.replace(pattern, replacement),
    value,
  );
}
