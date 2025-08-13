"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Flag, Volume2, Languages, Loader2 } from "lucide-react"
import { getCategoryEmoji } from "@/lib/category-emojis"
import { speechLangMap, languageDisplayNames } from "@/lib/translate-utils"
import { useStore } from "@/lib/store"

interface Question {
  id: string
  question: string
  translations?: Record<string, string>
  options: string[]
  optionTranslations?: Record<string, string[]>
  answerIndex: number
  explanation?: string
  explanationTranslations?: Record<string, string>
  category: string
  image?: string
}

interface SwipeCardProps {
  question: Question
  onSwipe: (direction: "left" | "right") => void
  onAnswerSelect?: (index: number) => void
  showAnswer?: boolean
  onFlag?: () => void
  isFlagged?: boolean
  isTranslated?: boolean
  onTranslate?: () => void
}

export default function SwipeCard({
  question,
  onSwipe,
  onAnswerSelect,
  showAnswer = false,
  onFlag,
  isFlagged = false,
  isTranslated = false,
  onTranslate,
}: SwipeCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isTranslating, setIsTranslating] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const startPos = useRef({ x: 0, y: 0 })
  const { language } = useStore()

  const handleTranslate = async () => {
    if (!onTranslate) return

    setIsTranslating(true)
    console.log("🌐 Starting translation process...")

    // Simulate a brief loading time
    await new Promise((resolve) => setTimeout(resolve, 300))

    console.log("✅ Translation completed successfully!")
    onTranslate()
    setIsTranslating(false)
  }

  const handleReadAloud = (text: string) => {
    if ("speechSynthesis" in window) {
      // Stop any ongoing speech
      speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      // Use translated language if available, otherwise default to German
      if (isTranslated) {
        utterance.lang = speechLangMap[language] || "en-US"
      } else {
        utterance.lang = "de-DE"
      }

      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.volume = 1

      speechSynthesis.speak(utterance)
    }
  }

  const handleAnswerClick = (index: number) => {
    if (showAnswer) return
    setSelectedAnswer(index)
    onAnswerSelect?.(index)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    startPos.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const deltaX = e.clientX - startPos.current.x
    const deltaY = e.clientY - startPos.current.y
    setDragOffset({ x: deltaX, y: deltaY })
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    setIsDragging(false)

    const threshold = 100
    if (Math.abs(dragOffset.x) > threshold) {
      onSwipe(dragOffset.x > 0 ? "right" : "left")
    }

    setDragOffset({ x: 0, y: 0 })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setIsDragging(true)
    startPos.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const touch = e.touches[0]
    const deltaX = touch.clientX - startPos.current.x
    const deltaY = touch.clientY - startPos.current.y
    setDragOffset({ x: deltaX, y: deltaY })
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const threshold = 100
    if (Math.abs(dragOffset.x) > threshold) {
      onSwipe(dragOffset.x > 0 ? "right" : "left")
    }

    setDragOffset({ x: 0, y: 0 })
  }

  // Get display content (original or translated)
  const getDisplayQuestion = () => {
    if (isTranslated && question.translations && question.translations[language]) {
      return question.translations[language]
    }
    return question.question
  }

  const getDisplayOptions = () => {
    if (isTranslated && question.optionTranslations && question.optionTranslations[language]) {
      return question.optionTranslations[language]
    }
    return question.options
  }

  const getDisplayExplanation = () => {
    if (isTranslated && question.explanationTranslations && question.explanationTranslations[language]) {
      return question.explanationTranslations[language]
    }
    return question.explanation
  }

  const getSwipeHint = () => {
    if (Math.abs(dragOffset.x) > 50) {
      return dragOffset.x > 0 ? "👈 Previous" : "Next 👉"
    }
    return null
  }

  // Check if translation is available for current language
  const hasTranslation = question.translations && question.translations[language]

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Swipe hint */}
      {getSwipeHint() && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-4 py-2 rounded-full font-bold text-sm animate-bounce">
            {getSwipeHint()}
          </div>
        </div>
      )}

      <Card
        ref={cardRef}
        className={`border-2 border-cyan-400/50 bg-gradient-to-br from-black/80 to-purple-900/50 backdrop-blur-xl shadow-2xl shadow-cyan-500/25 transition-all duration-300 cursor-grab active:cursor-grabbing select-none ${
          isDragging ? "scale-105 rotate-1" : "hover:scale-102"
        }`}
        style={{
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) ${isDragging ? "rotate(2deg)" : ""}`,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <CardContent className="p-6 md:p-8 relative">
          {/* Header with category and actions */}
          <div className="flex items-center justify-between mb-6">
            <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 px-4 py-2 text-sm font-bold">
              {getCategoryEmoji(question.category)} {question.category.toUpperCase()}
            </Badge>

            <div className="flex items-center space-x-2">
              {/* Translation button */}
              {onTranslate && hasTranslation && (
                <Button
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  className={`p-2 rounded-full transition-all transform hover:scale-110 ${
                    isTranslated
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  } text-white border-0 shadow-lg`}
                  title={
                    isTranslating
                      ? "Translating..."
                      : isTranslated
                        ? `Translated to ${languageDisplayNames[language] || language.toUpperCase()}`
                        : `Translate to ${languageDisplayNames[language] || language.toUpperCase()}`
                  }
                >
                  {isTranslating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
                </Button>
              )}

              {/* Text-to-speech button */}
              <Button
                onClick={() => handleReadAloud(getDisplayQuestion())}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-2 rounded-full border-0 shadow-lg transition-all transform hover:scale-110"
                title="Read question aloud"
              >
                <Volume2 className="w-4 h-4" />
              </Button>

              {/* Flag button */}
              {onFlag && (
                <Button
                  onClick={onFlag}
                  className={`p-2 rounded-full transition-all transform hover:scale-110 ${
                    isFlagged
                      ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                      : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
                  } text-white border-0 shadow-lg`}
                  title={isFlagged ? "Remove flag" : "Flag for review"}
                >
                  <Flag className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed flex-1 pr-4">
                {getDisplayQuestion()}
              </h2>
              {isTranslated && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-3 py-1 text-xs font-bold shrink-0">
                  {languageDisplayNames[language] || language.toUpperCase()}
                </Badge>
              )}
            </div>

            {/* Question image if available */}
            {question.image && (
              <div className="mb-6 flex justify-center">
                <img
                  src={question.image || "/placeholder.svg"}
                  alt="Question illustration"
                  className="max-w-full h-auto rounded-lg border-2 border-cyan-400/30 shadow-lg"
                  style={{ maxHeight: "300px" }}
                />
              </div>
            )}
          </div>

          {/* Answer options */}
          <div className="space-y-4 mb-6">
            {getDisplayOptions().map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === question.answerIndex
              const showCorrectAnswer = showAnswer && isCorrect
              const showIncorrectAnswer = showAnswer && isSelected && !isCorrect

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={showAnswer}
                  className={`w-full p-4 md:p-6 text-left rounded-xl border-2 transition-all duration-300 transform hover:scale-102 ${
                    showCorrectAnswer
                      ? "border-green-400 bg-gradient-to-r from-green-900/50 to-emerald-900/50 shadow-lg shadow-green-500/25"
                      : showIncorrectAnswer
                        ? "border-red-400 bg-gradient-to-r from-red-900/50 to-pink-900/50 shadow-lg shadow-red-500/25"
                        : isSelected
                          ? "border-yellow-400 bg-gradient-to-r from-yellow-900/50 to-orange-900/50 shadow-lg shadow-yellow-500/25"
                          : "border-gray-600 bg-gradient-to-r from-gray-900/50 to-black/50 hover:border-cyan-400 hover:bg-gradient-to-r hover:from-cyan-900/30 hover:to-blue-900/30"
                  } ${showAnswer ? "cursor-default" : "cursor-pointer"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          showCorrectAnswer
                            ? "bg-green-500 text-white"
                            : showIncorrectAnswer
                              ? "bg-red-500 text-white"
                              : isSelected
                                ? "bg-yellow-500 text-black"
                                : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span
                        className={`text-base md:text-lg font-medium ${
                          showCorrectAnswer
                            ? "text-green-300"
                            : showIncorrectAnswer
                              ? "text-red-300"
                              : isSelected
                                ? "text-yellow-300"
                                : "text-white"
                        }`}
                      >
                        {option}
                      </span>
                    </div>
                    {showCorrectAnswer && <span className="text-2xl">✅</span>}
                    {showIncorrectAnswer && <span className="text-2xl">❌</span>}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {showAnswer && getDisplayExplanation() && (
            <div className="mt-6 p-4 md:p-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border-2 border-blue-400/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-blue-300 flex items-center">
                  💡 Explanation
                  {isTranslated && (
                    <Badge className="ml-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-2 py-1 text-xs font-bold">
                      {languageDisplayNames[language] || language.toUpperCase()}
                    </Badge>
                  )}
                </h3>
                <Button
                  onClick={() => handleReadAloud(getDisplayExplanation() || "")}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-2 rounded-full border-0 shadow-lg transition-all transform hover:scale-110"
                  title="Read explanation aloud"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-gray-300 leading-relaxed">{getDisplayExplanation()}</p>
            </div>
          )}

          {/* Swipe instructions */}
          <div className="mt-8 text-center">
            <div className="text-sm text-gray-400 space-y-2">
              <p className="font-bold">💡 Swipe or drag the card to navigate</p>
              <div className="flex justify-center space-x-6 text-xs">
                <span>👈 Previous (A key)</span>
                <span>Next (D key) 👉</span>
              </div>
              <p className="text-xs">Use number keys 1-4 to select answers</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
