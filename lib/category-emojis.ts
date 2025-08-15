export function getCategoryEmoji(category: string): string {
  const categoryEmojiMap: Record<string, string> = {
    // German keys
    "Politik in der Demokratie": "🏛️",
    Politik: "🏛️",
    "Geschichte und Verantwortung": "📚",
    "Mensch und Gesellschaft": "👥",
    "Grundlagen des Zusammenlebens": "🤝",
    Verfassungsorgane: "⚖️",
    Föderalismus: "🏢",
    Rechtsstaat: "📜",
    Sozialstaat: "🛡️",
    Grundrechte: "✊",
    "Wahlen und Beteiligung": "🗳️",
    "Parteien und Verbände": "🎭",
    Medien: "📺",
    "Internationale Beziehungen": "🌍",
    "Deutschland in Europa": "🇪🇺",
    "Migration und Integration": "🌐",
    Wirtschaft: "💼",
    Umwelt: "🌱",
    Bildung: "🎓",
    Kultur: "🎨",
    Religion: "⛪",
    Sprache: "💬",
    Alltag: "🏠",
    Geografie: "🗺️",
    Geschichte: "📖",
    Gesellschaft: "👥",
    Recht: "⚖️",
    "Wirtschaft und Arbeit": "💼",
    "Kultur und Bildung": "🎓",
    // English keys
    Politics: "🏛️",
    Law: "⚖️",
    Culture: "🎨",
    Society: "👥",
    History: "📖",
    Economy: "💼",
    Environment: "�",
    Education: "�🎓",
    Religion: "⛪",
    Language: "💬",
    Everyday: "🏠",
    Geography: "🗺️",
    default: "🔥",
  }

  // Normalize input for matching
  const normalizedCategory = category.trim().toLowerCase();

  // Try to find a matching key (case-insensitive)
  for (const key in categoryEmojiMap) {
    if (key.toLowerCase() === normalizedCategory) {
      return categoryEmojiMap[key];
    }
  }

  return categoryEmojiMap.default;
}
