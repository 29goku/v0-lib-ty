"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flag, Languages, Volume2 } from "lucide-react"
import { motion, type PanInfo } from "framer-motion"
import { useStore } from "@/lib/store"
import { getTranslation } from "@/lib/i18n"
import { getStateQuestionTranslation } from "@/lib/utils"
import stateQuestionsData from "@/public/data/state-questions.json"
import type { Question } from "@/lib/store"

// Import new modular components
import { translateText } from "@/lib/translation-service"
import {
  SWIPE_ANIMATION_CONFIG,
  CARD_STYLES,
} from "@/lib/swipe-card-constants"
import {
  speakText,
  getImageSrc,
  getLanguageDisplayName,
  normalizeQuestionTranslations
} from "@/lib/swipe-card-utils"
import { useSwipeCardAnimation } from "@/lib/hooks/useSwipeCardAnimation"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { useKeyboardHandler } from "@/lib/hooks/useKeyboardHandler"
import { useCardLayout } from "@/lib/hooks/useCardLayout"

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
  const [internalShowTranslation, setInternalShowTranslation] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const { language } = useStore()
  const t = getTranslation(language)

  // Custom hooks for modular functionality
  const {
    x,
    y,
    rotate,
    scale,
    prevIndicatorOpacity,
    prevIndicatorScale,
    nextIndicatorOpacity,
    nextIndicatorScale,
    controls
  } = useSwipeCardAnimation()

  // Try to get state question translation if available
  let stateTranslation = null
  if (question.id) {
    const allStateQuestions = Object.values(stateQuestionsData).flat()
    stateTranslation = getStateQuestionTranslation(allStateQuestions, question.id, language)
  }

  const showTranslation = isTranslated !== undefined ? isTranslated : internalShowTranslation

  // Normalize question translations
  const rawQuestionTranslations = (question as any).translations?.[language]
  const questionTranslations = normalizeQuestionTranslations(rawQuestionTranslations)

  // Translation hook
  const {
    isTranslating,
    setIsTranslating,
    translatedText,
    setTranslatedText,
    setTranslatedOptions,
    setTranslatedExplanation,
    translationBoxQuestion,
    translationBoxOptions,
    translationBoxExplanation
  } = useTranslation({
    question,
    language,
    showTranslation,
    stateTranslation,
    questionTranslations
  })

  // Layout hook
  const { containerHeight, cardRef, contentRef } = useCardLayout([
    question.id,
    showTranslation,
    imageError,
    selectedAnswer
  ])

  // Keyboard handler hook
  useKeyboardHandler({
    question,
    showAnswer,
    onSwipe,
    onAnswerSelect: (index: number) => handleAnswerClick(index)
  })

  // Sync external selected answer
  useEffect(() => {
    if (externalSelectedAnswer !== undefined) {
      setSelectedAnswer(externalSelectedAnswer)
    }
  }, [externalSelectedAnswer])

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null)
    setInternalShowTranslation(false)
    setTranslatedText("")
    setTranslatedOptions([])
    setTranslatedExplanation("")
    setImageError(false)
  }, [question.id])

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)

    const offset = info.offset.x
    const velocity = info.velocity.x
    const absVelocity = Math.abs(velocity)
    const absOffset = Math.abs(offset)

    const shouldSwipe = absVelocity >= SWIPE_ANIMATION_CONFIG.SWIPE_VELOCITY_THRESHOLD ||
                       absOffset >= SWIPE_ANIMATION_CONFIG.SWIPE_OFFSET_THRESHOLD

    if (shouldSwipe) {
      const direction = offset > 0 ? "left" : "right"

      // Smooth exit animation
      await controls.start({
        x: offset > 0 ? 350 : -350,
        rotate: offset > 0 ? 20 : -20,
        opacity: 0,
        transition: {
          type: "spring",
          ...SWIPE_ANIMATION_CONFIG.EXIT_ANIMATION
        }
      })

      onSwipe(direction)

      // Smooth reset for next question
      x.set(0)
      y.set(0)
      await controls.start({
        x: 0,
        rotate: 0,
        opacity: 1,
        transition: {
          type: "spring",
          ...SWIPE_ANIMATION_CONFIG.SPRING_CONFIG,
          duration: 0.3
        }
      })
    } else {
      // Smooth spring back to center
      await controls.start({
        x: 0,
        y: 0,
        transition: {
          type: "spring",
          ...SWIPE_ANIMATION_CONFIG.SPRING_CONFIG
        }
      })
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
      try {
        onTranslate()
      } catch (e) {
        // ignore
      }
      return
    }

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
      const translatedQuestionText = await translateText(question.question, language)
      const translatedOptionsArray = await Promise.all(
        (Array.isArray(question.options) ? question.options : []).map(async (option) => await translateText(option, language))
      )
      let translatedExplanationText = ""
      if (question.explanation) {
        translatedExplanationText = await translateText(question.explanation, language)
      }
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

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Smoother background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-cyan-500/5 rounded-3xl blur-2xl"
        style={{
          animation: 'pulse 4s ease-in-out infinite',
          animationDelay: '0s'
        }}
      />

      {/* Swipe Indicators with smoother animations */}
      <motion.div
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 pointer-events-none"
        style={{
          opacity: prevIndicatorOpacity,
          scale: prevIndicatorScale
        }}
      >
        <div className="bg-green-500/90 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-xl border-2 border-green-300/50 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <span>NEXT</span>
            <span>→</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 pointer-events-none"
        style={{
          opacity: nextIndicatorOpacity,
          scale: nextIndicatorScale
        }}
      >
        <div className="bg-blue-500/90 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-xl border-2 border-blue-300/50 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <span>←</span>
            <span>PREV</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        ref={cardRef}
        className="w-full cursor-grab active:cursor-grabbing relative z-10"
        style={{
          x,
          y,
          rotate,
          scale,
          height: containerHeight ? `${containerHeight}px` : undefined,
          minHeight: CARD_STYLES.minHeight,
          transition: `height ${CARD_STYLES.transitionDuration} ${CARD_STYLES.transitionEasing}`,
          overflow: 'visible',
        }}
        drag="x"
        dragConstraints={SWIPE_ANIMATION_CONFIG.DRAG_CONSTRAINTS}
        dragElastic={SWIPE_ANIMATION_CONFIG.DRAG_ELASTIC}
        dragMomentum={false}
        dragTransition={{
          bounceStiffness: 300,
          bounceDamping: 40
        }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={controls}
        whileDrag={{
          cursor: "grabbing",
          transition: {
            type: "spring",
            stiffness: 200,
            damping: 25,
            mass: 1
          }
        }}
      >
        <Card
          ref={contentRef}
          className={`border-4 border-cyan-400/50 bg-gradient-to-br from-black/80 to-purple-900/80 backdrop-blur-xl shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-500 ease-out overflow-hidden relative ${
            isDragging ? 'shadow-2xl shadow-cyan-500/40' : ''
          }`}
        >
          {/* Subtle drag effect overlay */}
          {isDragging && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-purple-500/5 to-pink-500/5 pointer-events-none z-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}

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
                  onClick={() => speakText(
                    showTranslation && translatedText ? translatedText : question.question,
                    showTranslation,
                    language
                  )}
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
                      {getLanguageDisplayName(language)} Translation
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
                  src={getImageSrc(imageError, question.image)}
                  alt="Question illustration"
                  className="max-w-full h-auto rounded-lg shadow-lg border-2 border-cyan-400/30"
                  style={{ maxHeight: CARD_STYLES.imageMaxHeight }}
                  onError={handleImageError}
                />
              </div>
            )}

            <div className="space-y-3">
              {question.options.map((originalOption: string, index: number) => {
                const translatedOption = Array.isArray(translationBoxOptions) ? translationBoxOptions[index] : undefined
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
                      <span>{originalOption}</span>
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
                        {getLanguageDisplayName(language)} Translation
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
    </div>
  )
}
