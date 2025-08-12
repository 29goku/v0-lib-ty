"use client"

import { useState, useEffect } from "react"
import { motion, type PanInfo, useMotionValue, useTransform } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flag, Volume2, Languages } from "lucide-react"
import { useStore } from "@/lib/store"
import { getTranslation } from "@/lib/i18n"

interface Question {
  id: string
  category: string
  question: string
  options: string[]
  answerIndex: number
  explanation: string
  image?: string
}

interface SwipeCardProps {
  question: Question
  onSwipe: (direction: "left" | "right") => void
  onAnswerSelect: (answerIndex: number) => void
  showAnswer: boolean
  onFlag: () => void
  isFlagged: boolean
  isTranslated?: boolean
  onTranslate?: () => void
}

// Translation service - maps common German citizenship test content to multiple languages
const translateText = (text: string, targetLanguage: string): string => {
  const translations: Record<string, Record<string, string>> = {
    // Common question patterns
    "Was ist die Hauptstadt von Deutschland?": {
      en: "What is the capital of Germany?",
      es: "¿Cuál es la capital de Alemania?",
      fr: "Quelle est la capitale de l'Allemagne?",
      it: "Qual è la capitale della Germania?",
      tr: "Almanya'nın başkenti nedir?",
      ar: "ما هي عاصمة ألمانيا؟",
      ru: "Какая столица Германии?",
      zh: "德国的首都是什么？",
      hi: "जर्मनी की राजधानी क्या है?",
    },
    "Wann wurde die Berliner Mauer gebaut?": {
      en: "When was the Berlin Wall built?",
      es: "¿Cuándo se construyó el Muro de Berlín?",
      fr: "Quand le mur de Berlin a-t-il été construit?",
      it: "Quando è stato costruito il Muro di Berlino?",
      tr: "Berlin Duvarı ne zaman inşa edildi?",
      ar: "متى تم بناء جدار برلين؟",
      ru: "Когда была построена Берлинская стена?",
      zh: "柏林墙是什么时候建造的？",
      hi: "बर्लिन की दीवार कब बनाई गई थी?",
    },
    // Common options
    Berlin: {
      en: "Berlin",
      es: "Berlín",
      fr: "Berlin",
      it: "Berlino",
      tr: "Berlin",
      ar: "برلين",
      ru: "Берлин",
      zh: "柏林",
      hi: "बर्लिन",
    },
    München: {
      en: "Munich",
      es: "Múnich",
      fr: "Munich",
      it: "Monaco",
      tr: "Münih",
      ar: "ميونيخ",
      ru: "Мюнхен",
      zh: "慕尼黑",
      hi: "म्यूनिख",
    },
    Frankfurt: {
      en: "Frankfurt",
      es: "Fráncfort",
      fr: "Francfort",
      it: "Francoforte",
      tr: "Frankfurt",
      ar: "فرانكفورت",
      ru: "Франкфурт",
      zh: "法兰克福",
      hi: "फ्रैंकफर्ट",
    },
    Hamburg: {
      en: "Hamburg",
      es: "Hamburgo",
      fr: "Hambourg",
      it: "Amburgo",
      tr: "Hamburg",
      ar: "هامبورغ",
      ru: "Гамбург",
      zh: "汉堡",
      hi: "हैम्बर्ग",
    },
  }

  // Check for exact matches first
  if (translations[text] && translations[text][targetLanguage]) {
    return translations[text][targetLanguage]
  }

  // Fallback: return formatted text with language indicator
  const languageNames: Record<string, string> = {
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

  return `[${languageNames[targetLanguage] || targetLanguage.toUpperCase()}] ${text}`
}

export default function SwipeCard({
  question,
  onSwipe,
  onAnswerSelect,
  showAnswer,
  onFlag,
  isFlagged,
  isTranslated = false,
  onTranslate,
}: SwipeCardProps) {
  const { language } = useStore()
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [imageError, setImageError] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [translatedContent, setTranslatedContent] = useState<{
    question: string
    options: string[]
    explanation: string
  } | null>(null)

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const t = getTranslation(language)

  // Reset states when question changes
  useEffect(() => {
    setSelectedAnswer(null)
    setImageError(false)
    setTranslatedContent(null)
  }, [question.id])

  const handleAnswerClick = (answerIndex: number) => {
    if (showAnswer) return
    setSelectedAnswer(answerIndex)
    onAnswerSelect(answerIndex)
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100
    if (info.offset.x > threshold) {
      onSwipe("right")
    } else if (info.offset.x < -threshold) {
      onSwipe("left")
    }
  }

  const handleTranslate = async () => {
    if (!onTranslate) return

    setIsTranslating(true)

    try {
      // Simulate translation delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (!isTranslated) {
        // Translate to selected language
        const translatedQuestion = translateText(question.question, language)
        const translatedOptions = question.options.map((option) => translateText(option, language))
        const translatedExplanation = translateText(question.explanation, language)

        setTranslatedContent({
          question: translatedQuestion,
          options: translatedOptions,
          explanation: translatedExplanation,
        })
      } else {
        // Clear translation (back to German)
        setTranslatedContent(null)
      }

      onTranslate()
    } finally {
      setIsTranslating(false)
    }
  }

  const handleReadAloud = () => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const textToSpeak = isTranslated && translatedContent ? translatedContent.question : question.question

      const utterance = new SpeechSynthesisUtterance(textToSpeak)

      // Set language based on current state
      if (isTranslated) {
        const languageCodes: Record<string, string> = {
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
        utterance.lang = languageCodes[language] || "en-US"
      } else {
        utterance.lang = "de-DE" // German
      }

      utterance.rate = 0.8
      utterance.pitch = 1

      window.speechSynthesis.speak(utterance)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const getImageSrc = (imagePath?: string) => {
    if (!imagePath || imageError) {
      return `/placeholder.svg?height=200&width=400&text=Question+Image`
    }
    return imagePath
  }

  const displayContent =
    isTranslated && translatedContent
      ? translatedContent
      : {
          question: question.question,
          options: question.options,
          explanation: question.explanation,
        }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, opacity }}
      className="cursor-grab active:cursor-grabbing"
      whileTap={{ scale: 0.95 }}
    >
      <Card className="w-full max-w-2xl mx-auto border-2 border-cyan-400/50 bg-gradient-to-br from-black/80 to-purple-900/30 backdrop-blur-xl shadow-2xl shadow-cyan-500/25 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 animate-pulse"></div>

        <CardContent className="p-6 md:p-8 relative z-10">
          {/* Header with controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-400/30">
                <span className="text-purple-300 font-bold text-sm">{question.category}</span>
              </div>
              {isTranslated && (
                <div className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-400/30">
                  <span className="text-green-300 font-bold text-sm">{language.toUpperCase()}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleReadAloud}
                className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/40 hover:to-cyan-500/40 text-cyan-300 border border-cyan-400/30 p-2"
                size="sm"
              >
                <Volume2 className="w-4 h-4" />
              </Button>

              {onTranslate && (
                <Button
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/40 hover:to-emerald-500/40 text-green-300 border border-green-400/30 p-2"
                  size="sm"
                >
                  <Languages className="w-4 h-4" />
                </Button>
              )}

              <Button
                onClick={onFlag}
                className={`p-2 border ${
                  isFlagged
                    ? "bg-gradient-to-r from-yellow-500/40 to-orange-500/40 text-yellow-300 border-yellow-400/50"
                    : "bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-300 border-gray-400/30 hover:from-yellow-500/20 hover:to-orange-500/20 hover:text-yellow-300"
                }`}
                size="sm"
              >
                <Flag className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <div
              className={`p-6 rounded-xl border-2 ${
                isTranslated
                  ? "bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-400/50"
                  : "bg-gradient-to-r from-gray-900/50 to-black/50 border-gray-600/50"
              }`}
            >
              <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
                {isTranslating ? "Translating..." : displayContent.question}
              </h2>
            </div>
          </div>

          {/* Image if present */}
          {question.image && (
            <div className="mb-8 flex justify-center">
              <div className="relative rounded-xl overflow-hidden border-2 border-cyan-400/30 shadow-lg shadow-cyan-500/25">
                <img
                  src={getImageSrc(question.image) || "/placeholder.svg"}
                  alt="Question illustration"
                  className="max-w-full h-auto max-h-64 object-contain"
                  onError={handleImageError}
                  crossOrigin="anonymous"
                />
              </div>
            </div>
          )}

          {/* Answer Options */}
          <div className="space-y-4 mb-8">
            {displayContent.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === question.answerIndex
              const showCorrectAnswer = showAnswer && isCorrect
              const showIncorrectAnswer = showAnswer && isSelected && !isCorrect

              return (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={showAnswer}
                  className={`w-full p-4 md:p-6 rounded-xl border-2 text-left transition-all duration-300 transform hover:scale-[1.02] ${
                    showCorrectAnswer
                      ? "bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-green-400 text-green-100 shadow-lg shadow-green-500/25"
                      : showIncorrectAnswer
                        ? "bg-gradient-to-r from-red-500/30 to-pink-500/30 border-red-400 text-red-100 shadow-lg shadow-red-500/25"
                        : isSelected
                          ? "bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border-cyan-400 text-cyan-100 shadow-lg shadow-cyan-500/25"
                          : "bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-gray-600/50 text-gray-200 hover:border-cyan-400/50 hover:bg-gradient-to-r hover:from-cyan-900/20 hover:to-blue-900/20"
                  }`}
                  whileHover={{ scale: showAnswer ? 1 : 1.02 }}
                  whileTap={{ scale: showAnswer ? 1 : 0.98 }}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 font-bold ${
                        showCorrectAnswer
                          ? "border-green-400 bg-green-500/30 text-green-100"
                          : showIncorrectAnswer
                            ? "border-red-400 bg-red-500/30 text-red-100"
                            : isSelected
                              ? "border-cyan-400 bg-cyan-500/30 text-cyan-100"
                              : "border-gray-500 text-gray-400"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-semibold text-base md:text-lg flex-1">{isTranslating ? "..." : option}</span>
                    {showCorrectAnswer && <div className="text-2xl ml-4">✅</div>}
                    {showIncorrectAnswer && <div className="text-2xl ml-4">❌</div>}
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Explanation */}
          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`p-6 rounded-xl border-2 ${
                isTranslated
                  ? "bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-blue-400/50"
                  : "bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-400/50"
              }`}
            >
              <h3 className="text-lg font-bold text-purple-300 mb-3">💡 {t.explanation}</h3>
              <p className="text-gray-200 leading-relaxed">
                {isTranslating ? "Translating explanation..." : displayContent.explanation}
              </p>
            </motion.div>
          )}

          {/* Swipe Instructions */}
          {!showAnswer && (
            <div className="text-center mt-8">
              <p className="text-gray-400 text-sm font-semibold">👈 {t.swipeInstructions} 👉</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
