/**
 * German States Configuration
 * Complete mapping of all 16 German federal states (Bundesländer)
 * with codes, translations, and metadata
 *
 * Data source: https://www.lebenindeutschland.eu/
 */

export interface State {
  code: string
  slug: string
  nameDE: string
  nameEN: string
  description: string
  emoji: string
}

/**
 * Complete list of all 16 German states
 * Sorted alphabetically by German name
 */
export const GERMAN_STATES: State[] = [
  {
    code: "bw",
    slug: "baden-wuerttemberg",
    nameDE: "Baden-Württemberg",
    nameEN: "Baden-Württemberg",
    description: "Das Ländle, 35.751 km² groß",
    emoji: "🏰",
  },
  {
    code: "by",
    slug: "bayern",
    nameDE: "Bayern",
    nameEN: "Bavaria",
    description: "Der Freistaat ist mit 70.550 km² das größte Bundesland",
    emoji: "🍺",
  },
  {
    code: "be",
    slug: "berlin",
    nameDE: "Berlin",
    nameEN: "Berlin",
    description: "Die Hauptstadt der Bundesrepublik Deutschland",
    emoji: "🏛️",
  },
  {
    code: "bb",
    slug: "brandenburg",
    nameDE: "Brandenburg",
    nameEN: "Brandenburg",
    description: "Reich an Naturparks, Wäldern, Seen und Wassergebieten",
    emoji: "🌲",
  },
  {
    code: "hb",
    slug: "bremen",
    nameDE: "Bremen",
    nameEN: "Bremen",
    description: "Zwei-Städte-Staat an der Weser",
    emoji: "⛵",
  },
  {
    code: "hh",
    slug: "hamburg",
    nameDE: "Hamburg",
    nameEN: "Hamburg",
    description: "Stadtstaat und zweitgrößte Stadt Deutschlands",
    emoji: "🚢",
  },
  {
    code: "he",
    slug: "hessen",
    nameDE: "Hessen",
    nameEN: "Hesse",
    description: "Eine der am dichtesten besiedelten Regionen Deutschlands",
    emoji: "🏙️",
  },
  {
    code: "mv",
    slug: "mecklenburg-vorpommern",
    nameDE: "Mecklenburg-Vorpommern",
    nameEN: "Mecklenburg-Western Pomerania",
    description: "Wasserreiches Land an der Ostsee mit ca. 2000 km Küstenlinie",
    emoji: "🌊",
  },
  {
    code: "ni",
    slug: "niedersachsen",
    nameDE: "Niedersachsen",
    nameEN: "Lower Saxony",
    description: "Das flächenmäßig zweitgrößte Bundesland",
    emoji: "🚜",
  },
  {
    code: "nw",
    slug: "nordrhein-westfalen",
    nameDE: "Nordrhein-Westfalen",
    nameEN: "North Rhine-Westphalia",
    description: "Mit 17,9 Mio. das bevölkerungsreichste Bundesland",
    emoji: "👥",
  },
  {
    code: "rp",
    slug: "rheinland-pfalz",
    nameDE: "Rheinland-Pfalz",
    nameEN: "Rhineland-Palatinate",
    description: "Ein junges Land auf historischem Boden",
    emoji: "🏛️",
  },
  {
    code: "sl",
    slug: "saarland",
    nameDE: "Saarland",
    nameEN: "Saarland",
    description: "Das kleinste Flächenland Deutschlands",
    emoji: "🟫",
  },
  {
    code: "sn",
    slug: "sachsen",
    nameDE: "Sachsen",
    nameEN: "Saxony",
    description: "Freistaat Sachsen",
    emoji: "🏰",
  },
  {
    code: "st",
    slug: "sachsen-anhalt",
    nameDE: "Sachsen-Anhalt",
    nameEN: "Saxony-Anhalt",
    description: "Bundesland mit der höchsten Dichte an UNESCO-Weltkulturerben in Deutschland",
    emoji: "🌍",
  },
  {
    code: "sh",
    slug: "schleswig-holstein",
    nameDE: "Schleswig-Holstein",
    nameEN: "Schleswig-Holstein",
    description: "Das Land zwischen der Nord- und Ostsee",
    emoji: "🧭",
  },
  {
    code: "th",
    slug: "thueringen",
    nameDE: "Thüringen",
    nameEN: "Thuringia",
    description: "Freistaat Thüringen",
    emoji: "🌲",
  },
]

/**
 * Utility functions for state operations
 */

/** Get state by code (e.g., "be" for Berlin) */
export const getStateByCode = (code: string): State | undefined => {
  return GERMAN_STATES.find((s) => s.code.toLowerCase() === code.toLowerCase())
}

/** Get state by slug (e.g., "berlin") */
export const getStateBySlug = (slug: string): State | undefined => {
  return GERMAN_STATES.find((s) => s.slug.toLowerCase() === slug.toLowerCase())
}

/** Get state name in specified language */
export const getStateName = (code: string, language: "de" | "en" = "de"): string => {
  const state = getStateByCode(code)
  if (!state) return ""
  return language === "de" ? state.nameDE : state.nameEN
}

/** Get all state codes */
export const getAllStateCodes = (): string[] => {
  return GERMAN_STATES.map((s) => s.code)
}

/** Get all state slugs */
export const getAllStateSlugs = (): string[] => {
  return GERMAN_STATES.map((s) => s.slug)
}

/** Create a lookup map: code -> State */
export const createStateCodeMap = (): Record<string, State> => {
  const map: Record<string, State> = {}
  GERMAN_STATES.forEach((state) => {
    map[state.code] = state
  })
  return map
}

/** Create a lookup map: slug -> State */
export const createStateSlugMap = (): Record<string, State> => {
  const map: Record<string, State> = {}
  GERMAN_STATES.forEach((state) => {
    map[state.slug] = state
  })
  return map
}
