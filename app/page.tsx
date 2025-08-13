"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useStore } from "@/lib/store"
import { getTranslation } from "@/lib/i18n"
import SwipeCard from "@/components/SwipeCard"
import ProgressBar from "@/components/ProgressBar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, RotateCcw, Trophy, Target, Zap, Globe } from "lucide-react"
import LanguageSelector from "@/components/LanguageSelector"

export default function HomePage() {
  const {
    questions,
    currentQuestionIndex,
    userProgress,
    nextQuestion,
    previousQuestion,
    answerQuestion,
    flagQuestion,
    unflagQuestion,
    addXP,
    updateStreak,
    loadQuestions,
    language,
  } = useStore()

  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showTranslation, setShowTranslation] = useState(false)

  const t = getTranslation(language)

  // Load questions on component mount
  useEffect(() => {
    const initializeQuestions = async () => {
      setIsLoading(true)
      try {
        await loadQuestions()
      } catch (error) {
        console.error("Failed to load questions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeQuestions()
  }, [loadQuestions])

  // Reset state when question changes
  useEffect(() => {
    setShowAnswer(false)
    setSelectedAnswer(null)
    setShowTranslation(false)
  }, [currentQuestionIndex])

  const currentQuestion = questions[currentQuestionIndex]
  const isQuestionFlagged = currentQuestion ? userProgress.flaggedQuestions.includes(currentQuestion.id) : false

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (direction === "left") {
        previousQuestion()
      } else {
        nextQuestion()
      }
    },
    [nextQuestion, previousQuestion],
  )

  const handleAnswerSelect = useCallback(
    (answerIndex: number) => {
      if (!currentQuestion || showAnswer) return

      setSelectedAnswer(answerIndex)
      const isCorrect = answerIndex === currentQuestion.answerIndex

      // Update progress
      answerQuestion(currentQuestion.id, answerIndex, isCorrect)
      updateStreak(isCorrect)

      if (isCorrect) {
        addXP(10)
      }

      // Show answer after a brief delay
      setTimeout(() => {
        setShowAnswer(true)
      }, 500)
    },
    [currentQuestion, showAnswer, answerQuestion, updateStreak, addXP],
  )

  const handleFlag = useCallback(() => {
    if (!currentQuestion) return

    if (isQuestionFlagged) {
      unflagQuestion(currentQuestion.id)
    } else {
      flagQuestion(currentQuestion.id)
    }
  }, [currentQuestion, isQuestionFlagged, flagQuestion, unflagQuestion])

  const handleTranslate = useCallback(() => {
    setShowTranslation(!showTranslation)
  }, [showTranslation])

  const resetQuestion = () => {
    setShowAnswer(false)
    setSelectedAnswer(null)
    setShowTranslation(false)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (showAnswer) return

      switch (event.key) {
        case "1":
        case "2":
        case "3":
        case "4":
          const answerIndex = Number.parseInt(event.key) - 1
          if (answerIndex < (currentQuestion?.options.length || 0)) {
            handleAnswerSelect(answerIndex)
          }
          break
        case "ArrowLeft":
        case "a":
        case "A":
          event.preventDefault()
          previousQuestion()
          break
        case "ArrowRight":
        case "d":
        case "D":
          event.preventDefault()
          nextQuestion()
          break
        case "f":
        case "F":
          event.preventDefault()
          handleFlag()
          break
        case "t":
        case "T":
          event.preventDefault()
          handleTranslate()
          break
        case "r":
        case "R":
          event.preventDefault()
          resetQuestion()
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [currentQuestion, showAnswer, handleAnswerSelect, previousQuestion, nextQuestion, handleFlag, handleTranslate])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-400 border-t-transparent mx-auto"></div>
          <h2 className="text-2xl font-bold text-white">{t.loading}</h2>
          <p className="text-gray-400">{t.loadingQuestions}</p>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
        <Card className="bg-black/80 border-red-500/50 p-8">
          <CardContent className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-400">{t.noQuestions}</h2>
            <p className="text-gray-400">{t.noQuestionsDesc}</p>
            <Button onClick={() => window.location.reload()} className="bg-red-500 hover:bg-red-600">
              {t.reload}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Globe className="w-8 h-8 text-cyan-400" />
              <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
                {t.appTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Stats */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-bold">{userProgress.xp} XP</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-400" />
                <span className="text-white font-bold">{userProgress.streak}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-purple-400" />
                <span className="text-white font-bold">{userProgress.correctAnswers}</span>
              </div>
            </div>

            <LanguageSelector />
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-7xl mx-auto mt-4">
          <ProgressBar progress={progress} />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-400">
              {t.question} {currentQuestionIndex + 1} {t.of} {questions.length}
            </span>
            <span className="text-sm text-gray-400">
              {Math.round(progress)}% {t.complete}
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.3 }}
            >
              <SwipeCard
                question={currentQuestion}
                onSwipe={handleSwipe}
                onAnswerSelect={handleAnswerSelect}
                showAnswer={showAnswer}
                onFlag={handleFlag}
                isFlagged={isQuestionFlagged}
                isTranslated={showTranslation}
                onTranslate={handleTranslate}
              />
            </motion.div>
          </AnimatePresence>

          {/* Action buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            <Button
              onClick={resetQuestion}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              {t.reset}
            </Button>

            <Button
              onClick={() => nextQuestion()}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <Play className="w-5 h-5 mr-2" />
              {t.next}
            </Button>
          </div>

          {/* Mobile stats */}
          <div className="md:hidden mt-8 flex justify-center space-x-6">
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2">
              <Zap className="w-4 h-4 mr-1" />
              {userProgress.xp} XP
            </Badge>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2">
              <Target className="w-4 h-4 mr-1" />
              {userProgress.streak}
            </Badge>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2">
              <Trophy className="w-4 h-4 mr-1" />
              {userProgress.correctAnswers}
            </Badge>
          </div>

          {/* Keyboard shortcuts */}
          <div className="mt-12 text-center">
            <h3 className="text-lg font-bold text-white mb-4">{t.keyboardShortcuts}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-black/40 p-3 rounded-lg border border-gray-600">
                <kbd className="bg-gray-700 px-2 py-1 rounded text-sm text-white">1-4</kbd>
                <p className="text-xs text-gray-400 mt-1">{t.selectAnswer}</p>
              </div>
              <div className="bg-black/40 p-3 rounded-lg border border-gray-600">
                <kbd className="bg-gray-700 px-2 py-1 rounded text-sm text-white">A/D</kbd>
                <p className="text-xs text-gray-400 mt-1">{t.navigate}</p>
              </div>
              <div className="bg-black/40 p-3 rounded-lg border border-gray-600">
                <kbd className="bg-gray-700 px-2 py-1 rounded text-sm text-white">F</kbd>
                <p className="text-xs text-gray-400 mt-1">{t.flag}</p>
              </div>
              <div className="bg-black/40 p-3 rounded-lg border border-gray-600">
                <kbd className="bg-gray-700 px-2 py-1 rounded text-sm text-white">T</kbd>
                <p className="text-xs text-gray-400 mt-1">{t.translate}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
