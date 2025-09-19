import { useState, useEffect } from "react"
import { translateText } from "../translation-service"
import { GERMAN_TEXT_PATTERNS } from "../swipe-card-constants"
import type { Question } from "../store"

interface UseTranslationProps {
  question: Question
  language: string
  showTranslation: boolean
  stateTranslation: any
  questionTranslations: any
}

export const useTranslation = ({
  question,
  language,
  showTranslation,
  stateTranslation,
  questionTranslations
}: UseTranslationProps) => {
  const [isTranslating, setIsTranslating] = useState(false)
  const [translatedText, setTranslatedText] = useState<string>("")
  const [translatedOptions, setTranslatedOptions] = useState<string[]>([])
  const [translatedExplanation, setTranslatedExplanation] = useState<string>("")

  // Resolved translation priority: stateTranslation -> question.translations -> fallback translatedText/options
  const resolvedTranslation = stateTranslation || questionTranslations || null

  // For rendering: main question stays as original German. Translation box uses resolved translations first, then translatedText.
  const translationBoxQuestion = resolvedTranslation?.question || translatedText || ""
  const translationBoxOptions: string[] = resolvedTranslation?.options || translatedOptions

  // Heuristic: detect if a string looks like German (common words)
  const isLikelyGerman = (text: string | undefined) => {
    if (!text) return false
    const s = text.toLowerCase()
    return GERMAN_TEXT_PATTERNS.some((hint) => s.includes(hint))
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

  // Translate when language changes or translation is toggled
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

  return {
    isTranslating,
    setIsTranslating,
    translatedText,
    setTranslatedText,
    translatedOptions,
    setTranslatedOptions,
    translatedExplanation,
    setTranslatedExplanation,
    translationBoxQuestion,
    translationBoxOptions,
    translationBoxExplanation
  }
}
