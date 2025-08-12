"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flag, Languages, Volume2 } from "lucide-react"
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion"
import { useStore } from "@/lib/store"
import { getTranslation } from "@/lib/i18n"
import type { Question } from "@/lib/store"

interface SwipeCardProps {
  question: Question
  onSwipe: (direction: "left" | "right") => void
  onFlag: () => void
  isFlagged: boolean
  showAnswer?: boolean
  onAnswerSelect?: (index: number) => void
  isTranslated?: boolean
  onTranslate?: () => void
}

// Translation service - simulates real translation API
const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock translations for different languages
  const translations: Record<string, Record<string, string>> = {
    en: {
      "Wie heißt die deutsche Verfassung?": "What is the German constitution called?",
      Grundgesetz: "Basic Law",
      Bundesgesetz: "Federal Law",
      Gesetzbuch: "Legal Code",
      Verfassungsgesetz: "Constitutional Law",
      "Das Grundgesetz ist die deutsche Verfassung.": "The Basic Law is the German constitution.",
      "Wann wurde die Bundesrepublik Deutschland gegründet?": "When was the Federal Republic of Germany founded?",
      "1945": "1945",
      "1949": "1949",
      "1989": "1989",
      "1990": "1990",
      "Die Bundesrepublik Deutschland wurde 1949 gegründet.": "The Federal Republic of Germany was founded in 1949.",
    },
    es: {
      "Wie heißt die deutsche Verfassung?": "¿Cómo se llama la constitución alemana?",
      Grundgesetz: "Ley Fundamental",
      Bundesgesetz: "Ley Federal",
      Gesetzbuch: "Código Legal",
      Verfassungsgesetz: "Ley Constitucional",
      "Das Grundgesetz ist die deutsche Verfassung.": "La Ley Fundamental es la constitución alemana.",
      "Wann wurde die Bundesrepublik Deutschland gegründet?": "¿Cuándo se fundó la República Federal de Alemania?",
      "1945": "1945",
      "1949": "1949",
      "1989": "1989",
      "1990": "1990",
      "Die Bundesrepublik Deutschland wurde 1949 gegründet.": "La República Federal de Alemania fue fundada en 1949.",
    },
    fr: {
      "Wie heißt die deutsche Verfassung?": "Comment s'appelle la constitution allemande?",
      Grundgesetz: "Loi fondamentale",
      Bundesgesetz: "Loi fédérale",
      Gesetzbuch: "Code juridique",
      Verfassungsgesetz: "Loi constitutionnelle",
      "Das Grundgesetz ist die deutsche Verfassung.": "La Loi fondamentale est la constitution allemande.",
      "Wann wurde die Bundesrepublik Deutschland gegründet?":
        "Quand la République fédérale d'Allemagne a-t-elle été fondée?",
      "1945": "1945",
      "1949": "1949",
      "1989": "1989",
      "1990": "1990",
      "Die Bundesrepublik Deutschland wurde 1949 gegründet.":
        "La République fédérale d'Allemagne a été fondée en 1949.",
    },
    it: {
      "Wie heißt die deutsche Verfassung?": "Come si chiama la costituzione tedesca?",
      Grundgesetz: "Legge fondamentale",
      Bundesgesetz: "Legge federale",
      Gesetzbuch: "Codice legale",
      Verfassungsgesetz: "Legge costituzionale",
      "Das Grundgesetz ist die deutsche Verfassung.": "La Legge fondamentale è la costituzione tedesca.",
      "Wann wurde die Bundesrepublik Deutschland gegründet?":
        "Quando è stata fondata la Repubblica Federale di Germania?",
      "1945": "1945",
      "1949": "1949",
      "1989": "1989",
      "1990": "1990",
      "Die Bundesrepublik Deutschland wurde 1949 gegründet.":
        "La Repubblica Federale di Germania è stata fondata nel 1949.",
    },
    tr: {
      "Wie heißt die deutsche Verfassung?": "Alman anayasasının adı nedir?",
      Grundgesetz: "Temel Kanun",
      Bundesgesetz: "Federal Kanun",
      Gesetzbuch: "Kanun Kitabı",
      Verfassungsgesetz: "Anayasa Kanunu",
      "Das Grundgesetz ist die deutsche Verfassung.": "Temel Kanun, Alman anayasasıdır.",
      "Wann wurde die Bundesrepublik Deutschland gegründet?": "Almanya Federal Cumhuriyeti ne zaman kuruldu?",
      "1945": "1945",
      "1949": "1949",
      "1989": "1989",
      "1990": "1990",
      "Die Bundesrepublik Deutschland wurde 1949 gegründet.": "Almanya Federal Cumhuriyeti 1949'da kuruldu.",
    },
    ar: {
      "Wie heißt die deutsche Verfassung?": "ما اسم الدستور الألماني؟",
      Grundgesetz: "القانون الأساسي",
      Bundesgesetz: "القانون الاتحادي",
      Gesetzbuch: "كتاب القانون",
      Verfassungsgesetz: "القانون الدستوري",
      "Das Grundgesetz ist die deutsche Verfassung.": "القانون الأساسي هو الدستور الألماني.",
      "Wann wurde die Bundesrepublik Deutschland gegründet?": "متى تأسست جمهورية ألمانيا الاتحادية؟",
      "1945": "1945",
      "1949": "1949",
      "1989": "1989",
      "1990": "1990",
      "Die Bundesrepublik Deutschland wurde 1949 gegründet.": "تأسست جمهورية ألمانيا الاتحادية عام 1949.",
    },
    ru: {
      "Wie heißt die deutsche Verfassung?": "Как называется немецкая конституция?",
      Grundgesetz: "Основной закон",
      Bundesgesetz: "Федеральный закон",
      Gesetzbuch: "Кодекс законов",
      Verfassungsgesetz: "Конституционный закон",
      "Das Grundgesetz ist die deutsche Verfassung.": "Основной закон является немецкой конституцией.",
      "Wann wurde die Bundesrepublik Deutschland gegründet?": "Когда была основана Федеративная Республика Германия?",
      "1945": "1945",
      "1949": "1949",
      "1989": "1989",
      "1990": "1990",
      "Die Bundesrepublik Deutschland wurde 1949 gegründet.":
        "Федеративная Республика Германия была основана в 1949 году.",
    },
    zh: {
      "Wie heißt die deutsche Verfassung?": "德国宪法叫什么名字？",
      Grundgesetz: "基本法",
      Bundesgesetz: "联邦法",
      Gesetzbuch: "法典",
      Verfassungsgesetz: "宪法",
      "Das Grundgesetz ist die deutsche Verfassung.": "基本法是德国的宪法。",
      "Wann wurde die Bundesrepublik Deutschland gegründet?": "德意志联邦共和国是什么时候成立的？",
      "1945": "1945",
      "1949": "1949",
      "1989": "1989",
      "1990": "1990",
      "Die Bundesrepublik Deutschland wurde 1949 gegründet.": "德意志联邦共和国成立于1949年。",
    },
    hi: {
      "Wie heißt die deutsche Verfassung?": "जर्मन संविधान का नाम क्या है?",
      Grundgesetz: "मूल कानून",
      Bundesgesetz: "संघीय कानून",
      Gesetzbuch: "कानून की किताब",
      Verfassungsgesetz: "संवैधानिक कानून",
      "Das Grundgesetz ist die deutsche Verfassung.": "मूल कानून जर्मन संविधान है।",
      "Wann wurde die Bundesrepublik Deutschland gegründet?": "जर्मनी का संघीय गणराज्य कब स्थापित हुआ था?",
      "1945": "1945",
      "1949": "1949",
      "1989": "1989",
      "1990": "1990",
      "Die Bundesrepublik Deutschland wurde 1949 gegründet.": "जर्मनी का संघीय गणराज्य 1949 में स्थापित हुआ था।",
    },
  }

  // If we have a specific translation, use it
  if (translations[targetLanguage] && translations[targetLanguage][text]) {
    return translations[targetLanguage][text]
  }

  // Otherwise, return a generic translation format
  return `[${targetLanguage.toUpperCase()}] ${text}`
}

export default function SwipeCard({
  question,
  onSwipe,
  onFlag,
  isFlagged,
  showAnswer = false,
  onAnswerSelect,
  isTranslated,
  onTranslate,
}: SwipeCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)
  const [translatedText, setTranslatedText] = useState<string>("")
  const [internalShowTranslation, setInternalShowTranslation] = useState(false)
  const [translatedOptions, setTranslatedOptions] = useState<string[]>([])
  const [translatedExplanation, setTranslatedExplanation] = useState<string>("")
  const [imageError, setImageError] = useState(false)
  const { language } = useStore()
  const t = getTranslation(language)

  const showTranslation = isTranslated !== undefined ? isTranslated : internalShowTranslation

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSelectedAnswer(null)
    setInternalShowTranslation(false)
    setTranslatedText("")
    setTranslatedOptions([])
    setTranslatedExplanation("")
    setImageError(false)
  }, [question.id])

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x
    const velocity = info.velocity.x

    if (Math.abs(velocity) >= 500) {
      onSwipe(velocity > 0 ? "right" : "left")
    } else if (Math.abs(offset) >= 100) {
      onSwipe(offset > 0 ? "right" : "left")
    }
  }

  const handleAnswerClick = (index: number) => {
    if (showAnswer) return
    setSelectedAnswer(index)
    onAnswerSelect?.(index)
  }

  const translateQuestion = async () => {
    if (isTranslating) return

    if (onTranslate) {
      onTranslate()
      return
    }

    if (internalShowTranslation) {
      setInternalShowTranslation(false)
      return
    }

    setIsTranslating(true)

    try {
      // Translate question text
      const translatedQuestionText = await translateText(question.question, language)

      // Translate all options
      const translatedOptionsArray = await Promise.all(
        question.options.map((option) => translateText(option, language)),
      )

      // Translate explanation if it exists
      const translatedExplanationText = question.explanation ? await translateText(question.explanation, language) : ""

      setTranslatedText(translatedQuestionText)
      setTranslatedOptions(translatedOptionsArray)
      setTranslatedExplanation(translatedExplanationText)
      setInternalShowTranslation(true)
    } catch (error) {
      console.error("Translation failed:", error)
      // Fallback to simple format if translation fails
      setTranslatedText(`[${language.toUpperCase()}] ${question.question}`)
      setTranslatedOptions(question.options.map((option) => `[${language.toUpperCase()}] ${option}`))
      setTranslatedExplanation(question.explanation ? `[${language.toUpperCase()}] ${question.explanation}` : "")
      setInternalShowTranslation(true)
    } finally {
      setIsTranslating(false)
    }
  }

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)

      // Set language for speech synthesis based on current UI language
      const speechLangMap: Record<string, string> = {
        en: "en-US",
        de: "de-DE",
        es: "es-ES",
        fr: "fr-FR",
        it: "it-IT",
        tr: "tr-TR",
        ar: "ar-SA",
        ru: "ru-RU",
        zh: "zh-CN",
        hi: "hi-IN",
      }

      utterance.lang = speechLangMap[language] || "en-US"
      utterance.rate = 0.8 // Slightly slower for better comprehension
      speechSynthesis.speak(utterance)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const getImageSrc = () => {
    if (imageError || !question.image) {
      return "/placeholder.svg?height=300&width=400&text=Question+Image"
    }
    return question.image
  }

  return (
    <motion.div
      ref={cardRef}
      className="w-full max-w-2xl mx-auto cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05 }}
    >
      <Card className="border-4 border-cyan-400/50 bg-gradient-to-br from-black/80 to-purple-900/80 backdrop-blur-xl shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse"></div>

        <CardHeader className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <CardTitle className="text-2xl md:text-3xl font-black text-white leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
                {t.question} {question.id}
              </span>
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={translateQuestion}
                disabled={isTranslating}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 px-3 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-sm font-bold"
              >
                <Languages className="w-4 h-4 mr-1" />
                {isTranslating ? t.translating : showTranslation ? t.translated : t.translate}
              </Button>
              <Button
                onClick={() => speakText(showTranslation && translatedText ? translatedText : question.question)}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-0 px-3 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
              <Button
                onClick={onFlag}
                className={`border-0 px-3 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${
                  isFlagged
                    ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                    : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white"
                }`}
              >
                <Flag className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-lg md:text-xl text-white leading-relaxed font-medium">{question.question}</p>

            {showTranslation && translatedText && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-4 rounded-lg border border-blue-400/30"
              >
                <div className="flex items-center mb-2">
                  <Languages className="w-4 h-4 mr-2 text-blue-300" />
                  <span className="text-blue-300 text-sm font-bold uppercase">{language} Translation</span>
                </div>
                <p className="text-blue-200 text-lg leading-relaxed font-medium">{translatedText}</p>
              </motion.div>
            )}
          </div>
        </CardHeader>

        <CardContent className="relative z-10 pb-8">
          {question.image && (
            <div className="mb-6 flex justify-center">
              <img
                src={getImageSrc() || "/placeholder.svg"}
                alt="Question illustration"
                className="max-w-full h-auto rounded-lg shadow-lg border-2 border-cyan-400/30"
                style={{ maxHeight: "300px" }}
                onError={handleImageError}
              />
            </div>
          )}

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswerClick(index)}
                disabled={showAnswer}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 md:p-6 text-left rounded-xl font-bold text-lg md:text-xl transition-all duration-300 border-2 transform hover:scale-[1.02] ${
                  showAnswer
                    ? index === question.answerIndex
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 border-green-400 text-white shadow-lg shadow-green-500/50"
                      : selectedAnswer === index
                        ? "bg-gradient-to-r from-red-600 to-pink-600 border-red-400 text-white shadow-lg shadow-red-500/50"
                        : "bg-black/40 border-gray-600 text-gray-400"
                    : selectedAnswer === index
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 border-cyan-400 text-white shadow-lg shadow-cyan-500/50"
                      : "bg-black/60 border-cyan-400/30 text-white hover:bg-black/80 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25"
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-start">
                    <span className="mr-3 text-2xl font-black">{String.fromCharCode(65 + index)}.</span>
                    <span>{option}</span>
                  </div>
                  {showTranslation && translatedOptions[index] && (
                    <div className="mt-2 ml-8 text-blue-200 text-base opacity-80">{translatedOptions[index]}</div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {!showAnswer && (
            <div className="mt-8 text-center space-y-4">
              <p className="text-cyan-300 text-lg font-bold animate-pulse">💡 {t.selectAnswer}</p>
              <div className="flex justify-center space-x-8 text-sm md:text-base">
                <div className="text-green-400 font-bold">← {t.swipeLeft}</div>
                <div className="text-red-400 font-bold">{t.swipeRight} →</div>
              </div>
            </div>
          )}

          {showAnswer && question.explanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 md:p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl border border-purple-400/30"
            >
              <h4 className="text-xl font-black text-purple-300 mb-3 flex items-center">
                <span className="mr-2">💡</span>
                {t.explanation}
              </h4>
              <p className="text-white text-lg leading-relaxed mb-3">{question.explanation}</p>
              {showTranslation && translatedExplanation && (
                <div className="bg-purple-800/30 p-3 rounded-lg border border-purple-400/20">
                  <div className="flex items-center mb-2">
                    <Languages className="w-4 h-4 mr-2 text-purple-300" />
                    <span className="text-purple-300 text-sm font-bold uppercase">{language} Translation</span>
                  </div>
                  <p className="text-purple-200 text-base leading-relaxed">{translatedExplanation}</p>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
