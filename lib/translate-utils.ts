import { translationDictionary } from "./translations"

export const languageNames: Record<string, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  tr: "Türkçe",
  ar: "العربية",
  ru: "Русский",
  zh: "中文",
  hi: "हिन्दी",
}

export const languageFlags: Record<string, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
  fr: "🇫🇷",
  it: "🇮🇹",
  tr: "🇹🇷",
  ar: "🇸🇦",
  ru: "🇷🇺",
  zh: "🇨🇳",
  hi: "🇮🇳",
}

export const speechLangMap: Record<string, string> = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  it: "it-IT",
  tr: "tr-TR",
  ar: "ar-SA",
  ru: "ru-RU",
  zh: "zh-CN",
  hi: "hi-IN",
}

export const languageDisplayNames: Record<string, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  tr: "Türkçe",
  ar: "العربية",
  ru: "Русский",
  zh: "中文",
  hi: "हिन्दी",
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  if (targetLanguage === "de") return text

  // Fallback to word-by-word translation
  let translatedText = text

  // Apply translations from dictionary
  Object.entries(translationDictionary).forEach(([german, translations]) => {
    if (translations[targetLanguage as keyof typeof translations]) {
      const regex = new RegExp(`\\b${german.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi")
      translatedText = translatedText.replace(
        regex,
        translations[targetLanguage as keyof typeof translations] || german,
      )
    }
  })

  return translatedText
}
