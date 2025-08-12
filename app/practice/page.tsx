"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Filter, RotateCcw, Zap, Target, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SwipeCard from "@/components/SwipeCard"
import { useStore } from "@/lib/store"
import { getTranslation } from "@/lib/i18n"
import { getCategoryEmoji } from "@/lib/category-emojis"
import type { Question } from "@/lib/store"

const GERMAN_STATES = [
  "Baden-Württemberg",
  "Bayern",
  "Berlin",
  "Brandenburg",
  "Bremen",
  "Hamburg",
  "Hessen",
  "Mecklenburg-Vorpommern",
  "Niedersachsen",
  "Nordrhein-Westfalen",
  "Rheinland-Pfalz",
  "Saarland",
  "Sachsen",
  "Sachsen-Anhalt",
  "Schleswig-Holstein",
  "Thüringen",
]

export default function PracticePage() {
  const router = useRouter()
  const {
    questions,
    stateQuestions,
    currentQuestionIndex,
    userProgress,
    selectedCategory,
    selectedState,
    language,
    setQuestions,
    setStateQuestions,
    nextQuestion,
    previousQuestion,
    setCurrentQuestionIndex,
    answerQuestion,
    flagQuestion,
    unflagQuestion,
    addXP,
    updateStreak,
    setSelectedCategory,
    setSelectedState,
    addBadge,
    loadQuestions,
  } = useStore()

  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stateQuestionsData, setStateQuestionsData] = useState<Record<string, Question[]>>({})

  const t = getTranslation(language)

  // Load questions on component mount
  useEffect(() => {
    const initializeQuestions = async () => {
      setIsLoading(true)
      try {
        await loadQuestions()

        // Load state questions
        const stateResponse = await fetch("/data/state-questions.json")
        if (stateResponse.ok) {
          const stateData = await stateResponse.json()
          setStateQuestionsData(stateData)

          // If a state is selected, set the state questions
          if (selectedState && stateData[selectedState]) {
            setStateQuestions(stateData[selectedState])
          }
        }
      } catch (error) {
        console.error("Failed to load questions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeQuestions()
  }, [loadQuestions, selectedState, setStateQuestions])

  // Get the appropriate questions to use (state or main)
  const getQuestionsToUse = useCallback((): Question[] => {
    if (selectedState && stateQuestions.length > 0) {
      return stateQuestions
    }
    return questions
  }, [selectedState, stateQuestions, questions])

  // Get filtered questions based on category
  const getFilteredQuestions = useCallback((): Question[] => {
    const questionsToUse = getQuestionsToUse()

    if (!selectedCategory || selectedCategory === "all") {
      return questionsToUse
    }

    return questionsToUse.filter((q) => q.category.toLowerCase() === selectedCategory.toLowerCase())
  }, [getQuestionsToUse, selectedCategory])

  // Get available categories from current question set
  const getCategories = useCallback((): string[] => {
    const questionsToUse = getQuestionsToUse()
    const categories = Array.from(new Set(questionsToUse.map((q) => q.category)))
    return categories.sort()
  }, [getQuestionsToUse])

  const filteredQuestions = getFilteredQuestions()
  const currentQuestion = filteredQuestions[currentQuestionIndex]
  const categories = getCategories()

  const handleAnswerSelect = (answerIndex: number) => {
    if (showAnswer) return
    setSelectedAnswer(answerIndex)
  }

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      handleNextQuestion()
    } else {
      handlePreviousQuestion()
    }
  }

  const handleNextQuestion = () => {
    if (!currentQuestion) return

    if (selectedAnswer !== null && !showAnswer) {
      // Process the answer
      const isCorrect = selectedAnswer === currentQuestion.answerIndex
      answerQuestion(currentQuestion.id, selectedAnswer, isCorrect)
      updateStreak(isCorrect)

      if (isCorrect) {
        addXP(10)
        // Check for badges
        if (userProgress.correctAnswers === 0) {
          addBadge("firstCorrect")
        }
        if (userProgress.streak === 4) {
          addBadge("streak5")
        }
        if (userProgress.streak === 9) {
          addBadge("streak10")
        }
      }

      setShowAnswer(true)
      setTimeout(() => {
        setShowAnswer(false)
        setSelectedAnswer(null)
        if (currentQuestionIndex < filteredQuestions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1)
        } else {
          setCurrentQuestionIndex(0) // Loop back to start
        }
      }, 2000)
    } else if (showAnswer) {
      setShowAnswer(false)
      setSelectedAnswer(null)
      if (currentQuestionIndex < filteredQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        setCurrentQuestionIndex(0) // Loop back to start
      }
    }
  }

  const handlePreviousQuestion = () => {
    if (showAnswer) {
      setShowAnswer(false)
      setSelectedAnswer(null)
    } else if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    } else {
      setCurrentQuestionIndex(filteredQuestions.length - 1) // Loop to end
    }
  }

  const handleFlag = () => {
    if (!currentQuestion) return

    if (userProgress.flaggedQuestions.includes(currentQuestion.id)) {
      unflagQuestion(currentQuestion.id)
    } else {
      flagQuestion(currentQuestion.id)
    }
  }

  const handleCategorySelection = (category: string) => {
    setSelectedCategory(category === "all" ? null : category)
    setCurrentQuestionIndex(0)
    setShowAnswer(false)
    setSelectedAnswer(null)
  }

  const handleStateSelection = (state: string | null) => {
    setSelectedState(state)
    setSelectedCategory(null) // Reset category when changing state
    setCurrentQuestionIndex(0)
    setShowAnswer(false)
    setSelectedAnswer(null)

    // Load state questions if state is selected
    if (state && stateQuestionsData[state]) {
      setStateQuestions(stateQuestionsData[state])
    } else {
      setStateQuestions([])
    }
  }

  const resetProgress = () => {
    setCurrentQuestionIndex(0)
    setShowAnswer(false)
    setSelectedAnswer(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-white text-xl font-bold">{t.loadingQuestions}</p>
        </div>
      </div>
    )
  }

  if (filteredQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
        <Card className="bg-black/80 border-cyan-400/50 p-8 text-center">
          <p className="text-white text-xl mb-4">{t.failedToLoad}</p>
          <Button onClick={() => window.location.reload()} className="bg-cyan-500 hover:bg-cyan-600">
            {t.tryAgain}
          </Button>
        </Card>
      </div>
    )
  }

  const isFlagged = currentQuestion ? userProgress.flaggedQuestions.includes(currentQuestion.id) : false

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-cyan-400/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white border-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.back}
            </Button>

            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-black text-white">
                <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
                  {t.practiceMode}
                </span>
              </h1>
              <p className="text-cyan-300 text-sm md:text-base">
                {selectedState ? `${selectedState} - ${t.practiceSubtitle}` : t.practiceSubtitle}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0">
                <Zap className="w-4 h-4 mr-1" />
                {userProgress.xp} XP
              </Badge>
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                <Target className="w-4 h-4 mr-1" />
                {userProgress.streak}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Filters */}
          <div className="mb-8">
            <Tabs defaultValue="categories" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-black/60 border border-cyan-400/30">
                <TabsTrigger
                  value="categories"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {selectedState ? `${selectedState} Categories` : t.filterByCategory}
                </TabsTrigger>
                <TabsTrigger
                  value="states"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {t.selectState}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="categories" className="mt-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => handleCategorySelection("all")}
                    className={`${
                      !selectedCategory
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                        : "bg-black/60 text-gray-300 hover:bg-black/80"
                    } border border-cyan-400/30`}
                  >
                    {selectedState ? `All ${selectedState} Categories` : t.allCategories}
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      onClick={() => handleCategorySelection(category)}
                      className={`${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          : "bg-black/60 text-gray-300 hover:bg-black/80"
                      } border border-cyan-400/30`}
                    >
                      {getCategoryEmoji(category)} {category}
                    </Button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="states" className="mt-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => handleStateSelection(null)}
                    className={`${
                      !selectedState
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                        : "bg-black/60 text-gray-300 hover:bg-black/80"
                    } border border-cyan-400/30`}
                  >
                    {t.allGermany}
                  </Button>
                  {GERMAN_STATES.map((state) => (
                    <Button
                      key={state}
                      onClick={() => handleStateSelection(state)}
                      className={`${
                        selectedState === state
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          : "bg-black/60 text-gray-300 hover:bg-black/80"
                      } border border-cyan-400/30`}
                    >
                      {state}
                    </Button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-cyan-300 font-bold">
                {t.question} {currentQuestionIndex + 1} {t.of} {filteredQuestions.length}
              </span>
              <Button
                onClick={resetProgress}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white border-0 px-3 py-2"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                {t.reset}
              </Button>
            </div>
            <div className="w-full bg-black/60 rounded-full h-3 border border-cyan-400/30">
              <div
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="mb-8">
            <AnimatePresence mode="wait">
              {currentQuestion && (
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
                    onFlag={handleFlag}
                    isFlagged={isFlagged}
                    showAnswer={showAnswer}
                    onAnswerSelect={handleAnswerSelect}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Instructions */}
          <Card className="bg-black/60 border-cyan-400/30 backdrop-blur-xl">
            <CardContent className="p-6 text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                <div className="space-y-2">
                  <div className="text-2xl">👆</div>
                  <p className="font-bold text-cyan-300">{t.selectAnswer}</p>
                  <p className="text-sm text-gray-300">Choose your answer first</p>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl">👈👉</div>
                  <p className="font-bold text-cyan-300">{t.swipeInstructions}</p>
                  <p className="text-sm text-gray-300">Drag the card left or right</p>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl">⌨️</div>
                  <p className="font-bold text-cyan-300">{t.keyboardShortcuts}</p>
                  <p className="text-sm text-gray-300">Use arrow keys for navigation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
