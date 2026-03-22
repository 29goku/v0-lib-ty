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
import { Icon } from "@/components/Icon"

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
      {/* Minimalist swipe indicators */}
      <motion.div
        className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 pointer-events-none"
        style={{
          opacity: prevIndicatorOpacity,
          scale: prevIndicatorScale
        }}
      >
        <div className="text-gray-400 text-3xl font-light">→</div>
      </motion.div>

      <motion.div
        className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 pointer-events-none"
        style={{
          opacity: nextIndicatorOpacity,
          scale: nextIndicatorScale
        }}
      >
        <div className="text-gray-400 text-3xl font-light">←</div>
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
          className={`border border-gray-700 bg-white/5 backdrop-blur-sm overflow-hidden relative transition-all duration-200 ${
            isDragging ? 'border-gray-600' : ''
          }`}
        >
          <CardHeader className="relative z-10 pb-4">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl md:text-2xl font-semibold text-white leading-tight flex-1">
                {t.question} {question.id}
              </CardTitle>
              <div className="flex gap-1 ml-4">
                <Button
                  onClick={translateQuestion}
                  disabled={isTranslating}
                  className="bg-transparent hover:bg-gray-800/50 text-gray-300 hover:text-white border border-gray-700 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                  title={showTranslation ? t.translated : t.translate}
                >
                  <Languages className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => speakText(
                    showTranslation && translatedText ? translatedText : question.question,
                    showTranslation,
                    language
                  )}
                  className="bg-transparent hover:bg-gray-800/50 text-gray-300 hover:text-white border border-gray-700 px-2 py-1.5 rounded text-xs transition-colors"
                  title={t.speak || "Read aloud"}
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={onFlag}
                  className={`border px-2 py-1.5 rounded text-xs transition-colors ${
                    isFlagged
                      ? "bg-red-500/20 border-red-500/50 text-red-300"
                      : "bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  }`}
                  title={isFlagged ? "Unflag" : "Flag"}
                >
                  <Flag className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-base md:text-lg text-gray-100 leading-relaxed font-normal">
                {question.question}
              </p>
              {showTranslation && translationBoxQuestion && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 rounded border border-gray-700 bg-gray-900/30"
                >
                  <p className="text-sm text-gray-300">{translationBoxQuestion}</p>
                </motion.div>
              )}
            </div>
          </CardHeader>

          <CardContent className="relative z-10 pt-2 pb-6 px-6 space-y-4">
            {question.image && !imageError && (
              <div className="mb-4 flex justify-center">
                <img
                  src={question.image}
                  alt="Question illustration"
                  className="max-w-full h-auto rounded"
                  style={{ maxHeight: "200px" }}
                  onError={handleImageError}
                />
              </div>
            )}

            <div className="space-y-2">
              {question.options.map((originalOption: string, index: number) => {
                const translatedOption = Array.isArray(translationBoxOptions) ? translationBoxOptions[index] : undefined
                return (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={showAnswer}
                  whileHover={{ backgroundColor: showAnswer ? undefined : "rgba(0,0,0,0.4)" }}
                  whileTap={{ scale: 0.99 }}
                  className={`w-full p-3 text-left rounded border text-sm transition-all ${
                    showAnswer
                      ? index === question.answerIndex
                        ? "bg-green-500/20 border-green-500/50 text-green-200"
                        : selectedAnswer === index
                          ? "bg-red-500/20 border-red-500/50 text-red-200"
                          : "bg-gray-900/20 border-gray-800 text-gray-500"
                      : selectedAnswer === index
                        ? "bg-blue-500/20 border-blue-500/50 text-blue-100"
                        : "bg-transparent border-gray-700 text-gray-200 hover:bg-gray-900/20"
                  }`}
                >
                  <div className="flex gap-3">
                    <span className="font-semibold text-gray-400 flex-shrink-0">{String.fromCharCode(65 + index)}.</span>
                    <div className="flex-1 text-left">
                      <div>{originalOption}</div>
                      {showTranslation && translatedOption && (
                        <div className="mt-1 text-xs text-gray-400">{translatedOption}</div>
                      )}
                    </div>
                  </div>
                </motion.button>
                )
              })}
            </div>

            {!showAnswer && (
              <div className="text-center pt-2">
                <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
                  <Icon name="Lightbulb" size="sm" color="text-gray-600" animate={false} />
                  {t.selectAnswer}
                </p>
              </div>
            )}

            {showAnswer && question.explanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="pt-4 border-t border-gray-800 space-y-2"
              >
                <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Icon name="Lightbulb" size="sm" color="text-gray-400" />
                  {t.explanation}
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">{question.explanation}</p>
                {showTranslation && translationBoxExplanation && (
                  <div className="mt-3 p-3 rounded bg-gray-900/30 border border-gray-800">
                    <p className="text-gray-400 text-xs">{translationBoxExplanation}</p>
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
