import { translationDictionary } from './translations'

export const languageNames: Record<string, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  tr: 'Türkçe',
  ar: 'العربية',
  ru: 'Русский',
  zh: '中文',
  hi: 'हिन्दी'
}

export const languageFlags: Record<string, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
  it: '🇮🇹',
  tr: '🇹🇷',
  ar: '🇸🇦',
  ru: '🇷🇺',
  zh: '🇨🇳',
  hi: '🇮🇳'
}

export function translateText(text: string, targetLanguage: string): string {
  if (targetLanguage === 'de') return text
  
  // Check for pre-translated content first (highest priority)
  // This will be handled by the component using question.translations
  
  // Fallback to word-by-word translation
  let translatedText = text
  
  // Apply translations from dictionary
  Object.entries(translationDictionary).forEach(([german, translations]) => {
    if (translations[targetLanguage as keyof typeof translations]) {
      const regex = new RegExp(`\\b${german.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
      translatedText = translatedText.replace(regex, translations[targetLanguage as keyof typeof translations] || german)
    }
  })
  
  return translatedText
}
