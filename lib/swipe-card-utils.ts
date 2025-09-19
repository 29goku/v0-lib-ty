import { SPEECH_CONFIG, LANGUAGE_DISPLAY_NAMES } from "./swipe-card-constants"
import { translateText } from "./translation-service"

// Text-to-speech utility
export const speakText = (text: string, showTranslation: boolean, language: string) => {
  if ("speechSynthesis" in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    // Set language for speech synthesis
    if (showTranslation) {
      utterance.lang = SPEECH_CONFIG.languageMap[language as keyof typeof SPEECH_CONFIG.languageMap] || "en-US"
    } else {
      utterance.lang = SPEECH_CONFIG.defaultGermanLang // German for original text
    }

    utterance.rate = SPEECH_CONFIG.rate
    utterance.pitch = SPEECH_CONFIG.pitch
    speechSynthesis.speak(utterance)
  }
}

// Image handling utilities
export const getImageSrc = (imageError: boolean, questionImage?: string) => {
  if (imageError || !questionImage) {
    return "/placeholder.svg?height=300&width=400&text=Question+Image"
  }
  return questionImage
}

// Translation utilities
export const getLanguageDisplayName = (language: string): string => {
  return LANGUAGE_DISPLAY_NAMES[language as keyof typeof LANGUAGE_DISPLAY_NAMES] || language.toUpperCase()
}

// Translation logic for questions
export const normalizeQuestionTranslations = (rawTranslations: any) => {
  if (!rawTranslations) return null

  const normalizedOptions = rawTranslations.options || rawTranslations.optionTranslations || undefined
  const normalizedExplanation = rawTranslations.explanation || rawTranslations.explanationTranslations || undefined

  return {
    question: rawTranslations.question,
    options: normalizedOptions,
    explanation: normalizedExplanation,
  }
}

// Keyboard event utilities
export const getOptionIndexFromKeyboard = (event: KeyboardEvent): number | null => {
  let optionIndex: number | null = null

  // Prefer event.code when available (handles physical key position and numpad reliably)
  if (typeof (event as any).code === 'string') {
    const code: string = (event as any).code
    const digitMatch = code.match(/^Digit([1-4])$/)
    const numpadMatch = code.match(/^Numpad([1-4])$/)
    if (digitMatch) {
      optionIndex = Number(digitMatch[1]) - 1
    } else if (numpadMatch) {
      optionIndex = Number(numpadMatch[1]) - 1
    }
  }

  // Fallback to event.key (covers cases like mobile keyboards or older browsers)
  if (optionIndex === null) {
    if (/^[1-4]$/.test(event.key)) {
      optionIndex = Number(event.key) - 1
    }
  }

  return optionIndex
}

// Check if user is typing in an input field
export const isTypingInInput = (target: HTMLElement | null): boolean => {
  if (!target) return false

  const tag = target.tagName
  const isEditable = target.getAttribute && (target.getAttribute('contenteditable') === 'true')

  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || isEditable
}
