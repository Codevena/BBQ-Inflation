export interface InflationData {
  year: number;
  rate: number;
  country?: string;
}

export interface InflationCause {
  category: string;
  percentage: number;
  color: string;
  description: string;
}

export interface HistoricalEvent {
  year: number;
  country: string;
  rate: number;
  title: string;
  description: string;
  impact: string;
}

// Quelle: Statistisches Bundesamt Deutschland (Destatis)
export const inflationRatesGermany: InflationData[] = [
  { year: 2019, rate: 1.4 }, // Destatis
  { year: 2020, rate: 0.5 }, // Corona-Jahr, niedrige Inflation
  { year: 2021, rate: 3.1 }, // Post-Corona Erholung
  { year: 2022, rate: 6.9 }, // Ukraine-Krieg, Energiekrise
  { year: 2023, rate: 5.9 }, // Weiterhin erhöht
  { year: 2024, rate: 2.2 }, // Destatis: Rückgang auf 2,2%
  { year: 2025, rate: 2.2 }, // Destatis: August 2025: +2,2% (Kerninflation: +2,7%)
];

// Kerninflation Deutschland (HVPI ohne Energie & unverarbeitete Lebensmittel)
// Werte als vereinfachte Jahresdurchschnitte (gerundet) – Orientierung an Destatis/Eurostat Veröffentlichungen
export const coreInflationRatesGermany: InflationData[] = [
  { year: 2019, rate: 1.4 },
  { year: 2020, rate: 1.3 },
  { year: 2021, rate: 2.3 },
  { year: 2022, rate: 4.9 },
  { year: 2023, rate: 5.1 },
  { year: 2024, rate: 3.0 },
  { year: 2025, rate: 2.7 }, // Kommentar in Datensatz oben erwähnt
];

// Basierend auf Bundesbank und EZB-Analysen
export const inflationCauses: InflationCause[] = [
  {
    category: "Nachfrageinflation",
    percentage: 30,
    color: "#EF4444",
    description: "Steigende Nachfrage bei begrenztem Angebot (z.B. Post-Corona-Boom)"
  },
  {
    category: "Angebotsinflation",
    percentage: 25,
    color: "#F59E0B",
    description: "Lieferkettenprobleme, Rohstoffknappheit, Energiekrise"
  },
  {
    category: "Geldpolitik",
    percentage: 20,
    color: "#3B82F6",
    description: "Niedrigzinspolitik und Quantitative Lockerung der Zentralbanken"
  },
  {
    category: "Lohn-Preis-Spirale",
    percentage: 15,
    color: "#10B981",
    description: "Steigende Löhne führen zu höheren Preisen und umgekehrt"
  },
  {
    category: "Importierte Inflation",
    percentage: 10,
    color: "#8B5CF6",
    description: "Höhere Preise für importierte Güter (Energie, Rohstoffe)"
  }
];

// Quelle: Historische Wirtschaftsdaten, Zentralbanken
export const historicalEvents: HistoricalEvent[] = [
  {
    year: 1923,
    country: "Deutschland",
    rate: 325000000, // 325 Millionen % - Höhepunkt November 1923
    title: "Hyperinflation Weimarer Republik",
    description: "Reparationszahlungen und Ruhrbesetzung führten zum Kollaps der Reichsmark",
    impact: "1 US-Dollar = 4,2 Billionen Mark. Löhne wurden täglich ausgezahlt"
  },
  {
    year: 1946,
    country: "Ungarn",
    rate: 13600000000000000, // 13,6 Billiarden % - höchste je gemessene Inflation
    title: "Pengő-Hyperinflation - Weltrekord",
    description: "Kriegsschäden und politische Instabilität nach dem 2. Weltkrieg",
    impact: "Preise verdoppelten sich alle 15 Stunden. 100 Quintillionen Pengő-Scheine"
  },
  {
    year: 1980,
    country: "USA",
    rate: 13.5, // BLS CPI-U Jahresrate 1980 (Höchststand der Periode)
    title: "Stagflation der 1970er/80er",
    description: "Ölkrisen 1973/1979, Lohn-Preis-Spiralen und anhaltender Preisdruck",
    impact: "Fed-Chef Volcker hob Leitzinsen >20% an; Rezession zur Inflationsbekämpfung"
  },
  {
    year: 1983,
    country: "USA",
    rate: 3.2,
    title: "Volcker-Disinflation",
    description: "Nach massiven Zinsschocks fiel die Inflation rapide – Glaubwürdigkeit wurde wiederhergestellt.",
    impact: "Zwei Rezessionen 1980/82, aber nachhaltige Senkung der Inflationserwartungen unter 4%."
  },
  {
    year: 1989,
    country: "Argentinien",
    rate: 3079,
    title: "Argentinische Hyperinflation",
    description: "Staatsverschuldung und politische Instabilität",
    impact: "Mehrere Währungsreformen, Peso wurde mehrfach abgewertet"
  },
  {
    year: 2008,
    country: "Zimbabwe",
    rate: 89700000000, // 89,7 Milliarden % - offiziell gemessen
    title: "Zimbabwe-Dollar Hyperinflation",
    description: "Landreformen, politische Krise und Wirtschaftsmismanagement",
    impact: "100-Billionen-Dollar-Scheine. US-Dollar wurde de facto Währung"
  },
  {
    year: 2018,
    country: "Venezuela",
    rate: 130060, // ca. 130.060% (Y/Y), stark zitierte Schätzung
    title: "Bolívar-Hyperinflation",
    description: "Ölpreisverfall, Staatsfinanzierung über Notenbank, Vertrauensverlust",
    impact: "Währungsreformen, Dollarisierungstendenzen im Alltag, massive Verarmung"
  },
  {
    year: 1993,
    country: "Ukraine",
    rate: 10155, // ~10.155% (Y/Y) – frühe 90er Transformationskrise
    title: "Frühphase nach der Sowjetunion",
    description: "Transformationsschock, Preisfreigaben, fiskalische Instabilität",
    impact: "Hrywnja-Einführung, Stabilisierungspolitiken zur Preisberuhigung"
  },
  {
    year: 1998,
    country: "Japan",
    rate: -0.7,
    title: "Deflation in Japan",
    description: "Platzen der Asset-Blase, Bankenkrise und schwache Nachfrage führten zu fallenden Preisen.",
    impact: "Kreditklemme, Lohnstagnation, Beginn langfristiger Nullzinspolitik und späterer Abenomics."
  }
];

// Beispielhafte VPI-Gewichte Deutschland (vereinfachte Struktur)
export const cpiWeightsGermany = [
  { category: 'Wohnen/Energie', weight: 32, color: '#60A5FA' },
  { category: 'Verkehr', weight: 13, color: '#F472B6' },
  { category: 'Nahrungsmittel/Alkohol/Tobak', weight: 10, color: '#34D399' },
  { category: 'Freizeit/Kultur', weight: 12, color: '#F59E0B' },
  { category: 'Gaststätten/Hotels', weight: 5, color: '#A78BFA' },
  { category: 'Gesundheit', weight: 5, color: '#10B981' },
  { category: 'Bekleidung/Schuhe', weight: 4, color: '#EF4444' },
  { category: 'Sonstiges', weight: 19, color: '#22D3EE' }
];

export const quizQuestions = [
  {
    id: 1,
    question: "Was passiert mit deinem Geld bei 5% Inflation pro Jahr?",
    options: [
      "Es wird mehr wert",
      "Es verliert 5% seiner Kaufkraft",
      "Es bleibt gleich wertvoll",
      "Es verdoppelt sich"
    ],
    correct: 1,
    explanation: "Bei 5% Inflation verliert dein Geld jährlich 5% seiner Kaufkraft. Was heute 100€ kostet, kostet nächstes Jahr 105€."
  },
  {
    id: 2,
    question: "Welche Institution kontrolliert die Inflation in der Eurozone?",
    options: [
      "Deutsche Bundesbank",
      "Europäische Zentralbank (EZB)",
      "Europäisches Parlament",
      "Bundesregierung"
    ],
    correct: 1,
    explanation: "Die EZB ist verantwortlich für die Geldpolitik im Euroraum und hat das Ziel, die Inflation bei etwa 2% zu halten."
  },
  {
    id: 3,
    question: "Was ist das Inflationsziel der EZB?",
    options: [
      "0% (keine Inflation)",
      "Etwa 2%",
      "5-10%",
      "So niedrig wie möglich"
    ],
    correct: 1,
    explanation: "Die EZB strebt eine Inflation von etwa 2% an, da dies als optimal für eine gesunde Wirtschaft gilt."
  },
  {
    id: 4,
    question: "Was ist der Hauptunterschied zwischen Inflation und Deflation?",
    options: [
      "Inflation = steigende Preise, Deflation = fallende Preise",
      "Inflation = fallende Preise, Deflation = steigende Preise",
      "Beide bedeuten das Gleiche",
      "Deflation gibt es nicht"
    ],
    correct: 0,
    explanation: "Inflation bedeutet allgemein steigende Preise, während Deflation fallende Preise bedeutet. Beide können wirtschaftliche Probleme verursachen."
  },
  {
    id: 5,
    question: "Welcher Faktor war hauptverantwortlich für die hohe Inflation 2022 in Deutschland?",
    options: [
      "Zu hohe Löhne",
      "Ukraine-Krieg und Energiekrise",
      "Zu viel Geld im Umlauf",
      "Steigende Mieten"
    ],
    correct: 1,
    explanation: "Der Ukraine-Krieg führte zu drastisch steigenden Energie- und Rohstoffpreisen, was die Inflation 2022 auf 6,9% ansteigen ließ."
  },
  {
    id: 6,
    question: "Was ist eine 'Lohn-Preis-Spirale'?",
    options: [
      "Löhne und Preise fallen gleichzeitig",
      "Steigende Löhne führen zu höheren Preisen, die wiederum höhere Löhne fordern",
      "Preise steigen, aber Löhne bleiben gleich",
      "Ein Wirtschaftsmodell der EZB"
    ],
    correct: 1,
    explanation: "Bei einer Lohn-Preis-Spirale führen höhere Löhne zu steigenden Produktionskosten und Preisen, was wiederum Forderungen nach höheren Löhnen auslöst."
  },
  {
    id: 7,
    question: "Wie wirkt sich Inflation auf Sparer aus?",
    options: [
      "Sparer profitieren immer von Inflation",
      "Inflation hat keinen Effekt auf Ersparnisse",
      "Ersparnisse verlieren real an Wert, wenn die Zinsen niedriger als die Inflation sind",
      "Ersparnisse werden automatisch inflationsgeschützt"
    ],
    correct: 2,
    explanation: "Wenn die Zinsen auf Sparkonten niedriger sind als die Inflationsrate, verlieren Ersparnisse real an Kaufkraft. Bei 3% Inflation und 1% Zinsen verliert man real 2% pro Jahr."
  },
  {
    id: 8,
    question: "Was passiert, wenn die EZB den Leitzins erhöht?",
    options: [
      "Kredite werden billiger",
      "Die Inflation steigt automatisch",
      "Kredite werden teurer und die Wirtschaft wird gebremst",
      "Sparen wird unattraktiver"
    ],
    correct: 2,
    explanation: "Höhere Leitzinsen führen zu teureren Krediten, weniger Investitionen und Konsum, was die Inflation dämpft."
  },
  {
    id: 9,
    question: "Welche Anlageform bietet den besten Inflationsschutz?",
    options: [
      "Sparbuch mit 0,1% Zinsen",
      "Diversifiziertes Portfolio mit Aktien und Immobilien",
      "Bargeld unter der Matratze",
      "Nur Gold kaufen"
    ],
    correct: 1,
    explanation: "Ein diversifiziertes Portfolio aus verschiedenen Anlageklassen bietet den besten Schutz vor Inflation, da verschiedene Assets unterschiedlich reagieren."
  },
  {
    id: 10,
    question: "Was ist der Unterschied zwischen nominalen und realen Zinsen?",
    options: [
      "Es gibt keinen Unterschied",
      "Nominale Zinsen sind immer höher",
      "Reale Zinsen = Nominale Zinsen minus Inflation",
      "Reale Zinsen sind nur für Banken relevant"
    ],
    correct: 2,
    explanation: "Reale Zinsen zeigen die tatsächliche Kaufkraftentwicklung. Bei 3% Nominalzins und 2% Inflation beträgt der Realzins nur 1%."
  }
];

// Quelle: Statistisches Bundesamt, Verbraucherpreisindex
export const priceExamples = [
  {
    item: "Brot (1kg)",
    price2020: 1.37,
    price2025: 1.93,
    increase: 41
  },
  {
    item: "Benzin (1L)",
    price2020: 1.27,
    price2025: 1.77,
    increase: 39
  },
  {
    item: "Miete (m²/Monat)",
    price2020: 8.74,
    price2025: 11.65,
    increase: 33
  },
  {
    item: "Strom (kWh)",
    price2020: 0.31,
    price2025: 0.49,
    increase: 58
  },
  {
    item: "Restaurant-Besuch",
    price2020: 12.50,
    price2025: 17.20,
    increase: 38
  },
  {
    item: "Öffentliche Verkehrsmittel",
    price2020: 2.90,
    price2025: 3.58,
    increase: 23
  }
];

// Zusätzliche Inflationsdaten für tiefere Einblicke
export const inflationByCategory = [
  { category: "Energie", rate2025: 0.8, rate2022: 35.7, description: "Strom, Gas, Kraftstoffe" },
  { category: "Nahrungsmittel", rate2025: 1.2, rate2022: 13.4, description: "Lebensmittel und Getränke" },
  { category: "Wohnung", rate2025: 3.1, rate2022: 2.9, description: "Miete, Nebenkosten" },
  { category: "Verkehr", rate2025: 2.0, rate2022: 7.6, description: "ÖPNV, Kraftfahrzeuge" },
  { category: "Dienstleistungen", rate2025: 4.2, rate2022: 3.1, description: "Restaurants, Friseur, etc." }
];

export const realWageData = [
  { year: 2019, nominalGrowth: 3.2, realGrowth: 1.8 },
  { year: 2020, nominalGrowth: 1.4, realGrowth: 0.9 },
  { year: 2021, nominalGrowth: 2.8, realGrowth: -0.3 },
  { year: 2022, nominalGrowth: 2.6, realGrowth: -4.3 },
  { year: 2023, nominalGrowth: 4.1, realGrowth: -1.8 },
  { year: 2024, nominalGrowth: 3.8, realGrowth: 1.6 },
  { year: 2025, nominalGrowth: 4.2, realGrowth: 2.0 }
];

// Internationale Inflationsdaten für globale Perspektive
export const globalInflationData = [
  { country: 'Deutschland', rate2025: 2.2, rate2022: 6.9, flag: '🇩🇪' },
  { country: 'USA', rate2025: 2.8, rate2022: 8.0, flag: '🇺🇸' },
  { country: 'Eurozone', rate2025: 2.1, rate2022: 8.6, flag: '🇪🇺' },
  { country: 'Großbritannien', rate2025: 1.8, rate2022: 9.0, flag: '🇬🇧' },
  { country: 'Japan', rate2025: 2.5, rate2022: 2.5, flag: '🇯🇵' },
  { country: 'China', rate2025: 0.4, rate2022: 2.0, flag: '🇨🇳' },
  { country: 'Türkei', rate2025: 42.3, rate2022: 85.5, flag: '🇹🇷' },
  { country: 'Argentinien', rate2025: 193.2, rate2022: 72.4, flag: '🇦🇷' }
];

// Erweiterte Finanz-Tipps für verschiedene Lebenssituationen
export const lifeSituationTips = [
  {
    situation: 'Student/Azubi',
    icon: '🎓',
    tips: [
      'Früh mit ETF-Sparplan beginnen (25-50€/Monat)',
      'Inflationsgeschützte Staatsanleihen für Notgroschen',
      'Ausbildungskosten vor Preiserhöhungen planen'
    ],
    priority: 'Langfristiger Vermögensaufbau'
  },
  {
    situation: 'Berufseinsteiger',
    icon: '💼',
    tips: [
      'Gehaltsverhandlungen mit Inflationsausgleich',
      'Diversifiziertes Portfolio aufbauen',
      'Immobilienkauf vs. Miete durchrechnen'
    ],
    priority: 'Inflationsschutz etablieren'
  },
  {
    situation: 'Familie',
    icon: '👨‍👩‍👧‍👦',
    tips: [
      'Bildungskosten für Kinder einkalkulieren',
      'Immobilie als Inflationsschutz nutzen',
      'Lebensversicherung inflationsindexiert wählen'
    ],
    priority: 'Langfristige Sicherheit'
  },
  {
    situation: 'Rentner',
    icon: '👴',
    tips: [
      'Teilweise in Aktien investiert bleiben',
      'Inflationsgeschützte Renten wählen',
      'Ausgaben regelmäßig an Inflation anpassen'
    ],
    priority: 'Kaufkraft erhalten'
  }
];

// Inflations-Mythen und Fakten
export const inflationMythsFacts = [
  {
    myth: 'Inflation = nur Geldmengenwachstum',
    fact: 'Ohne Nachfrage, Umlaufgeschwindigkeit und Angebot greift die Quantitätsgleichung zu kurz.',
    explanation: 'Monetäre Impulse wirken erst über Kredit, Erwartungen und Produktionskapazitäten auf Preise.'
  },
  {
    myth: 'Löhne sind der Haupttreiber',
    fact: 'Löhne reagieren meist verzögert auf Preise – oft lösen sie die Inflation nicht aus, sondern passen sich an.',
    explanation: 'Angebots- und Nachfrageschocks sowie Energiepreise sind häufig der Startpunkt; Löhne bestimmen eher Persistenz.'
  },
  {
    myth: 'Preiskontrollen stoppen Inflation dauerhaft',
    fact: 'Kurzfristig bremsen Deckel, langfristig drohen Knappheiten und Schattenmärkte.',
    explanation: 'Stattdessen wirken gezielte Transfers und Angebotsmaßnahmen nachhaltiger.'
  }
];

export interface InflationTypeDetail {
  key: 'demand' | 'supply' | 'imported' | 'wages';
  title: string;
  summary: string;
  typicalTriggers: string[];
  indicators: string[];
  policyResponse: string[];
}

export const inflationTypeDetails: InflationTypeDetail[] = [
  {
    key: 'demand',
    title: 'Nachfrageinflation',
    summary: 'Zu viel Geld jagt zu wenige Güter – häufig in Boomphasen, bei Nachholkonsum oder sehr lockerer Finanzpolitik.',
    typicalTriggers: [
      'Starke Fiskalimpulse, Transferprogramme, expansive Kreditvergabe',
      'Aufgestaute Nachfrage (z. B. nach Lockdowns) trifft auf begrenzte Kapazitäten',
      'Optimistische Erwartungen – Haushalte kaufen „aus Angst vor späteren Preiserhöhungen“'
    ],
    indicators: [
      'Hohe Auslastung, niedrige Arbeitslosigkeit, steigende Kapazitätsauslastung',
      'Schneller Lohnanstieg ohne entsprechende Produktivität',
      'Breit angelegte Preissteigerungen quer durch Gütergruppen'
    ],
    policyResponse: [
      'Restriktivere Geldpolitik (Leitzinsen anheben, Liquidität entziehen)',
      'Abbau temporärer Stimuli, automatische Stabilisatoren wirken lassen',
      'Kommunikation zur Dämpfung überzogener Erwartungen'
    ]
  },
  {
    key: 'supply',
    title: 'Angebots-/Kosteninflation',
    summary: 'Produktionskosten steigen – Unternehmen geben sie weiter. Klassisch bei Energie- oder Rohstoffschocks.',
    typicalTriggers: [
      'Sprunghaft höhere Energie- oder Rohstoffpreise',
      'Lieferkettenausfälle, Transportprobleme, Naturereignisse',
      'Regulatorische Eingriffe (z. B. CO₂-Preis, Mindestlohnanstiege)' 
    ],
    indicators: [
      'Anziehende Produzentenpreise (PPI) vor Verbraucherpreisen',
      'Margendruck bei energieintensiven Sektoren',
      'Kostenweitergabe konzentriert in bestimmten Gütergruppen'
    ],
    policyResponse: [
      'Temporäre Stützmaßnahmen für besonders betroffene Haushalte/Unternehmen',
      'Investitionen in Effizienz, Diversifizierung von Lieferketten fördern',
      'Geldpolitik: abwägen zwischen Inflationsbekämpfung und Wachstum'
    ]
  },
  {
    key: 'imported',
    title: 'Importierte Inflation',
    summary: 'Steigende Weltmarktpreise oder ein schwächerer Wechselkurs verteuern Importe und schlagen auf den VPI durch.',
    typicalTriggers: [
      'Schwäche der eigenen Währung gegenüber USD oder wichtigen Handelspartnern',
      'Globale Energie- und Lebensmittelpreisschübe',
      'Zölle, Handelskonflikte, Lieferkettenverlagerungen'
    ],
    indicators: [
      'Starker Beitrag importierter Güter in Inflationszerlegung',
      'Wachsende Leistungsbilanzdefizite',
      'Parallel steigende Terms of Trade oder Wechselkursvolatilität'
    ],
    policyResponse: [
      'Wechselkurs stabilisieren (Vertrauen, ggf. Interventionen)',
      'Handel diversifizieren, strategische Reserven aufbauen',
      'Geldpolitik: Zweitrundeneffekte im Blick behalten'
    ]
  },
  {
    key: 'wages',
    title: 'Lohn-Preis-Spirale',
    summary: 'Steigende Preise führen zu höheren Lohnforderungen, die wiederum Kosten und Preise anheben – Erwartungen sind der Katalysator.',
    typicalTriggers: [
      'Inflationserwartungen entankern sich, Gewerkschaften verlangen Inflationsausgleich',
      'Produktivität stagniert, während Löhne kräftig steigen',
      'Indexierte Verträge verbreiten Preisanpassungen automatisch'
    ],
    indicators: [
      'Löhne wachsen schneller als Produktivität über mehrere Quartale',
      'Dienstleistungsinflation bleibt hartnäckig hoch',
      'Tarifabschlüsse mit mehrjährigen Indexklauseln'
    ],
    policyResponse: [
      'Erwartungsmanagement durch glaubwürdige Inflationsziele',
      'Sozialpartner-Dialog, um Einmalzahlungen statt dauerhafter Lohnsprünge zu stärken',
      'Strenge Geldpolitik, falls zweite Runde droht'
    ]
  }
];

export interface InflationSpeedCategory {
  label: string;
  range: string;
  description: string;
  example: string;
}

export const inflationSpeedCategories: InflationSpeedCategory[] = [
  {
    label: 'Schleichend',
    range: '0–3 % p. a.',
    description: 'Preisauftrieb ist moderat, Unternehmen und Haushalte können planen – Zielbereich vieler Zentralbanken.',
    example: 'Eurozone 1999–2007 (~2%)'
  },
  {
    label: 'Trabend',
    range: '3–10 % p. a.',
    description: 'Kaufkraft erodiert spürbar, Indexierungen nehmen zu, Politik reagiert meist restriktiver.',
    example: 'USA späte 1960er (~5–6%)'
  },
  {
    label: 'Galoppierend',
    range: '10–50 % p. a.',
    description: 'Preise steigen schnell, Verträge werden sehr kurz, Barbestände verlieren massiv an Wert.',
    example: 'Brasilien Anfang 1990er (>20%)'
  },
  {
    label: 'Hyperinflation',
    range: '> 50 % pro Monat',
    description: 'Preisspirale außer Kontrolle; Geld wird sofort ausgegeben, Wirtschaft kollabiert.',
    example: 'Zimbabwe 2008, Ungarn 1946'
  }
];

export interface InflationPhenomenon {
  title: string;
  description: string;
  example: string;
}

export const inflationPhenomena: InflationPhenomenon[] = [
  {
    title: 'Shrinkflation',
    description: 'Gleicher Preis, kleinere Packung – verdeckte Preiserhöhung ohne sichtbare Zahl auf dem Preisschild.',
    example: 'Süßwaren: 200g → 180g bei identischem Preis'
  },
  {
    title: 'Skimpflation',
    description: 'Qualität oder Service sinken, Preis bleibt. Kunden bemerken langsamer den realen Aufschlag.',
    example: 'Hotelreinigung nur noch alle zwei Tage'
  },
  {
    title: '„Greedflation“-Debatte',
    description: 'Diskussion, ob Unternehmen Marktmacht nutzen, um Margen auszubauen. Evidenz uneinheitlich.',
    example: 'Lebensmittelketten 2022/23: kurze Spitzen, später Margendruck'
  }
];

export interface InflationComparisonRow {
  topic: string;
  stagflation: string;
  deflation: string;
}

export const inflationComparisonRows: InflationComparisonRow[] = [
  {
    topic: 'Typische Lage',
    stagflation: 'Hohe Inflation bei stagnierendem oder schrumpfendem BIP, Arbeitslosigkeit steigt.',
    deflation: 'Fallende Preise bei schwacher Nachfrage, häufig begleitet von Kredit- und Bilanzabbau.'
  },
  {
    topic: 'Treiber',
    stagflation: 'Angebotsschocks (Öl), Lohn-Preis-Spiralen, schlechte Erwartungssteuerung.',
    deflation: 'Nachfrageschwäche, Sparüberschüsse, fallende Vermögenspreise, Schuldenabbau.'
  },
  {
    topic: 'Risiken',
    stagflation: 'Reallöhne fallen, Profitabilität leidet, schwierige geldpolitische Abwägung.',
    deflation: 'Schuldenlast steigt real, Konsumaufschub, Gefahr einer Abwärtsspirale.'
  },
  {
    topic: 'Politikreaktion',
    stagflation: 'Angebotsseite stärken, Energieabhängigkeit reduzieren, glaubwürdige Zinsanhebungen.',
    deflation: 'Lockere Geld- und Fiskalpolitik, Kreditkanäle reparieren, Erwartungen aufbrechen.'
  }
];
