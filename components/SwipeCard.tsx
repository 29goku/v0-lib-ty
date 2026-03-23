"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flag, Languages, Volume2, Zap } from "lucide-react"
import { motion, type PanInfo } from "framer-motion"
import { useStore } from "@/lib/store"
import { useTheme } from "@/lib/theme"
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
import GamificationFeedback from "@/components/GamificationFeedback"

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
  totalQuestions?: number
  onJumpToQuestion?: (questionNumber: number) => void
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
  totalQuestions,
  onJumpToQuestion,
}: SwipeCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [internalShowTranslation, setInternalShowTranslation] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [jumpInput, setJumpInput] = useState("")
  const [showJumpDialog, setShowJumpDialog] = useState(false)

  const { language } = useStore()
  const { isDark } = useTheme()
  const t = getTranslation(language)

  // Use externalSelectedAnswer if provided (for displaying feedback from parent)
  const displaySelectedAnswer = externalSelectedAnswer !== undefined ? externalSelectedAnswer : selectedAnswer

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
    if (externalSelectedAnswer !== undefined && externalSelectedAnswer !== null) {
      setSelectedAnswer(externalSelectedAnswer)
    } else if (externalSelectedAnswer === null) {
      setSelectedAnswer(null)
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

  const handleJumpToQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    const num = parseInt(jumpInput, 10)
    if (totalQuestions && num > 0 && num <= totalQuestions && onJumpToQuestion) {
      onJumpToQuestion(num - 1) // Convert to 0-indexed
      setJumpInput("")
      setShowJumpDialog(false)
    }
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Minimalist swipe indicators - hidden on mobile */}
      <motion.div
        className="hidden sm:block absolute right-8 top-1/2 transform -translate-y-1/2 z-20 pointer-events-none"
        style={{
          opacity: prevIndicatorOpacity,
          scale: prevIndicatorScale
        }}
      >
        <div className={`text-3xl font-light ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>→</div>
      </motion.div>

      <motion.div
        className="hidden sm:block absolute left-8 top-1/2 transform -translate-y-1/2 z-20 pointer-events-none"
        style={{
          opacity: nextIndicatorOpacity,
          scale: nextIndicatorScale
        }}
      >
        <div className={`text-3xl font-light ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>←</div>
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
          className={`border backdrop-blur-sm overflow-hidden relative transition-all duration-200 ${
            isDark ? 'border-gray-700 bg-white/5' : 'border-gray-200 bg-gray-50'
          } ${
            isDragging ? (isDark ? 'border-gray-600' : 'border-gray-300') : ''
          }`}
        >
          <CardHeader className="relative z-10 pb-4">
            <div className="flex justify-between items-start gap-3 flex-wrap">
              <CardTitle className={`text-xl md:text-2xl font-semibold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t.question} {question.id}
              </CardTitle>
              <div className="flex gap-1 ml-4 flex-wrap justify-end">
                <Button
                  onClick={translateQuestion}
                  disabled={isTranslating}
                  className={`border px-2 py-1.5 rounded text-xs font-medium transition-colors ${isDark ? 'bg-transparent hover:bg-gray-800/50 text-gray-300 hover:text-white border-gray-700' : 'bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900 border-gray-300'}`}
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
                  className={`border px-2 py-1.5 rounded text-xs transition-colors ${isDark ? 'bg-transparent hover:bg-gray-800/50 text-gray-300 hover:text-white border-gray-700' : 'bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900 border-gray-300'}`}
                  title={t.speak || "Read aloud"}
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={onFlag}
                  className={`border px-2 py-1.5 rounded text-xs transition-colors ${
                    isFlagged
                      ? isDark ? "bg-red-500/20 border-red-500/50 text-red-300" : "bg-red-100 border-red-400 text-red-700"
                      : isDark ? "bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:text-white" : "bg-transparent border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  title={isFlagged ? "Unflag" : "Flag"}
                >
                  <Flag className="w-4 h-4" />
                </Button>
                {totalQuestions && (
                  <Button
                    onClick={() => setShowJumpDialog(!showJumpDialog)}
                    className={`border px-2 py-1.5 rounded text-xs transition-colors ${isDark ? 'bg-transparent hover:bg-blue-500/20 text-blue-300 border-blue-700 hover:border-blue-500' : 'bg-transparent hover:bg-blue-100 text-blue-600 border-blue-300 hover:border-blue-500'}`}
                    title={`Jump to question (1-${totalQuestions})`}
                  >
                    <Zap className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Jump to Question Dialog */}
            {showJumpDialog && totalQuestions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mt-3 p-3 rounded border ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-100 border-gray-300'}`}
              >
                <form onSubmit={handleJumpToQuestion} className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max={totalQuestions}
                    value={jumpInput}
                    onChange={(e) => setJumpInput(e.target.value)}
                    placeholder={`Enter 1-${totalQuestions}`}
                    autoFocus
                    className={`flex-1 px-3 py-2 text-sm rounded border ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                  />
                  <Button
                    type="submit"
                    disabled={!jumpInput}
                    className={`px-4 py-2 text-sm border rounded font-medium transition-colors ${isDark ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-700 hover:border-blue-500' : 'bg-blue-100 hover:bg-blue-200 text-blue-600 border-blue-300'}`}
                  >
                    Jump
                  </Button>
                </form>
              </motion.div>
            )}

            <div className="space-y-3">
              <p className={`text-base md:text-lg leading-relaxed font-normal ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                {question.question}
              </p>
              {showTranslation && translationBoxQuestion && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-3 rounded border ${isDark ? 'border-gray-700 bg-gray-900/30' : 'border-gray-200 bg-gray-100'}`}
                >
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{translationBoxQuestion}</p>
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
                  drag={false}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                  whileTap={{ scale: 0.99 }}
                  style={{ pointerEvents: "auto" }}
                  className={`w-full p-3 text-left rounded border-2 text-sm transition-all font-semibold ${
                    showAnswer && displaySelectedAnswer !== null
                      ? index === question.answerIndex
                        ? isDark ? "bg-green-500/50 border-green-400 text-green-100" : "bg-green-300 border-green-700 text-green-950"
                        : displaySelectedAnswer === index
                          ? isDark ? "bg-red-500/50 border-red-400 text-red-100" : "bg-red-300 border-red-700 text-red-950"
                          : isDark ? "bg-gray-900/20 border-gray-700 text-gray-500" : "bg-gray-100 border-gray-400 text-gray-600"
                      : displaySelectedAnswer === index
                        ? isDark ? "bg-blue-500/40 border-blue-400 text-blue-100" : "bg-blue-200 border-blue-600 text-blue-900"
                        : isDark ? "bg-transparent border-gray-700 text-gray-200 hover:bg-gray-900/20" : "bg-transparent border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex gap-3">
                    <span className={`font-semibold flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{String.fromCharCode(65 + index)}.</span>
                    <div className="flex-1 text-left">
                      <div>{originalOption}</div>
                      {showTranslation && translatedOption && (
                        <div className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{translatedOption}</div>
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
                className={`pt-4 border-t space-y-2 ${isDark ? 'border-gray-800' : 'border-gray-300'}`}
              >
                <h4 className={`text-sm font-semibold flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Icon name="Lightbulb" size="sm" color={isDark ? "text-gray-400" : "text-gray-500"} />
                  {t.explanation}
                </h4>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{question.explanation}</p>
                {showTranslation && translationBoxExplanation && (
                  <div className={`mt-3 p-3 rounded border ${isDark ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-100 border-gray-300'}`}>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{translationBoxExplanation}</p>
                  </div>
                )}
              </motion.div>
            )}

            {showAnswer && displaySelectedAnswer !== null && (
              <div className="hidden md:block">
                <GamificationFeedback
                  isCorrect={displaySelectedAnswer === question.answerIndex}
                  xpGained={displaySelectedAnswer === question.answerIndex ? 10 : 0}
                  accuracy={0}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
