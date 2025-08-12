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

// Comprehensive translation service for German citizenship test content
const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  // Simulate realistic API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  // Comprehensive translation dictionary covering most German citizenship test patterns
  const translations: Record<string, Record<string, string>> = {
    // Common question starters
    "Wie heißt": {
      en: "What is called",
      es: "¿Cómo se llama",
      fr: "Comment s'appelle",
      it: "Come si chiama",
      tr: "Nasıl adlandırılır",
      ar: "ما اسم",
      ru: "Как называется",
      zh: "什么叫做",
      hi: "क्या कहलाता है",
    },
    "Was ist": {
      en: "What is",
      es: "¿Qué es",
      fr: "Qu'est-ce que",
      it: "Cos'è",
      tr: "Nedir",
      ar: "ما هو",
      ru: "Что такое",
      zh: "什么是",
      hi: "क्या है",
    },
    "Wann wurde": {
      en: "When was",
      es: "¿Cuándo fue",
      fr: "Quand a été",
      it: "Quando è stato",
      tr: "Ne zaman",
      ar: "متى تم",
      ru: "Когда был",
      zh: "什么时候",
      hi: "कब था",
    },
    "Wann war": {
      en: "When was",
      es: "¿Cuándo fue",
      fr: "Quand était",
      it: "Quando era",
      tr: "Ne zaman idi",
      ar: "متى كان",
      ru: "Когда был",
      zh: "什么时候是",
      hi: "कब था",
    },
    Welche: {
      en: "Which",
      es: "¿Cuáles",
      fr: "Quelles",
      it: "Quali",
      tr: "Hangi",
      ar: "أي",
      ru: "Какие",
      zh: "哪些",
      hi: "कौन से",
    },
    Welches: {
      en: "Which",
      es: "¿Cuál",
      fr: "Quel",
      it: "Quale",
      tr: "Hangi",
      ar: "أي",
      ru: "Какой",
      zh: "哪个",
      hi: "कौन सा",
    },
    Wer: {
      en: "Who",
      es: "¿Quién",
      fr: "Qui",
      it: "Chi",
      tr: "Kim",
      ar: "من",
      ru: "Кто",
      zh: "谁",
      hi: "कौन",
    },
    Wo: {
      en: "Where",
      es: "¿Dónde",
      fr: "Où",
      it: "Dove",
      tr: "Nerede",
      ar: "أين",
      ru: "Где",
      zh: "哪里",
      hi: "कहाँ",
    },
    Warum: {
      en: "Why",
      es: "¿Por qué",
      fr: "Pourquoi",
      it: "Perché",
      tr: "Neden",
      ar: "لماذا",
      ru: "Почему",
      zh: "为什么",
      hi: "क्यों",
    },
    "Wie viele": {
      en: "How many",
      es: "¿Cuántos",
      fr: "Combien",
      it: "Quanti",
      tr: "Kaç tane",
      ar: "كم عدد",
      ru: "Сколько",
      zh: "多少",
      hi: "कितने",
    },

    // Key German political/legal terms
    "die deutsche Verfassung": {
      en: "the German constitution",
      es: "la constitución alemana",
      fr: "la constitution allemande",
      it: "la costituzione tedesca",
      tr: "Alman anayasası",
      ar: "الدستور الألماني",
      ru: "немецкая конституция",
      zh: "德国宪法",
      hi: "जर्मन संविधान",
    },
    Grundgesetz: {
      en: "Basic Law",
      es: "Ley Fundamental",
      fr: "Loi fondamentale",
      it: "Legge fondamentale",
      tr: "Temel Kanun",
      ar: "القانون الأساسي",
      ru: "Основной закон",
      zh: "基本法",
      hi: "मूल कानून",
    },
    "Bundesrepublik Deutschland": {
      en: "Federal Republic of Germany",
      es: "República Federal de Alemania",
      fr: "République fédérale d'Allemagne",
      it: "Repubblica Federale di Germania",
      tr: "Almanya Federal Cumhuriyeti",
      ar: "جمهورية ألمانيا الاتحادية",
      ru: "Федеративная Республика Германия",
      zh: "德意志联邦共和国",
      hi: "जर्मनी का संघीय गणराज्य",
    },
    Bundestag: {
      en: "Federal Parliament",
      es: "Parlamento Federal",
      fr: "Parlement fédéral",
      it: "Parlamento federale",
      tr: "Federal Parlamento",
      ar: "البرلمان الاتحادي",
      ru: "Федеральный парламент",
      zh: "联邦议会",
      hi: "संघीय संसद",
    },
    Bundesrat: {
      en: "Federal Council",
      es: "Consejo Federal",
      fr: "Conseil fédéral",
      it: "Consiglio federale",
      tr: "Federal Konsey",
      ar: "المجلس الاتحادي",
      ru: "Федеральный совет",
      zh: "联邦参议院",
      hi: "संघीय परिषद",
    },
    Bundeskanzler: {
      en: "Federal Chancellor",
      es: "Canciller Federal",
      fr: "Chancelier fédéral",
      it: "Cancelliere federale",
      tr: "Federal Şansölye",
      ar: "المستشار الاتحادي",
      ru: "Федеральный канцлер",
      zh: "联邦总理",
      hi: "संघीय चांसलर",
    },
    Bundespräsident: {
      en: "Federal President",
      es: "Presidente Federal",
      fr: "Président fédéral",
      it: "Presidente federale",
      tr: "Federal Başkan",
      ar: "الرئيس الاتحادي",
      ru: "Федеральный президент",
      zh: "联邦总统",
      hi: "संघीय राष्ट्रपति",
    },
    Demokratie: {
      en: "democracy",
      es: "democracia",
      fr: "démocratie",
      it: "democrazia",
      tr: "demokrasi",
      ar: "الديمقراطية",
      ru: "демократия",
      zh: "民主",
      hi: "लोकतंत्र",
    },
    Rechtsstaat: {
      en: "constitutional state",
      es: "estado de derecho",
      fr: "état de droit",
      it: "stato di diritto",
      tr: "hukuk devleti",
      ar: "دولة القانون",
      ru: "правовое государство",
      zh: "法治国家",
      hi: "कानूनी राज्य",
    },
    Meinungsfreiheit: {
      en: "freedom of opinion",
      es: "libertad de opinión",
      fr: "liberté d'opinion",
      it: "libertà di opinione",
      tr: "görüş özgürlüğü",
      ar: "حرية الرأي",
      ru: "свобода мнений",
      zh: "言论自由",
      hi: "मत की स्वतंत्रता",
    },
    Religionsfreiheit: {
      en: "freedom of religion",
      es: "libertad religiosa",
      fr: "liberté religieuse",
      it: "libertà religiosa",
      tr: "din özgürlüğü",
      ar: "حرية الدين",
      ru: "свобода религии",
      zh: "宗教自由",
      hi: "धर्म की स्वतंत्रता",
    },

    // German cities
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
      it: "Monaco di Baviera",
      tr: "Münih",
      ar: "ميونيخ",
      ru: "Мюнхен",
      zh: "慕尼黑",
      hi: "म्यूनिख",
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
    Köln: {
      en: "Cologne",
      es: "Colonia",
      fr: "Cologne",
      it: "Colonia",
      tr: "Köln",
      ar: "كولونيا",
      ru: "Кёльн",
      zh: "科隆",
      hi: "कोलोन",
    },
    Dresden: {
      en: "Dresden",
      es: "Dresde",
      fr: "Dresde",
      it: "Dresda",
      tr: "Dresden",
      ar: "درسدن",
      ru: "Дрезден",
      zh: "德累斯顿",
      hi: "ड्रेसडेन",
    },

    // German states (Bundesländer)
    Bayern: {
      en: "Bavaria",
      es: "Baviera",
      fr: "Bavière",
      it: "Baviera",
      tr: "Bavyera",
      ar: "بافاريا",
      ru: "Бавария",
      zh: "巴伐利亚",
      hi: "बवेरिया",
    },
    "Baden-Württemberg": {
      en: "Baden-Württemberg",
      es: "Baden-Württemberg",
      fr: "Bade-Wurtemberg",
      it: "Baden-Württemberg",
      tr: "Baden-Württemberg",
      ar: "بادن فورتمبيرغ",
      ru: "Баден-Вюртемберг",
      zh: "巴登-符腾堡",
      hi: "बाडेन-वुर्टेमबर्ग",
    },
    "Nordrhein-Westfalen": {
      en: "North Rhine-Westphalia",
      es: "Renania del Norte-Westfalia",
      fr: "Rhénanie-du-Nord-Westphalie",
      it: "Renania Settentrionale-Vestfalia",
      tr: "Kuzey Ren-Vestfalya",
      ar: "شمال الراين وستفاليا",
      ru: "Северный Рейн-Вестфалия",
      zh: "北莱茵-威斯特法伦",
      hi: "उत्तरी राइन-वेस्टफेलिया",
    },

    // Historical terms
    Nationalsozialismus: {
      en: "National Socialism",
      es: "Nacionalsocialismo",
      fr: "National-socialisme",
      it: "Nazionalsocialismo",
      tr: "Nasyonal Sosyalizm",
      ar: "الاشتراكية القومية",
      ru: "Национал-социализм",
      zh: "国家社会主义",
      hi: "राष्ट्रीय समाजवाद",
    },
    "Zweiter Weltkrieg": {
      en: "Second World War",
      es: "Segunda Guerra Mundial",
      fr: "Seconde Guerre mondiale",
      it: "Seconda guerra mondiale",
      tr: "İkinci Dünya Savaşı",
      ar: "الحرب العالمية الثانية",
      ru: "Вторая мировая война",
      zh: "第二次世界大战",
      hi: "द्वितीय विश्व युद्ध",
    },
    DDR: {
      en: "GDR (East Germany)",
      es: "RDA (Alemania Oriental)",
      fr: "RDA (Allemagne de l'Est)",
      it: "RDT (Germania Est)",
      tr: "DDR (Doğu Almanya)",
      ar: "ألمانيا الشرقية",
      ru: "ГДР (Восточная Германия)",
      zh: "东德",
      hi: "पूर्वी जर्मनी",
    },
    "Berliner Mauer": {
      en: "Berlin Wall",
      es: "Muro de Berlín",
      fr: "Mur de Berlin",
      it: "Muro di Berlino",
      tr: "Berlin Duvarı",
      ar: "جدار برلين",
      ru: "Берлинская стена",
      zh: "柏林墙",
      hi: "बर्लिन की दीवार",
    },
    Wiedervereinigung: {
      en: "reunification",
      es: "reunificación",
      fr: "réunification",
      it: "riunificazione",
      tr: "yeniden birleşme",
      ar: "إعادة التوحيد",
      ru: "воссоединение",
      zh: "统一",
      hi: "पुनर्मिलन",
    },

    // Colors
    schwarz: {
      en: "black",
      es: "negro",
      fr: "noir",
      it: "nero",
      tr: "siyah",
      ar: "أسود",
      ru: "черный",
      zh: "黑色",
      hi: "काला",
    },
    rot: {
      en: "red",
      es: "rojo",
      fr: "rouge",
      it: "rosso",
      tr: "kırmızı",
      ar: "أحمر",
      ru: "красный",
      zh: "红色",
      hi: "लाल",
    },
    gold: {
      en: "gold",
      es: "dorado",
      fr: "or",
      it: "oro",
      tr: "altın",
      ar: "ذهبي",
      ru: "золотой",
      zh: "金色",
      hi: "सुनहरा",
    },
    blau: {
      en: "blue",
      es: "azul",
      fr: "bleu",
      it: "blu",
      tr: "mavi",
      ar: "أزرق",
      ru: "синий",
      zh: "蓝色",
      hi: "नीला",
    },
    weiß: {
      en: "white",
      es: "blanco",
      fr: "blanc",
      it: "bianco",
      tr: "beyaz",
      ar: "أبيض",
      ru: "белый",
      zh: "白色",
      hi: "सफेद",
    },

    // Common phrases
    gegründet: {
      en: "founded",
      es: "fundada",
      fr: "fondée",
      it: "fondata",
      tr: "kuruldu",
      ar: "تأسست",
      ru: "основана",
      zh: "成立",
      hi: "स्थापित",
    },
    Hauptstadt: {
      en: "capital",
      es: "capital",
      fr: "capitale",
      it: "capitale",
      tr: "başkent",
      ar: "عاصمة",
      ru: "столица",
      zh: "首都",
      hi: "राजधानी",
    },
    Flagge: {
      en: "flag",
      es: "bandera",
      fr: "drapeau",
      it: "bandiera",
      tr: "bayrak",
      ar: "علم",
      ru: "флаг",
      zh: "国旗",
      hi: "झंडा",
    },
    Farben: {
      en: "colors",
      es: "colores",
      fr: "couleurs",
      it: "colori",
      tr: "renkler",
      ar: "ألوان",
      ru: "цвета",
      zh: "颜色",
      hi: "रंग",
    },
    Deutschland: {
      en: "Germany",
      es: "Alemania",
      fr: "Allemagne",
      it: "Germania",
      tr: "Almanya",
      ar: "ألمانيا",
      ru: "Германия",
      zh: "德国",
      hi: "जर्मनी",
    },

    // Years (commonly used in citizenship tests)
    "1949": {
      en: "1949",
      es: "1949",
      fr: "1949",
      it: "1949",
      tr: "1949",
      ar: "1949",
      ru: "1949",
      zh: "1949",
      hi: "1949",
    },
    "1945": {
      en: "1945",
      es: "1945",
      fr: "1945",
      it: "1945",
      tr: "1945",
      ar: "1945",
      ru: "1945",
      zh: "1945",
      hi: "1945",
    },
    "1989": {
      en: "1989",
      es: "1989",
      fr: "1989",
      it: "1989",
      tr: "1989",
      ar: "1989",
      ru: "1989",
      zh: "1989",
      hi: "1989",
    },
    "1990": {
      en: "1990",
      es: "1990",
      fr: "1990",
      it: "1990",
      tr: "1990",
      ar: "1990",
      ru: "1990",
      zh: "1990",
      hi: "1990",
    },
    "1961": {
      en: "1961",
      es: "1961",
      fr: "1961",
      it: "1961",
      tr: "1961",
      ar: "1961",
      ru: "1961",
      zh: "1961",
      hi: "1961",
    },
    "1933": {
      en: "1933",
      es: "1933",
      fr: "1933",
      it: "1933",
      tr: "1933",
      ar: "1933",
      ru: "1933",
      zh: "1933",
      hi: "1933",
    },

    // Common explanatory phrases
    "ist die": {
      en: "is the",
      es: "es la",
      fr: "est la",
      it: "è la",
      tr: "dir",
      ar: "هو",
      ru: "является",
      zh: "是",
      hi: "है",
    },
    wurde: {
      en: "was",
      es: "fue",
      fr: "a été",
      it: "è stato",
      tr: "oldu",
      ar: "كان",
      ru: "был",
      zh: "是",
      hi: "था",
    },
    hat: {
      en: "has",
      es: "tiene",
      fr: "a",
      it: "ha",
      tr: "var",
      ar: "لديه",
      ru: "имеет",
      zh: "有",
      hi: "है",
    },
  }

  // First, try exact match
  if (translations[text] && translations[text][targetLanguage]) {
    console.log(`Found exact translation for "${text}":`, translations[text][targetLanguage])
    return translations[text][targetLanguage]
  }

  // Second, try to translate by replacing multiple terms
  let translatedText = text
  let hasTranslations = false

  // Sort by length (longest first) to avoid partial replacements
  const sortedKeys = Object.keys(translations).sort((a, b) => b.length - a.length)

  for (const germanTerm of sortedKeys) {
    if (translatedText.includes(germanTerm) && translations[germanTerm][targetLanguage]) {
      translatedText = translatedText.replace(new RegExp(germanTerm, "g"), translations[germanTerm][targetLanguage])
      hasTranslations = true
      console.log(`Replaced "${germanTerm}" with "${translations[germanTerm][targetLanguage]}"`)
    }
  }

  // If we made any replacements, return the result
  if (hasTranslations) {
    return translatedText
  }

  // Final fallback - return with language tag
  const languageNames: Record<string, string> = {
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

  console.log(`No translation found for "${text}", using fallback`)
  return `[${languageNames[targetLanguage] || targetLanguage.toUpperCase()}] ${text}`
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

  // Reset translation state when question changes
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

    // If using external translation control
    if (onTranslate) {
      onTranslate()
      return
    }

    // Toggle translation off if already showing
    if (internalShowTranslation) {
      setInternalShowTranslation(false)
      setTranslatedText("")
      setTranslatedOptions([])
      setTranslatedExplanation("")
      return
    }

    setIsTranslating(true)

    try {
      console.log("Starting translation to language:", language)
      console.log("Question to translate:", question.question)

      // Translate the main question
      const translatedQuestionText = await translateText(question.question, language)
      console.log("Translated question result:", translatedQuestionText)

      // Translate all answer options
      const translatedOptionsArray = await Promise.all(
        question.options.map(async (option, index) => {
          console.log(`Translating option ${index}: "${option}"`)
          const translated = await translateText(option, language)
          console.log(`Translated option ${index} result:`, translated)
          return translated
        }),
      )

      // Translate explanation if it exists
      let translatedExplanationText = ""
      if (question.explanation) {
        console.log("Translating explanation:", question.explanation)
        translatedExplanationText = await translateText(question.explanation, language)
        console.log("Translated explanation result:", translatedExplanationText)
      }

      // Update state with translations
      setTranslatedText(translatedQuestionText)
      setTranslatedOptions(translatedOptionsArray)
      setTranslatedExplanation(translatedExplanationText)
      setInternalShowTranslation(true)

      console.log("Translation completed successfully")
    } catch (error) {
      console.error("Translation failed:", error)
      // Fallback to simple tagged format
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
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      // Set language for speech synthesis
      if (showTranslation) {
        const speechLangMap: Record<string, string> = {
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
        utterance.lang = speechLangMap[language] || "en-US"
      } else {
        utterance.lang = "de-DE" // German for original text
      }

      utterance.rate = 0.8
      utterance.pitch = 1
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
                  <span className="text-blue-300 text-sm font-bold uppercase">
                    {language === "en"
                      ? "ENGLISH"
                      : language === "es"
                        ? "ESPAÑOL"
                        : language === "fr"
                          ? "FRANÇAIS"
                          : language === "it"
                            ? "ITALIANO"
                            : language === "tr"
                              ? "TÜRKÇE"
                              : language === "ar"
                                ? "العربية"
                                : language === "ru"
                                  ? "РУССКИЙ"
                                  : language === "zh"
                                    ? "中文"
                                    : language === "hi"
                                      ? "हिंदी"
                                      : language.toUpperCase()}{" "}
                    Translation
                  </span>
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
                    <div className="mt-2 ml-8 text-blue-200 text-base opacity-80 font-medium">
                      {translatedOptions[index]}
                    </div>
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
                <div className="bg-purple-800/30 p-3 rounded-lg border border-purple-400/20 mt-3">
                  <div className="flex items-center mb-2">
                    <Languages className="w-4 h-4 mr-2 text-purple-300" />
                    <span className="text-purple-300 text-sm font-bold uppercase">
                      {language === "en"
                        ? "ENGLISH"
                        : language === "es"
                          ? "ESPAÑOL"
                          : language === "fr"
                            ? "FRANÇAIS"
                            : language === "it"
                              ? "ITALIANO"
                              : language === "tr"
                                ? "TÜRKÇE"
                                : language === "ar"
                                  ? "العربية"
                                  : language === "ru"
                                    ? "РУССКИЙ"
                                    : language === "zh"
                                      ? "中文"
                                      : language === "hi"
                                        ? "हिंदी"
                                        : language.toUpperCase()}{" "}
                      Translation
                    </span>
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
