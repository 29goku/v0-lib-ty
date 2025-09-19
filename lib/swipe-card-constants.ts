// SwipeCard constants and configuration

// Animation configuration
export const SWIPE_ANIMATION_CONFIG = {
  SWIPE_VELOCITY_THRESHOLD: 600,
  SWIPE_OFFSET_THRESHOLD: 150,
  DRAG_CONSTRAINTS: { left: -300, right: 300 },
  DRAG_ELASTIC: 0.05,
  ROTATION_RANGE: [-15, 0, 15],
  SCALE_RANGE: [0.98, 0.99, 1, 0.99, 0.98],
  SCALE_POSITIONS: [-300, -200, 0, 200, 300],
  ROTATION_POSITIONS: [-300, 0, 300],
  INDICATOR_OPACITY_RANGES: {
    prev: [-300, -80, 0],
    next: [0, 80, 300]
  },
  INDICATOR_SCALE_RANGES: {
    prev: [1.1, 1, 0.9],
    next: [0.9, 1, 1.1]
  },
  SPRING_CONFIG: {
    stiffness: 300,
    damping: 35,
    mass: 1
  },
  EXIT_ANIMATION: {
    stiffness: 200,
    damping: 30,
    duration: 0.4
  }
} as const

// Text-to-speech configuration
export const SPEECH_CONFIG = {
  rate: 0.8,
  pitch: 1,
  languageMap: {
    en: "en-US",
    es: "es-ES",
    fr: "fr-FR",
    it: "it-IT",
    tr: "tr-TR",
    ar: "ar-SA",
    ru: "ru-RU",
    zh: "zh-CN",
    hi: "hi-IN",
  } as const,
  defaultGermanLang: "de-DE"
} as const

// Language display names
export const LANGUAGE_DISPLAY_NAMES = {
  en: "ENGLISH",
  es: "ESPAÑOL",
  fr: "FRANÇAIS",
  it: "ITALIANO",
  tr: "TÜRKÇE",
  ar: "العربية",
  ru: "РУССКИЙ",
  zh: "中文",
  hi: "हिंदी",
} as const

// Card styling constants
export const CARD_STYLES = {
  minHeight: 560,
  imageMaxHeight: "300px",
  transitionDuration: "300ms",
  transitionEasing: "cubic-bezier(0.4, 0, 0.2, 1)"
} as const

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  navigation: {
    left: ['ArrowLeft', 'a', 'A'],
    right: ['ArrowRight', 'd', 'D']
  },
  answers: {
    digitPattern: /^Digit([1-4])$/,
    numpadPattern: /^Numpad([1-4])$/,
    keyPattern: /^[1-4]$/
  }
} as const

// German text detection patterns
export const GERMAN_TEXT_PATTERNS = [
  " der ", " die ", " das ", " und ", " ist ", " ein ", " eine ",
  " in deutschland", " jahr", "jahre", "das ist", "die ", "der ", "in \\b"
] as const
