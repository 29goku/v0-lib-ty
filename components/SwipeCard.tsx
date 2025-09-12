"use client"

import { useState, useRef, useEffect, useLayoutEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flag, Languages, Volume2 } from "lucide-react"
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion"
import { useStore } from "@/lib/store"
import { getTranslation } from "@/lib/i18n"
import { getStateQuestionTranslation } from "@/lib/utils"
import stateQuestionsData from "@/public/data/state-questions.json"
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
  externalSelectedAnswer?: number | null
}

// Enhanced translation service for German citizenship test content
const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  // Simulate realistic API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  console.log(`🔍 Translating: "${text}" to ${targetLanguage}`)

  // Comprehensive translation dictionary covering German citizenship test patterns
  const translations: Record<string, Record<string, string>> = {
    // Complete common questions
    "Wie heißt die deutsche Verfassung?": {
      en: "What is the German constitution called?",
      es: "¿Cómo se llama la constitución alemana?",
      fr: "Comment s'appelle la constitution allemande?",
      it: "Come si chiama la costituzione tedesca?",
      tr: "Alman anayasasının adı nedir?",
      ar: "ما اسم الدستور الألماني؟",
      ru: "Как называется немецкая конституция?",
      zh: "德国宪法叫什么名字？",
      hi: "जर्मन संविधान का नाम क्या है?",
    },
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
    "Welche Farben hat die deutsche Flagge?": {
      en: "What colors does the German flag have?",
      es: "¿Qué colores tiene la bandera alemana?",
      fr: "Quelles couleurs a le drapeau allemand?",
      it: "Quali colori ha la bandiera tedesca?",
      tr: "Alman bayrağının renkleri nelerdir?",
      ar: "ما هي ألوان العلم الألماني؟",
      ru: "Какие цвета у немецкого флага?",
      zh: "德国国旗有什么颜色？",
      hi: "जर्मन झंडे के रंग क्या हैं?",
    },
    "Wann wurde die Bundesrepublik Deutschland gegründet?": {
      en: "When was the Federal Republic of Germany founded?",
      es: "¿Cuándo se fundó la República Federal de Alemania?",
      fr: "Quand la République fédérale d'Allemagne a-t-elle été fondée?",
      it: "Quando è stata fondata la Repubblica Federale di Germania?",
      tr: "Almanya Federal Cumhuriyeti ne zaman kuruldu?",
      ar: "متى تأسست جمهورية ألمانيا الاتحادية؟",
      ru: "Когда была основана Федеративная Республика Германия?",
      zh: "德意志联邦共和国是什么时候成立的？",
      hi: "जर्मनी का संघीय गणराज्य कब स्थापित हुआ था?",
    },
    "Was bedeutet Demokratie?": {
      en: "What does democracy mean?",
      es: "¿Qué significa democracia?",
      fr: "Que signifie démocratie?",
      it: "Cosa significa democrazia?",
      tr: "Demokrasi ne demektir?",
      ar: "ما معنى الديمقراطية؟",
      ru: "Что означает демократия?",
      zh: "民主是什么意思？",
      hi: "लोकतंत्र का क्या अर्थ है?",
    },
    "Wer wählt den Bundeskanzler / die Bundeskanzlerin?": {
      en: "Who elects the Federal Chancellor?",
      es: "¿Quién elige al Canciller Federal?",
      fr: "Qui élit le Chancelier fédéral?",
      it: "Chi elegge il Cancelliere federale?",
      tr: "Federal Şansölyeyi kim seçer?",
      ar: "من ينتخب المستشار الاتحادي؟",
      ru: "Кто избир��ет федерального канцлера?",
      zh: "谁选举联邦总理？",
      hi: "संघीय चांसलर को कौन चुनता है?",
    },

    // Question starters and patterns
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
    "Was bedeutet": {
      en: "What does ... mean",
      es: "¿Qué significa",
      fr: "Que signifie",
      it: "Cosa significa",
      tr: "Ne demektir",
      ar: "ما معنى",
      ru: "Что означает",
      zh: "什么意思",
      hi: "का क्या अर्थ है",
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
    Welcher: {
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
    wählt: {
      en: "elects",
      es: "elige",
      fr: "élit",
      it: "elegge",
      tr: "seçer",
      ar: "ينتخب",
      ru: "избирает",
      zh: "选举",
      hi: "चुनता है",
    },

    // Key German political/legal terms
    "die deutsche Verfassung": {
      en: "the German constitution",
      es: "la constitución alemana",
      fr: "la constitution allemande",
      it: "la costituzione tedesca",
      tr: "Alman anayasası",
      ar: "الدستور الألماني",
      ru: "нем��цкая конституция",
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
      hi: "म���ल कानून",
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
    Bundeskanzlerin: {
      en: "Federal Chancellor (female)",
      es: "Canciller Federal",
      fr: "Chancelière fédérale",
      it: "Cancelliera federale",
      tr: "Federal Şansölye",
      ar: "المستشارة الاتحادية",
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

    // Colors
    "schwarz, rot, gold": {
      en: "black, red, gold",
      es: "negro, rojo, dorado",
      fr: "noir, rouge, or",
      it: "nero, rosso, oro",
      tr: "siyah, kırmızı, altın",
      ar: "أسود، أحمر، ذهبي",
      ru: "черный, красный, золотой",
      zh: "黑色、红色、金色",
      hi: "काला, लाल, सुनहरा",
    },
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

    // Common words
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
    gegründet: {
      en: "founded",
      es: "fundada",
      fr: "fondée",
      it: "fondata",
      tr: "kuruldu",
      ar: "تأسست",
      ru: "ос��ована",
      zh: "成立",
      hi: "स्थापित",
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
    von: {
      en: "of",
      es: "de",
      fr: "de",
      it: "di",
      tr: "nin",
      ar: "من",
      ru: "из",
      zh: "的",
      hi: "का",
    },

    // Years
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
  }

  // First, try exact match
  if (translations[text] && translations[text][targetLanguage]) {
    console.log(`✅ Found exact translation for "${text}":`, translations[text][targetLanguage])
    return translations[text][targetLanguage]
  }

  // Second, try to translate by replacing multiple terms
  let translatedText = text
  let hasTranslations = false

  // Sort by length (longest first) to avoid partial replacements
  const sortedKeys = Object.keys(translations).sort((a, b) => b.length - a.length)

  for (const germanTerm of sortedKeys) {
    if (translatedText.includes(germanTerm) && translations[germanTerm][targetLanguage]) {
      const replacement = translations[germanTerm][targetLanguage]
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

  const fallbackResult = `[${languageNames[targetLanguage] || targetLanguage.toUpperCase()}] ${text}`
  console.log(`❌ No translation found for "${text}", using fallback: "${fallbackResult}"`)
  return fallbackResult
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
  externalSelectedAnswer = undefined,
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

  // Try to get state question translation if available
  let stateTranslation = null
  if (question.id) {
    // Flatten all state arrays into one array of questions
    const allStateQuestions = Object.values(stateQuestionsData).flat()
    stateTranslation = getStateQuestionTranslation(allStateQuestions, question.id, language)
  }

  const showTranslation = isTranslated !== undefined ? isTranslated : internalShowTranslation

  // Also check if the current question has built-in translations (questions.json)
  // Normalize translations: some data files use `optionTranslations` and
  // `explanationTranslations` instead of `options`/`explanation` inside the
  // language object. Normalize into a consistent shape: { question, options, explanation }
  const rawQuestionTranslations = (question as any).translations?.[language]
  let questionTranslations = rawQuestionTranslations
  if (rawQuestionTranslations) {
    const normalizedOptions = rawQuestionTranslations.options || rawQuestionTranslations.optionTranslations || undefined
    const normalizedExplanation = rawQuestionTranslations.explanation || rawQuestionTranslations.explanationTranslations || undefined
    questionTranslations = {
      question: rawQuestionTranslations.question || question.question,
      options: normalizedOptions,
      explanation: normalizedExplanation,
    }
  }

  // Resolved translation priority: stateTranslation -> question.translations -> fallback translatedText/options
  const resolvedTranslation = stateTranslation || questionTranslations || null

  // For rendering: main question stays as original German. Translation box uses resolved translations first, then translatedText.
  const translationBoxQuestion = resolvedTranslation?.question || translatedText || ""
  const translationBoxOptions: string[] = resolvedTranslation?.options || translatedOptions
  // Heuristic: detect if a string looks like German (common words). If a resolved
  // translation exists but still appears German while the selected language is not
  // German, prefer the runtime translatedExplanation (from translateText) when available.
  const isLikelyGerman = (text: string | undefined) => {
    if (!text) return false
    const s = text.toLowerCase()
    // quick set of common German words/phrases
    const germanHints = [" der ", " die ", " das ", " und ", " ist ", " ein ", " eine ", " in deutschland", " jahr", "jahre", "das ist", "die " ,"der ","in \b"]
    return germanHints.some((hint) => s.includes(hint))
  }

  let translationBoxExplanation = ""
  if (resolvedTranslation?.explanation) {
    const resolvedExpl = resolvedTranslation.explanation
    if (language !== "de" && isLikelyGerman(resolvedExpl) && translatedExplanation) {
      translationBoxExplanation = translatedExplanation
    } else if (question.explanation && resolvedExpl === question.explanation && translatedExplanation) {
      // If the resolved explanation equals the original (untranslated), prefer runtime translation
      translationBoxExplanation = translatedExplanation
    } else {
      translationBoxExplanation = resolvedExpl
    }
  } else {
    translationBoxExplanation = translatedExplanation || ""
  }

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const cardRef = useRef<HTMLDivElement>(null)
  // ref to measure the rendered Card content height
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [containerHeight, setContainerHeight] = useState<number | null>(null)

  // Keep the container height in sync with the inner content to avoid layout jumps when content changes
  useLayoutEffect(() => {
    if (!contentRef.current) return
    // initial measurement
    const measure = () => {
      const h = contentRef.current ? Math.ceil(contentRef.current.getBoundingClientRect().height) : 0
      setContainerHeight(h || null)
    }

    measure()

    // Observe resize of the content to update container height
    const ro = new ResizeObserver(() => measure())
    ro.observe(contentRef.current)
    return () => ro.disconnect()
  }, [question.id, showTranslation, imageError, selectedAnswer])

  // Sync external selected answer (from parent keyboard handler) into local state
  useEffect(() => {
    // Only update local selected answer when parent provides an explicit value (including null)
    if (externalSelectedAnswer !== undefined) {
      setSelectedAnswer(externalSelectedAnswer)
    }
  }, [externalSelectedAnswer])

  // Reset translation state when question changes
  useEffect(() => {
    setSelectedAnswer(null)
    setInternalShowTranslation(false)
    setTranslatedText("")
    setTranslatedOptions([])
    setTranslatedExplanation("")
    setImageError(false)
  }, [question.id])

  // Keyboard support: map keys 1-4 (Digit1..Digit4, Numpad1..Numpad4, plain keys) to options A-D
  // Also handle navigation keys (ArrowLeft/ArrowRight, A/D) and forward them via onSwipe
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if typing into inputs, textareas or contenteditable elements
      const target = event.target as HTMLElement | null
      if (target) {
        const tag = target.tagName
        const isEditable = target.getAttribute && (target.getAttribute('contenteditable') === 'true')
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || isEditable) return
      }

      // Navigation: Arrow keys or A/D
      // NOTE: invert mapping so keyboard arrows produce reversed swipe behavior
      if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
        event.preventDefault()
        onSwipe('left')
        return
      }
      if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
        event.preventDefault()
        onSwipe('right')
        return
      }

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
        if (/^[1-4]$/.test((event as KeyboardEvent).key)) {
          optionIndex = Number((event as KeyboardEvent).key) - 1
        }
      }

      if (optionIndex !== null && !showAnswer) {
        if (question && optionIndex < (Array.isArray(question.options) ? question.options.length : 0)) {
          event.preventDefault()
          handleAnswerClick(optionIndex)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [question?.id, question?.options, showAnswer, onSwipe])

  // Also translate when language changes
  useEffect(() => {
    if (!showTranslation) {
      // Clear translations when translation mode is turned off
      setTranslatedText("")
      setTranslatedOptions([])
      setTranslatedExplanation("")
      setIsTranslating(false)
      return
    }

    let mounted = true
    ;(async () => {
      setIsTranslating(true)
      try {
        // If question is a state question and stateTranslation exists, we already use it for display.
        // But still populate translated state so UI shows a consistent translatedExplanation if needed.
        const translatedQuestionText = await translateText(question.question, language)
        // Translate all answer options
        const translatedOptionsArray = await Promise.all(
          (Array.isArray(question.options) ? question.options : []).map(async (option) => await translateText(option, language))
        )
        let translatedExplanationText = ""
        if (question.explanation) {
          translatedExplanationText = await translateText(question.explanation, language)
        }
        if (!mounted) return
        setTranslatedText(translatedQuestionText)
        setTranslatedOptions(translatedOptionsArray)
        setTranslatedExplanation(translatedExplanationText)
      } catch (error) {
        if (!mounted) return
        setTranslatedText(`[${language.toUpperCase()}] ${question.question}`)
        setTranslatedOptions(
          Array.isArray(question.options)
            ? question.options.map((option) => `[${language.toUpperCase()}] ${option}`)
            : []
        )
        setTranslatedExplanation(question.explanation ? `[${language.toUpperCase()}] ${question.explanation}` : "")
      } finally {
        if (mounted) setIsTranslating(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [showTranslation, language, question])

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x
    const velocity = info.velocity.x

    // Invert drag mapping: a drag to the right (positive offset/velocity) should emit 'left' to parent
    if (Math.abs(velocity) >= 500) {
      onSwipe(velocity > 0 ? "left" : "right")
    } else if (Math.abs(offset) >= 100) {
      onSwipe(offset > 0 ? "left" : "right")
    }
  }

  const handleAnswerClick = (index: number) => {
    if (showAnswer) return
    setSelectedAnswer(index)
    onAnswerSelect?.(index)
  }

  const translateQuestion = async () => {
    if (isTranslating) return

    // If using external translation control, notify parent and return (parent will toggle showTranslation)
    if (onTranslate) {
      try {
        onTranslate()
      } catch (e) {
        // ignore
      }
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

    setInternalShowTranslation(true) 
    setIsTranslating(true)

    try {
      // Translate the main question
      const translatedQuestionText = await translateText(question.question, language)
      // Translate all answer options
      const translatedOptionsArray = await Promise.all(
        (Array.isArray(question.options) ? question.options : []).map(async (option) => await translateText(option, language))
      )
      // Translate explanation if it exists
      let translatedExplanationText = ""
      if (question.explanation) {
        translatedExplanationText = await translateText(question.explanation, language)
      }
      // Update state with translations
      setTranslatedText(translatedQuestionText)
      setTranslatedOptions(translatedOptionsArray)
      setTranslatedExplanation(translatedExplanationText)
    } catch (error) {
      setTranslatedText(`[${language.toUpperCase()}] ${question.question}`)
      setTranslatedOptions(
        Array.isArray(question.options)
          ? question.options.map((option) => `[${language.toUpperCase()}] ${option}`)
          : []
      )
      setTranslatedExplanation(question.explanation ? `[${language.toUpperCase()}] ${question.explanation}` : "")
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
      // set an explicit height (animated via CSS) based on inner content to avoid visual jumps
      style={{
        x,
        rotate,
        opacity,
        height: containerHeight ? `${containerHeight}px` : undefined,
        minHeight: 560,
        transition: 'height 200ms ease',
        overflow: 'hidden',
      }}
       drag="x"
       dragConstraints={{ left: 0, right: 0 }}
       onDragEnd={handleDragEnd}
       whileDrag={{ scale: 1.05 }}
     >
      <Card ref={contentRef} className="border-4 border-cyan-400/50 bg-gradient-to-br from-black/80 to-purple-900/80 backdrop-blur-xl shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 overflow-hidden relative">
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
            <p className="text-lg md:text-xl text-white leading-relaxed font-medium">
              {question.question}
            </p>
            {/* Optionally, keep the translation box for reference, or remove if not needed */}
            {showTranslation && (translationBoxQuestion || (Array.isArray(translationBoxOptions) && translationBoxOptions.length > 0)) && (
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
                <p className="text-blue-200 text-lg leading-relaxed font-medium">{translationBoxQuestion}</p>
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
            {question.options.map((originalOption: string, index: number) => {
              const translatedOption = Array.isArray(translationBoxOptions) ? translationBoxOptions[index] : undefined
              const optionToShow = originalOption
              return (
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
                    <span>{optionToShow}</span>
                  </div>
                  {showTranslation && translatedOption && (
                    <div className="mt-2 ml-8 text-blue-200 text-base opacity-80 font-medium">{translatedOption}</div>
                  )}
                </div>
              </motion.button>
              )
            })}
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
              {showTranslation && translationBoxExplanation && (
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
                  <p className="text-purple-200 text-base leading-relaxed">{translationBoxExplanation}</p>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
