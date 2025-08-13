"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Flag, Volume2, Languages } from "lucide-react"
import { useStore } from "@/lib/store"
import type { Question } from "@/lib/store"

interface SwipeCardProps {
  question: Question
  onAnswer: (selectedIndex: number) => void
  selectedAnswer?: number
  showAnswer?: boolean
  disabled?: boolean
}

export default function SwipeCard({
  question,
  onAnswer,
  selectedAnswer,
  showAnswer = false,
  disabled = false,
}: SwipeCardProps) {
  const { userProgress, flagQuestion, unflagQuestion, language } = useStore()
  const [isTranslated, setIsTranslated] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const isFlagged = userProgress.flaggedQuestions.includes(question.id)
  const isCompleted = userProgress.completedQuestions.includes(question.id)

  // Check if translations are available for the current language
  const hasTranslations =
    question.translations &&
    question.optionTranslations &&
    question.explanationTranslations &&
    language !== "de" && // Don't show translation for German (original language)
    question.translations[language] &&
    question.optionTranslations[language] &&
    question.explanationTranslations[language]

  // Get the display text based on translation state
  const displayQuestion = isTranslated && hasTranslations ? question.translations[language] : question.question

  const displayOptions = isTranslated && hasTranslations ? question.optionTranslations[language] : question.options

  const displayExplanation =
    isTranslated && hasTranslations ? question.explanationTranslations[language] : question.explanation

  const handleToggleFlag = () => {
    if (isFlagged) {
      unflagQuestion(question.id)
    } else {
      flagQuestion(question.id)
    }
  }

  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      setIsPlaying(true)
      const utterance = new SpeechSynthesisUtterance(displayQuestion)

      // Set language for speech synthesis
      const speechLang =
        language === "de"
          ? "de-DE"
          : language === "en"
            ? "en-US"
            : language === "es"
              ? "es-ES"
              : language === "fr"
                ? "fr-FR"
                : language === "it"
                  ? "it-IT"
                  : language === "tr"
                    ? "tr-TR"
                    : language === "ar"
                      ? "ar-SA"
                      : language === "ru"
                        ? "ru-RU"
                        : language === "zh"
                          ? "zh-CN"
                          : language === "hi"
                            ? "hi-IN"
                            : "de-DE"

      utterance.lang = speechLang
      utterance.rate = 0.8

      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = () => setIsPlaying(false)

      speechSynthesis.speak(utterance)
    }
  }

  const handleToggleTranslation = () => {
    setIsTranslated(!isTranslated)
  }

  const getOptionClass = (index: number) => {
    if (!showAnswer) {
      return selectedAnswer === index
        ? "bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-600"
        : "hover:bg-gray-50 dark:hover:bg-gray-800"
    }

    if (index === question.answerIndex) {
      return "bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-600"
    }

    if (selectedAnswer === index && index !== question.answerIndex) {
      return "bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-600"
    }

    return "bg-gray-50 dark:bg-gray-800"
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {question.category}
            </Badge>
            {isCompleted && (
              <Badge variant="default" className="text-xs bg-green-600">
                ✓ Completed
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasTranslations && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleTranslation}
                className="h-8 w-8 p-0"
                title={isTranslated ? "Show original" : "Translate"}
              >
                <Languages className={`h-4 w-4 ${isTranslated ? "text-blue-600" : "text-gray-500"}`} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSpeak}
              disabled={isPlaying}
              className="h-8 w-8 p-0"
              title="Read aloud"
            >
              <Volume2 className={`h-4 w-4 ${isPlaying ? "text-blue-600" : "text-gray-500"}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFlag}
              className="h-8 w-8 p-0"
              title={isFlagged ? "Remove flag" : "Flag question"}
            >
              <Flag className={`h-4 w-4 ${isFlagged ? "text-red-500 fill-current" : "text-gray-500"}`} />
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4 leading-relaxed">{displayQuestion}</h3>

          {question.image && (
            <div className="mb-4">
              <img
                src={question.image || "/placeholder.svg"}
                alt="Question illustration"
                className="max-w-full h-auto rounded-lg border"
                crossOrigin="anonymous"
              />
            </div>
          )}
        </div>

        <div className="space-y-3 mb-6">
          {displayOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => !disabled && onAnswer(index)}
              disabled={disabled}
              className={`w-full p-4 text-left border rounded-lg transition-colors ${getOptionClass(index)} ${
                disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              }`}
            >
              <div className="flex items-center">
                <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center mr-3 text-sm font-medium">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-sm">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {showAnswer && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Explanation:</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{displayExplanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
