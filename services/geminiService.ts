const SCENARIOS = [
  "Klassen har fået det dårligt efter at have spist i kantinen.",
  "En kæmpe drage lander i skolegården.",
  "Julemanden står pludselig i klasselokalet.",
  "Den sure lærer opdager, at hans kaffe er spildt.",
  "En nervøs vikar starter sin allerførste time.",
  "Brandalarmen går midt i en vigtig prøve.",
  "En elev råber, at der er en edderkop i klassen.",
  "Skolelederen kommer uanmeldt ind i timen.",
  "Klassen opdager, at de skal have idræt udenfor i regnvejr.",
  "En bold smadrer en rude i skolegården.",
  "Klassen finder en mystisk kasse foran døren.",
  "En elev påstår, at tasken bevæger sig.",
  "En kendt fodboldspiller besøger skolen.",
  "En klassekammerat har glemt alt sit tøj til idræt.",
  "Klassen opdager, at de har fået en ny superstreng lærer.",
  "Der lugter virkelig mærkeligt i klasselokalet.",
  "En elev har taget sin lillebror med i skole.",
  "Klassen vinder en kæmpe pokal.",
  "En lærer begynder pludselig at danse.",
  "Klassen opdager, at de er kommet i den forkerte bus.",
  "Hele skolen mister strømmen.",
  "En elev taber hele sin madpakke på gulvet.",
  "Klassen møder en meget streng skoleinspektør.",
  "Der ligger sne i hele klasselokalet.",
  "En hund løber ind i skolegården.",
  "Klassen opdager, at de har glemt deres lærer på turen.",
  "En elev siger, at der er en slange i busken.",
  "Klassen skal pludselig optræde foran hele skolen.",
  "En lærer kan ikke finde sine briller.",
  "Der er kun én stol tilbage i klassen.",
  "Klassen opdager, at de har fået dobbeltlektier.",
  "En ballon springer midt i timen.",
  "Skolekøkkenet står fuld af røg.",
  "Klassen finder en skattekiste på legepladsen.",
  "En elev har farvet sit hår helt grønt.",
  "Der står en meget vred forælder i døren.",
  "Klassen ser en meteor på himlen.",
  "En lærer græder over en ødelagt kop.",
  "Klassen opdager, at de skal have prøve hele ugen.",
  "En elev har taget en kæmpe is med i skole.",
  "Der står en tryllekunstner i klassen.",
  "Klassen opdager, at gulvet er helt vådt.",
  "En elev falder dramatisk af stolen.",
  "Klassen finder en hemmelig dør bag reolen.",
  "En lærer mister tålmodigheden.",
  "Klassen opdager, at de er låst ude.",
  "En elev påstår, at de har set en alien.",
  "Hele klassen får besked om at rydde op nu.",
  "En robot kommer ind i klasselokalet.",
  "Klassen opdager, at de har vundet en konkurrence.",
  "En lærer snubler over en taske.",
  "Klassen opdager, at det er deres fødselsdag alle sammen.",
  "Der sidder en kat på lærerens stol.",
  "En elev har glemt sit navn på prøven.",
  "Klassen opdager, at de skal på lejrskole i morgen.",
  "En meget træt lærer forsøger at undervise.",
  "Klassen opdager, at de er de eneste på skolen.",
  "En elev kommer for sent med en vild forklaring.",
  "Der ligger konfetti over hele gulvet.",
  "Klassen opdager, at nogen har spist lærerens kage.",
  "En elev har bygget et tårn, der er ved at vælte.",
  "Klassen opdager, at de skal synge solo.",
  "En meget streng dommer står i døren.",
  "Der lander en drone i skolegården.",
  "Klassen opdager, at de har glemt deres idrætsdag.",
  "En elev har malet på tavlen.",
  "Klassen opdager, at de har fået en klassemaskot.",
  "En lærer taber alle sine papirer.",
  "Klassen opdager, at de skal have vikar resten af året.",
  "En elev har taget en kæmpe kage med.",
  "Hele klassen får hikke på samme tid.",
  "En meget sur pedel opdager rod i gangen.",
  "Klassen opdager, at de skal rydde hele skolegården.",
  "En elev gemmer sig under bordet.",
  "Der hænger en seddel med “Rektor vil tale med jer”.",
  "Klassen opdager, at de skal i fjernsynet.",
  "En lærer prøver at være cool.",
  "Klassen opdager, at der er byttet om på klasselokalerne.",
  "En elev har taget sin hamster med.",
  "Klassen opdager, at de har glemt madpakken derhjemme.",
  "En kæmpe regnskyl starter midt i frikvarteret.",
  "Klassen opdager, at de har fået en ny klassekammerat.",
  "En elev vælter et glas vand ud over computeren.",
  "Klassen opdager, at de skal løbe 5 km i idræt.",
  "En meget glad lærer deler karakterer ud.",
  "Klassen opdager, at de har matematik i fire timer.",
  "En elev har taget en højttaler med og spiller musik.",
  "Klassen opdager, at der er en hemmelig besked på tavlen.",
  "En lærer hvisker noget meget alvorligt.",
  "Klassen opdager, at det er sidste skoledag før ferie.",
  "En elev påstår, at skolen er hjemsøgt.",
  "Klassen opdager, at deres klasseværelse er malet i en vild farve.",
  "En lærer bliver forskrækket af en høj lyd.",
  "Klassen opdager, at de har glemt deres projekt derhjemme.",
  "En elev har lavet en kæmpe tegning på tavlen.",
  "Klassen opdager, at de skal have gæster i timen.",
  "En meget dramatisk undskyldning gives midt i klassen.",
  "Klassen opdager, at de skal lave gruppearbejde med deres “modsætning”.",
  "En elev jubler, mens resten ser chokerede ud.",
  "Klassen opdager, at klokken faktisk allerede har ringet ud."
];

// We keep track of used scenarios in memory to avoid repetition within the same session if possible
let usedIndices: number[] = [];

export const generateScenario = async (): Promise<string> => {
  // Simulate a "thinking" delay for effect (3 seconds)
  // This makes the UI feel like it's processing, which builds anticipation
  await new Promise(resolve => setTimeout(resolve, 3000));

  if (usedIndices.length >= SCENARIOS.length) {
    // Reset if we've used all scenarios
    usedIndices = [];
  }

  let index;
  do {
    index = Math.floor(Math.random() * SCENARIOS.length);
  } while (usedIndices.includes(index));

  usedIndices.push(index);
  return SCENARIOS[index];
};