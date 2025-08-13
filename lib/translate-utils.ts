import { translationDictionary } from "./translations"

// Language name mappings
export const languageNames: Record<string, string> = {
  en: "EN",
  es: "ES",
  fr: "FR",
  it: "IT",
  tr: "TR",
  ar: "AR",
  ru: "RU",
  zh: "ZH",
  hi: "HI",
}

// Speech synthesis language mappings
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

// Language display names
export const languageDisplayNames: Record<string, string> = {
  en: "ENGLISH",
  es: "ESPAÑOL",
  fr: "FRANÇAIS",
  it: "ITALIANO",
  tr: "TÜRKÇE",
  ar: "العربية",
  ru: "РУССКИЙ",
  zh: "中文",
  hi: "हिंदी",
}

// Get translated question content from JSON data
export const getTranslatedQuestion = (question: any, targetLanguage: string) => {
  console.log(`🔍 Getting translation for question ${question.id} in ${targetLanguage}`)

  // Check if translations exist in the question data
  if (question.translations && question.translations[targetLanguage]) {
    console.log(`✅ Found pre-translated question for ${targetLanguage}`)

    return {
      question: question.translations[targetLanguage],
      options: question.optionTranslations?.[targetLanguage] || question.options,
      explanation: question.explanationTranslations?.[targetLanguage] || question.explanation,
    }
  }

  console.log(`❌ No pre-translation found for ${targetLanguage}, falling back to word-by-word`)
  return null
}

// Enhanced translation service - now prioritizes JSON translations
export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  // Simulate realistic API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  console.log(`🔍 Translating: "${text}" to ${targetLanguage}`)

  // First, try exact match from dictionary
  if (translationDictionary[text] && translationDictionary[text][targetLanguage]) {
    console.log(`✅ Found exact translation for "${text}":`, translationDictionary[text][targetLanguage])
    return translationDictionary[text][targetLanguage]
  }

  // Second, try to translate by replacing multiple terms
  let translatedText = text
  let hasTranslations = false

  // Sort by length (longest first) to avoid partial replacements
  const sortedKeys = Object.keys(translationDictionary).sort((a, b) => b.length - a.length)

  for (const germanTerm of sortedKeys) {
    if (translatedText.includes(germanTerm) && translationDictionary[germanTerm][targetLanguage]) {
      const replacement = translationDictionary[germanTerm][targetLanguage]
      translatedText = translatedText.replace(new RegExp(germanTerm, "gi"), replacement)
      hasTranslations = true
      console.log(`🔄 Replaced "${germanTerm}" with "${replacement}"`)
    }
  }

  // If we made any replacements, return the result
  if (hasTranslations) {
    console.log(`✅ Partial translation result: "${translatedText}"`)
    return translatedText
  }

  // Third, try basic pattern matching for common German question structures
  if (targetLanguage === "en") {
    if (text.includes("?")) {
      // Handle question patterns
      if (text.startsWith("Was ist")) {
        const result = text.replace("Was ist", "What is").replace("?", "?")
        console.log(`🔄 Pattern match (Was ist): "${result}"`)
        return result
      }
      if (text.startsWith("Wie heißt")) {
        const result = text.replace("Wie heißt", "What is called").replace("?", "?")
        console.log(`🔄 Pattern match (Wie heißt): "${result}"`)
        return result
      }
      if (text.startsWith("Wann wurde")) {
        const result = text.replace("Wann wurde", "When was").replace("?", "?")
        console.log(`🔄 Pattern match (Wann wurde): "${result}"`)
        return result
      }
      if (text.startsWith("Welche")) {
        const result = text.replace("Welche", "Which").replace("?", "?")
        console.log(`🔄 Pattern match (Welche): "${result}"`)
        return result
      }
      if (text.startsWith("Wer")) {
        const result = text.replace("Wer", "Who").replace("?", "?")
        console.log(`🔄 Pattern match (Wer): "${result}"`)
        return result
      }
    }
  }

  // Final fallback - return with language tag and original text
  const fallbackResult = `[${languageNames[targetLanguage] || targetLanguage.toUpperCase()}] ${text}`
  console.log(`❌ No translation found for "${text}", using fallback: "${fallbackResult}"`)
  return fallbackResult
}
