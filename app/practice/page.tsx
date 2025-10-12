"use client"

import { useEffect, useState, useRef } from "react"
import { useStore } from "@/lib/store"
import SwipeCard from "@/components/SwipeCard"
import ProgressBar from "@/components/ProgressBar"
import Badge from "@/components/Badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, RotateCcw, Filter, MapPin, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { getTranslation } from "@/lib/i18n"
import LanguageSelector from "@/components/LanguageSelector"
import { getCategoryEmoji } from "@/lib/category-emojis"
import { MultiSelect } from "@/components/MultiSelect"

const germanStates = [
  { id: "baden-wuerttemberg", name: "Baden-Württemberg", emoji: "🏰" },
  { id: "bayern", name: "Bayern", emoji: "🍺" },
  { id: "berlin", name: "Berlin", emoji: "🐻" },
  { id: "brandenburg", name: "Brandenburg", emoji: "🌲" },
  { id: "bremen", name: "Bremen", emoji: "⚓" },
  { id: "hamburg", name: "Hamburg", emoji: "🚢" },
  { id: "hessen", name: "Hessen", emoji: "🏛️" },
  { id: "mecklenburg-vorpommern", name: "Mecklenburg-Vorpommern", emoji: "🏖️" },
  { id: "niedersachsen", name: "Niedersachsen", emoji: "🐴" },
  { id: "nordrhein-westfalen", name: "Nordrhein-Westfalen", emoji: "🏴" },
  { id: "rheinland-pfalz", name: "Rheinland-Pfalz", emoji: "🍷" },
  { id: "saarland", name: "Saarland", emoji: "⚒️" },
  { id: "sachsen", name: "Sachsen", emoji: "🎭" },
  { id: "sachsen-anhalt", name: "Sachsen-Anhalt", emoji: "🏰" },
  { id: "schleswig-holstein", name: "Schleswig-Holstein", emoji: "🌊" },
  { id: "thueringen", name: "Thüringen", emoji: "🌳" },
]

export default function PracticePage() {
  const {
    questions,
    stateQuestions,
    setStateQuestions,
    setSelectedState,
    selectedState,
    setSelectedCategory,
    userProgress,
    answerQuestion,
    flagQuestion,
    unflagQuestion,
    addXP,
    updateStreak,
    addBadge,
    language,
    loadQuestions,
    resetProgress: resetUserProgress,
  } = useStore()

  const [showAnswer, setShowAnswer] = useState(false)
  const [lastAnswer, setLastAnswer] = useState<{
    correct: boolean
    selectedIndex: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [showTranslation, setShowTranslation] = useState(false)
  const [isAutoMode, setIsAutoMode] = useState(false)
  const [autoDelay, setAutoDelay] = useState(3000)
  const [currentIndex, setCurrentIndex] = useState(0)
  const overviewRef = useRef<HTMLDivElement | null>(null)

  // Multi-select filter states
  const [selectedFlagFilters, setSelectedFlagFilters] = useState<string[]>([])
  const [selectedStates, setSelectedStates] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  // Store all loaded state questions by state id
  const [allStateQuestions, setAllStateQuestions] = useState<Record<string, any[]>>({})
  // Reset confirmation dialog
  const [showResetDialog, setShowResetDialog] = useState(false)
  // Store current question to prevent UI update during transition
  const [displayQuestion, setDisplayQuestion] = useState<any>(null)

  // emoji for the currently selected state (used in compact pagination)
  const stateEmoji = selectedState ? germanStates.find((s) => s.id === selectedState)?.emoji : undefined

  const t = getTranslation(language)

  useEffect(() => {
    const initializePractice = async () => {
      setLoading(true)

      try {
        if (questions.length === 0) {
          await loadQuestions()
        }

        if (selectedState) {
          try {
            const stateResponse = await fetch("/data/state-questions.json")
            if (stateResponse.ok) {
              const stateData = await stateResponse.json()
              setStateQuestions(stateData[selectedState] || [])
            }
          } catch (error) {
            console.error("Failed to load state questions:", error)
            setStateQuestions([])
          }
        } else {
          setStateQuestions([])
        }
      } catch (error) {
        console.error("Failed to initialize practice:", error)
      } finally {
        setLoading(false)
      }
    }

    initializePractice()
  }, [questions.length, loadQuestions, setStateQuestions, selectedState])

  // Get the appropriate questions based on state selection
  const getQuestionsToUse = () => {
    if (selectedStates.length > 0) {
      let combinedQuestions: any[] = []
      selectedStates.forEach(stateId => {
        if (selectedStates.length === 1 && stateId === selectedState && stateQuestions.length > 0) {
          combinedQuestions = [...combinedQuestions, ...stateQuestions]
        }
      })
      return combinedQuestions.length > 0 ? combinedQuestions : questions
    }
    return questions
  }

  const questionsToUse = getQuestionsToUse()

  // Get categories from the appropriate question set
  const getCategories = () => {
    if (selectedStates.length > 0 && questionsToUse !== questions) {
      return [...new Set(questionsToUse.map((q) => q.category))]
    }
    return [...new Set(questions.map((q) => q.category))]
  }

  const categories = getCategories()

  // Filter questions based on category and flag status
  let filteredQuestions = questionsToUse

  // Apply category filter
  if (selectedCategories.length > 0) {
    filteredQuestions = filteredQuestions.filter((q) => selectedCategories.includes(q.category))
  }

  // Calculate dynamic counts for status filters
  const questionsBeforeFlagFilter = filteredQuestions
  const flaggedCount = questionsBeforeFlagFilter.filter(q => userProgress.flaggedQuestions.includes(q.id)).length
  const incorrectCount = questionsBeforeFlagFilter.filter(q => (userProgress.incorrectAnswers || []).includes(q.id)).length
  const correctCount = questionsBeforeFlagFilter.filter(q =>
      userProgress.completedQuestions.includes(q.id) &&
      !(userProgress.incorrectAnswers || []).includes(q.id)
  ).length

  // Apply flag filter
  if (selectedFlagFilters.length > 0) {
    filteredQuestions = filteredQuestions.filter((q) => {
      return selectedFlagFilters.some(filter => {
        if (filter === "flagged") {
          return userProgress.flaggedQuestions.includes(q.id)
        } else if (filter === "incorrect") {
          return (userProgress.incorrectAnswers || []).includes(q.id)
        } else if (filter === "correct") {
          return userProgress.completedQuestions.includes(q.id) &&
              !(userProgress.incorrectAnswers || []).includes(q.id)
        }
        return false
      })
    })
  }

  const currentQuestion = filteredQuestions[currentIndex]

  // Reset category when state changes
  useEffect(() => {
    setSelectedCategory(null)
    setCurrentIndex(0)
  }, [selectedState, setSelectedCategory])

  useEffect(() => {
    if (!overviewRef.current) return
    const el = overviewRef.current.querySelector(`[data-index="${currentIndex}"]`) as HTMLElement | null
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [currentIndex])

  // Update display question when current question changes (but not during feedback)
  useEffect(() => {
    if (!showAnswer && currentQuestion) {
      setDisplayQuestion(currentQuestion)
    }
  }, [currentQuestion, showAnswer])

  const handleFlag = () => {
    const questionToFlag = displayQuestion || currentQuestion
    if (!questionToFlag) return
    if (userProgress.flaggedQuestions.includes(questionToFlag.id)) {
      unflagQuestion(questionToFlag.id)
    } else {
      flagQuestion(questionToFlag.id)
    }
  }

  const nextQuestion = () => {
    setShowAnswer(false)
    setLastAnswer(null)
    setShowTranslation(false)
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(0)
    }
  }

  const previousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowAnswer(false)
      setLastAnswer(null)
      setShowTranslation(false)
    }
  }

  const handleQuestionJump = (index: number) => {
    setCurrentIndex(index)
    setShowAnswer(false)
    setLastAnswer(null)
    setShowTranslation(false)
  }

  const pageCount = filteredQuestions.length

  const getPaginationNumbers = (current: number, total: number) : Array<number | string> => {
    const pages: Array<number | string> = []
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i)
      return pages
    }

    pages.push(1)
    const left = Math.max(2, current)
    const right = Math.min(total - 1, current + 2)

    if (left > 2) pages.push('...')
    for (let i = left; i <= right; i++) pages.push(i)
    if (right < total - 1) pages.push('...')
    pages.push(total)

    return pages
  }

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "left") {
      previousQuestion()
    } else {
      nextQuestion()
    }
  }

  const handleAnswerSelect = (selectedAnswerIndex: number) => {
    if (showAnswer || !displayQuestion) return

    const isCorrect = selectedAnswerIndex === displayQuestion.answerIndex
    const questionId = displayQuestion.id

    // Check if this question will be removed from current filter after answering
    const willBeRemovedFromFilter = (() => {
      // If filtering by "incorrect" and we answer correctly
      if (selectedFlagFilters.includes("incorrect") && isCorrect) {
        return true
      }
      // If filtering by "correct" and we answer incorrectly
      if (selectedFlagFilters.includes("correct") && !isCorrect) {
        return true
      }
      return false
    })()

    answerQuestion(questionId, selectedAnswerIndex, isCorrect)

    if (isCorrect) {
      addXP(10)
      updateStreak(true)

      if (userProgress.streak === 5) addBadge("streak-5")
      if (userProgress.streak === 10) addBadge("streak-10")

      if (userProgress.xp >= 100 && !userProgress.badges.includes("xp-100")) addBadge("xp-100")
      if (userProgress.xp >= 500 && !userProgress.badges.includes("xp-500")) addBadge("xp-500")
    } else {
      updateStreak(false)
    }

    setLastAnswer({ correct: isCorrect, selectedIndex: selectedAnswerIndex })
    setShowAnswer(true)

    // If the question will be removed from filter, move to next after showing feedback
    if (willBeRemovedFromFilter) {
      const currentFilterLength = filteredQuestions.length
      setTimeout(() => {
        // First clear the feedback states
        setLastAnswer(null)
        setShowTranslation(false)
        // After removing this question, if we were at the last question, go to start
        // Otherwise stay at same index (which will now show the next question)
        if (currentIndex >= currentFilterLength - 1) {
          setCurrentIndex(0)
        }
        // Clear showAnswer last - this will trigger the useEffect to update displayQuestion
        setShowAnswer(false)
      }, isAutoMode ? autoDelay : 2000)
    } else if (isAutoMode) {
      setTimeout(() => {
        nextQuestion()
      }, autoDelay)
    }
  }

  const resetProgress = () => {
    setShowResetDialog(true)
  }

  const confirmReset = () => {
    // Reset user progress data (XP, streak, badges, etc.)
    resetUserProgress()
    // Reset UI state
    setCurrentIndex(0)
    setShowAnswer(false)
    setLastAnswer(null)
    setShowTranslation(false)
    // Clear all filters
    setSelectedFlagFilters([])
    setSelectedCategories([])
    setSelectedStates([])
    setSelectedCategory(null)
    setSelectedState(null)
    // Close dialog
    setShowResetDialog(false)
    // Force a page reload to ensure all state is cleared
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  const handleFlagFilterSelection = (filter: string) => {
    setSelectedFlagFilters(prev => {
      if (prev.includes(filter)) {
        return prev.filter(f => f !== filter)
      } else {
        return [...prev, filter]
      }
    })
    setCurrentIndex(0)
  }

  const clearStatusFilters = () => {
    setSelectedFlagFilters([])
    setCurrentIndex(0)
  }

  const clearAllFilters = () => {
    setSelectedFlagFilters([])
    setSelectedCategories([])
    setSelectedStates([])
    setSelectedCategory(null)
    setSelectedState(null)
    setCurrentIndex(0)
  }

  const hasNoQuestionsInFilter = filteredQuestions.length === 0

  if (loading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-pink-900 text-white flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
          </div>

          <Card className="w-full max-w-md border-2 border-cyan-400/50 bg-black/80 backdrop-blur-xl relative overflow-hidden shadow-2xl shadow-cyan-500/25">
            <CardContent className="p-8 text-center relative z-10">
              <div className="text-8xl mb-6 animate-bounce">🚀</div>
              <div className="animate-spin rounded-full h-16 w-16 bg-gradient-to-r from-cyan-400 border-4 border-cyan-400 border-t-transparent mx-auto mb-8"></div>
              <p className="text-cyan-300 text-2xl font-black animate-pulse">{t.loadingQuestions}</p>
              <p className="text-pink-400 text-lg font-bold mt-4 animate-bounce">{t.getReady}</p>
            </CardContent>
          </Card>
        </div>
    )
  }

  if (hasNoQuestionsInFilter) {
    const getEmptyStateMessage = () => {
      if (selectedFlagFilters.length > 0) {
        const filterNames = selectedFlagFilters.map(filter => {
          if (filter === "flagged") return "flagged"
          if (filter === "incorrect") return "incorrect"
          if (filter === "correct") return "correct"
          return filter
        }).join(", ")
        return `No questions found matching the selected filters: ${filterNames}.`
      } else if (selectedCategories.length > 0) {
        return `No questions found in categories: ${selectedCategories.join(", ")}${selectedStates.length > 0 ? ` for selected states` : ""}.`
      } else if (selectedStates.length > 0) {
        const stateNames = selectedStates.map(stateId =>
            germanStates.find((s) => s.id === stateId)?.name || stateId
        ).join(", ")
        return `No questions found for: ${stateNames}.`
      }
      return "No questions available."
    }

    const getEmptyStateEmoji = () => {
      if (selectedFlagFilters.includes("flagged")) return "🚩"
      if (selectedFlagFilters.includes("incorrect")) return "❌"
      if (selectedFlagFilters.includes("correct")) return "✅"
      return "📝"
    }

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden relative">
          <div className="fixed inset-0 z-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }}></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s", animationDuration: "6s" }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "4s", animationDuration: "8s" }}></div>
          </div>

          <div className="relative z-10 container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 md:mb-8 gap-4">
              <Link href="/">
                <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-2 border-red-400/50 px-4 py-2 md:px-6 md:py-3 rounded-xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 transition-all transform hover:scale-110 backdrop-blur-sm font-black text-sm md:text-base touch-manipulation">
                  <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                  {t.back.toUpperCase()}
                </Button>
              </Link>

              <div className="text-center">
                <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">
                <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
                  {t.practiceMode.toUpperCase()}
                </span>
                </h1>
                <div className="text-sm md:text-lg text-pink-300 font-bold">
                  {selectedState
                      ? `${germanStates.find((s) => s.id === selectedState)?.name || selectedState} Questions 🏛️`
                      : `${t.practiceSubtitle} 🚀`}
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-4">
                <LanguageSelector />
                <Button
                    onClick={resetProgress}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold px-4 py-2 md:px-6 md:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-0 text-sm md:text-base touch-manipulation"
                >
                  <RotateCcw className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                  {t.reset.toUpperCase()}
                </Button>
              </div>
            </div>

            {/* MultiSelect Dropdown Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              <Card className="border-2 border-pink-400/50 bg-black/60 backdrop-blur-xl shadow-lg shadow-pink-500/25">
                <CardContent className="p-4 md:p-6">
                  <MultiSelect
                      options={germanStates.map(state => ({
                        id: state.id,
                        label: state.name,
                        emoji: state.emoji
                      }))}
                      selectedValues={selectedStates}
                      onSelectionChange={(values) => {
                        setSelectedStates(values)
                        setSelectedState(values.length === 1 ? values[0] : null)
                        setCurrentIndex(0)
                      }}
                      placeholder="Select German states..."
                      label={t.selectState}
                      icon={<MapPin className="w-5 h-5 text-pink-400" />}
                      className="w-full"
                  />
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-400/50 bg-black/60 backdrop-blur-xl shadow-lg shadow-purple-500/25">
                <CardContent className="p-4 md:p-6">
                  <MultiSelect
                      options={categories.map(category => ({
                        id: category,
                        label: category,
                        emoji: getCategoryEmoji(category)
                      }))}
                      selectedValues={selectedCategories}
                      onSelectionChange={(values) => {
                        setSelectedCategories(values)
                        setSelectedCategory(values.length === 1 ? values[0] : null)
                        setCurrentIndex(0)
                      }}
                      placeholder="Select categories..."
                      label={selectedStates.length > 0 ? "Categories" : t.filterByCategory}
                      icon={<Filter className="w-5 h-5 text-purple-400" />}
                      className="w-full"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Card className="w-full max-w-2xl border-2 border-gray-400/50 bg-black/60 backdrop-blur-xl shadow-lg shadow-gray-500/25">
                <CardContent className="p-8 text-center">
                  <div className="text-8xl mb-6 animate-bounce">{getEmptyStateEmoji()}</div>
                  <h2 className="text-3xl font-black text-white mb-4">No Questions Found</h2>
                  <p className="text-xl text-gray-300 mb-6">{getEmptyStateMessage()}</p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {(selectedFlagFilters.length > 0 || selectedCategories.length > 0 || selectedStates.length > 0) && (
                        <Button
                            onClick={clearAllFilters}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                        >
                          🌟 Show All Questions
                        </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        <div className="fixed inset-0 z-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }}></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s", animationDuration: "6s" }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "4s", animationDuration: "8s" }}></div>
          <div className="absolute top-20 left-20 w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
          <div className="absolute top-40 right-32 w-6 h-6 bg-pink-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 left-32 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 right-20 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 md:mb-8 gap-4">
            <Link href="/">
              <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-2 border-red-400/50 px-4 py-2 md:px-6 md:py-3 rounded-xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 transition-all transform hover:scale-110 backdrop-blur-sm font-black text-sm md:text-base touch-manipulation">
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                {t.back.toUpperCase()}
              </Button>
            </Link>

            <div className="text-center">
              <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">
              <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
                {t.practiceMode.toUpperCase()}
              </span>
              </h1>
              <div className="text-sm md:text-lg text-pink-300 font-bold">
                {selectedState
                    ? `${germanStates.find((s) => s.id === selectedState)?.name || selectedState} Questions 🏛️`
                    : `${t.practiceSubtitle} 🚀`}
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <LanguageSelector />
              <Button
                  onClick={resetProgress}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold px-4 py-2 md:px-6 md:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-0 text-sm md:text-base touch-manipulation"
              >
                <RotateCcw className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                {t.reset.toUpperCase()}
              </Button>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <Card className="border-2 border-cyan-400/50 bg-black/60 backdrop-blur-xl shadow-lg shadow-cyan-500/25">
              <CardContent className="p-4">
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-cyan-300 font-bold">Manual Mode</span>
                  <Switch
                      checked={isAutoMode}
                      onCheckedChange={setIsAutoMode}
                      className="data-[state=checked]:bg-green-500"
                  />
                  <span className="text-green-300 font-bold">Auto Mode</span>
                  {isAutoMode && (
                      <div className="flex items-center space-x-2 ml-4">
                        <span className="text-yellow-300 text-sm">Delay:</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-300 text-xs">2s</span>
                          <input
                              type="range"
                              min="2000"
                              max="5000"
                              step="500"
                              value={autoDelay}
                              onChange={(e) => setAutoDelay(Number(e.target.value))}
                              className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                              style={{
                                background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${((autoDelay - 2000) / 3000) * 100}%, #374151 ${((autoDelay - 2000) / 3000) * 100}%, #374151 100%)`,
                              }}
                          />
                          <span className="text-yellow-300 text-xs">5s</span>
                          <span className="text-yellow-300 text-sm ml-2">{autoDelay / 1000}s</span>
                        </div>
                      </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <Card className="border-2 border-cyan-400/50 bg-black/60 backdrop-blur-xl hover:bg-black/80 transition-all duration-300 group shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyan-300 text-xs md:text-sm font-bold uppercase tracking-wider">{t.progress}</p>
                    <p className="text-xl md:text-3xl font-black text-white">
                      {currentIndex + 1}/{filteredQuestions.length}
                    </p>
                  </div>
                  <div className="text-2xl md:text-4xl group-hover:scale-125 transition-transform animate-pulse">🎯</div>
                </div>
                <div className="mt-2 md:mt-4">
                  <ProgressBar current={currentIndex + 1} total={filteredQuestions.length} label="" showNumbers={false} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-400/50 bg-black/60 backdrop-blur-xl hover:bg-black/80 transition-all duration-300 group shadow-lg shadow-yellow-500/25 hover:shadow-xl hover:shadow-yellow-500/40">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-300 text-xs md:text-sm font-bold uppercase tracking-wider">{t.xp}</p>
                    <p className="text-xl md:text-3xl font-black text-yellow-400">{userProgress.xp}</p>
                  </div>
                  <div className="text-2xl md:text-4xl group-hover:scale-125 transition-transform animate-bounce">⚡</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-400/50 bg-black/60 backdrop-blur-xl hover:bg-black/80 transition-all duration-300 group shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-300 text-xs md:text-sm font-bold uppercase tracking-wider">{t.streak}</p>
                    <p className="text-xl md:text-3xl font-black text-orange-400">{userProgress.streak}</p>
                  </div>
                  <div className="text-2xl md:text-4xl group-hover:scale-125 transition-transform animate-pulse">🔥</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-400/50 bg-black/60 backdrop-blur-xl hover:bg-black/80 transition-all duration-300 group shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/40">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-300 text-xs md:text-sm font-bold uppercase tracking-wider">{t.accuracy}</p>
                    <p className="text-xl md:text-3xl font-black text-green-400">
                      {userProgress.questionsAnswered > 0
                          ? Math.round((userProgress.correctAnswers / userProgress.questionsAnswered) * 100)
                          : 0}
                      %
                    </p>
                  </div>
                  <div className="text-2xl md:text-4xl group-hover:scale-125 transition-transform animate-spin" style={{ animationDuration: "3s" }}>
                    📊
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* MultiSelect Dropdown Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            <Card className="border-2 border-pink-400/50 bg-black/60 backdrop-blur-xl shadow-lg shadow-pink-500/25">
              <CardContent className="p-4 md:p-6">
                <MultiSelect
                    options={germanStates.map(state => ({
                      id: state.id,
                      label: state.name,
                      emoji: state.emoji
                    }))}
                    selectedValues={selectedStates}
                    onSelectionChange={(values) => {
                      setSelectedStates(values)
                      setSelectedState(values.length === 1 ? values[0] : null)
                      setCurrentIndex(0)
                    }}
                    placeholder="Select German states..."
                    label={t.selectState}
                    icon={<MapPin className="w-5 h-5 text-pink-400" />}
                    className="w-full"
                />
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-400/50 bg-black/60 backdrop-blur-xl shadow-lg shadow-purple-500/25">
              <CardContent className="p-4 md:p-6">
                <MultiSelect
                    options={categories.map(category => ({
                      id: category,
                      label: category,
                      emoji: getCategoryEmoji(category)
                    }))}
                    selectedValues={selectedCategories}
                    onSelectionChange={(values) => {
                      setSelectedCategories(values)
                      setSelectedCategory(values.length === 1 ? values[0] : null)
                      setCurrentIndex(0)
                    }}
                    placeholder="Select categories..."
                    label={selectedStates.length > 0 ? "Categories" : t.filterByCategory}
                    icon={<Filter className="w-5 h-5 text-purple-400" />}
                    className="w-full"
                />
              </CardContent>
            </Card>
          </div>

          {/* Flag Filter Section - keeping as buttons */}
          <div className="flex justify-center mb-6 md:mb-8">
            <Card className="border-2 border-orange-400/50 bg-black/60 backdrop-blur-xl shadow-lg shadow-orange-500/25 w-full max-w-5xl">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="w-5 h-5 md:w-6 md:h-6 text-orange-400 animate-pulse">🚩</div>
                  <h3 className="text-lg md:text-xl font-black text-orange-300 uppercase tracking-wider">
                    Filter by Status {selectedFlagFilters.length > 0 && `(${selectedFlagFilters.length} selected)`}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedFlagFilters.length > 0 && (
                      <button
                          onClick={clearStatusFilters}
                          className="px-3 py-2 md:px-4 md:py-2 rounded-lg font-bold transition-all transform hover:scale-105 text-sm md:text-base touch-manipulation bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/50 border-2 border-gray-400"
                      >
                        🌟 Clear Status Filters ({selectedFlagFilters.length})
                      </button>
                  )}
                  {flaggedCount > 0 && (
                      <button
                          onClick={() => handleFlagFilterSelection("flagged")}
                          className={`px-3 py-2 md:px-4 md:py-2 rounded-lg font-bold transition-all transform hover:scale-105 text-sm md:text-base touch-manipulation ${
                              selectedFlagFilters.includes("flagged")
                                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/50 border-2 border-red-400"
                                  : "bg-black/50 text-red-300 hover:bg-black/80 hover:text-white border-2 border-red-400/30"
                          }`}
                      >
                        🚩 Flagged Questions ({flaggedCount})
                        {selectedFlagFilters.includes("flagged") && <span className="ml-1">✓</span>}
                      </button>
                  )}
                  {incorrectCount > 0 && (
                      <button
                          onClick={() => handleFlagFilterSelection("incorrect")}
                          className={`px-3 py-2 md:px-4 md:py-2 rounded-lg font-bold transition-all transform hover:scale-105 text-sm md:text-base touch-manipulation ${
                              selectedFlagFilters.includes("incorrect")
                                  ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/50 border-2 border-red-400"
                                  : "bg-black/50 text-red-300 hover:bg-black/80 hover:text-white border-2 border-red-400/30"
                          }`}
                      >
                        ❌ Incorrect Answers ({incorrectCount})
                        {selectedFlagFilters.includes("incorrect") && <span className="ml-1">✓</span>}
                      </button>
                  )}
                  {correctCount > 0 && (
                      <button
                          onClick={() => handleFlagFilterSelection("correct")}
                          className={`px-3 py-2 md:px-4 md:py-2 rounded-lg font-bold transition-all transform hover:scale-105 text-sm md:text-base touch-manipulation ${
                              selectedFlagFilters.includes("correct")
                                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50 border-2 border-green-400"
                                  : "bg-black/50 text-green-300 hover:bg-black/80 hover:text-white border-2 border-green-400/30"
                          }`}
                      >
                        ✅ Correct Answers ({correctCount})
                        {selectedFlagFilters.includes("correct") && <span className="ml-1">✓</span>}
                      </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center mb-8">
            <div className="w-full max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Left: Swipe Card */}
                <div className="w-full">
                  <SwipeCard
                      key={displayQuestion?.id || currentQuestion?.id}
                      question={displayQuestion || currentQuestion}
                      onSwipe={handleSwipe}
                      onAnswerSelect={handleAnswerSelect}
                      showAnswer={showAnswer}
                      onFlag={handleFlag}
                      isFlagged={displayQuestion ? userProgress.flaggedQuestions.includes(displayQuestion.id) : false}
                      isTranslated={showTranslation}
                      onTranslate={() => setShowTranslation(!showTranslation)}
                  />

                  {!isAutoMode && showAnswer && (
                      <div className="flex justify-start mt-4">
                        <Button
                            onClick={nextQuestion}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-black px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                        >
                          Next Question →
                        </Button>
                      </div>
                  )}

                  {showAnswer && lastAnswer && (
                      <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: 30 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 25 }}
                          className="mt-6"
                      >
                        <Card
                            className={`w-full border-4 shadow-2xl backdrop-blur-xl relative overflow-hidden ${
                                lastAnswer.correct
                                    ? "border-green-400 bg-gradient-to-br from-green-900/50 to-emerald-900/50 shadow-green-500/50"
                                    : "border-red-400 bg-gradient-to-br from-red-900/50 to-pink-900/50 shadow-red-500/50"
                            }`}
                        >
                          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                          <CardContent className="p-8 text-center relative z-10">
                            <div className="text-8xl mb-4 animate-bounce">{lastAnswer.correct ? "🎉" : "💪"}</div>
                            <div
                                className={`text-4xl font-black mb-4 animate-pulse ${lastAnswer.correct ? "text-green-400" : "text-red-400"}`}
                            >
                              {lastAnswer.correct ? t.crushingIt : t.keepGrinding}
                            </div>
                            <p className="text-2xl text-white font-bold">{lastAnswer.correct ? t.xpEarned : t.learnFromMistakes}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                  )}
                </div>

                {/* Right: Question Overview */}
                <div className="w-full">
                  <Card className="h-full border-2 border-yellow-400/50 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-sm">
                    <CardContent>
                      <div ref={overviewRef} className="hidden lg:grid grid-cols-[repeat(15,minmax(0,1fr))] gap-0.5 mb-0">
                        {filteredQuestions.map((q, index) => {
                          const qId = q?.id
                          const isAnswered = qId ? userProgress.completedQuestions.includes(qId) : false
                          const isIncorrect = qId ? (userProgress.incorrectAnswers || []).includes(qId) : false
                          const isCurrent = index === currentIndex
                          const isFlagged = qId ? userProgress.flaggedQuestions.includes(qId) : false
                          const originalQuestionNumber = questionsToUse.findIndex(originalQ => originalQ.id === qId) + 1

                          return (
                              <button
                                  key={qId ?? index}
                                  data-index={index}
                                  aria-current={isCurrent ? "true" : undefined}
                                  aria-label={`Question ${originalQuestionNumber}${isFlagged ? ", flagged" : ""}${isAnswered ? ", answered" : ""}${isIncorrect ? ", incorrect" : ""}`}
                                  onClick={() => handleQuestionJump(index)}
                                  className={`relative aspect-square rounded-lg font-bold text-sm transition-all transform hover:scale-110 border-4 ${
                                      isCurrent
                                          ? "bg-cyan-400 text-black border-cyan-300 shadow-lg shadow-cyan-500/50"
                                          : isIncorrect
                                              ? "bg-red-500 text-white border-red-400 hover:bg-red-600"
                                              : isAnswered
                                                  ? "bg-green-500 text-white border-green-400 hover:bg-green-600"
                                                  : "bg-gray-600 text-gray-300 border-gray-500 hover:bg-gray-500"
                                  }`}
                              >
                                {selectedState && (
                                    <span className="absolute -top-1 -left-1 text-xs">{stateEmoji}</span>
                                )}
                                {originalQuestionNumber}
                                {isFlagged && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                                )}
                              </button>
                          )
                        })}
                      </div>

                      {/* Mobile: compact pagination-style navigation */}
                      <div className="flex items-center justify-center space-x-0.5 mb-4 lg:hidden">
                        <button
                            aria-label="Previous"
                            onClick={() => currentIndex > 0 && handleQuestionJump(currentIndex - 1)}
                            className="w-10 h-10 rounded-lg bg-gray-700 text-white font-bold flex items-center justify-center border-2 border-gray-600"
                        >
                          ‹
                        </button>

                        {(() => {
                          const pages = getPaginationNumbers(currentIndex + 1, pageCount)

                          return pages.map((p, i) => {
                            if (p === '...') {
                              // compute median target between surrounding numeric pages
                              let left: number | null = null
                              for (let j = i - 1; j >= 0; j--) {
                                if (typeof pages[j] === 'number') {
                                  left = pages[j] as number
                                  break
                                }
                              }
                              let right: number | null = null
                              for (let j = i + 1; j < pages.length; j++) {
                                if (typeof pages[j] === 'number') {
                                  right = pages[j] as number
                                  break
                                }
                              }

                              const target = left && right ? Math.floor((left + right) / 2) : left || right || 1
                              const targetIdx = Math.max(0, Number(target) - 1)

                              return (
                                  <button
                                      key={`dots-${i}`}
                                      onClick={() => handleQuestionJump(targetIdx)}
                                      aria-label={`Jump near ${target}`}
                                      className="px-2 h-10 flex items-center justify-center rounded-lg bg-white text-black border-2 border-gray-200"
                                  >
                                    …
                                  </button>
                              )
                            }

                            const pageNum = Number(p)
                            const idx = pageNum - 1
                            const q = filteredQuestions[idx]
                            const qId = q?.id
                            const isAnswered = qId ? userProgress.completedQuestions.includes(qId) : false
                            const isIncorrect = qId ? (userProgress.incorrectAnswers || []).includes(qId) : false
                            const isCurrent = idx === currentIndex
                            const isFlagged = qId ? userProgress.flaggedQuestions.includes(qId) : false

                            // Find the original question number from the full question set
                            const originalQuestionNumber = questionsToUse.findIndex(originalQ => originalQ.id === qId) + 1

                            return (
                                <button
                                    key={`p-${pageNum}-${i}`}
                                    onClick={() => handleQuestionJump(idx)}
                                    aria-current={isCurrent ? 'true' : undefined}
                                    aria-label={`Go to question ${originalQuestionNumber}`}
                                    className={`relative w-10 h-10 rounded-lg font-bold flex items-center justify-center transition-all border-1 ${
                                        isCurrent
                                            ? 'bg-black text-white border-black shadow-lg'
                                            : isIncorrect
                                                ? 'bg-red-500 text-white border-red-400 shadow-sm'
                                                : isAnswered
                                                    ? 'bg-green-500 text-white border-green-400 shadow-sm'
                                                    : 'bg-white text-black border-gray-200 shadow-sm hover:scale-105'
                                    }`}
                                >
                                  {selectedState && (
                                      <span className="absolute -top-2 text-xs leading-none pointer-events-none">{stateEmoji}</span>
                                  )}
                                  <span className="text-sm z-10">{originalQuestionNumber}</span>
                                  {isFlagged && (
                                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                                  )}
                                </button>
                            )
                          })
                        })()}

                        <button
                            aria-label="Next"
                            onClick={() => currentIndex < pageCount - 1 && handleQuestionJump(currentIndex + 1)}
                            className="w-10 h-10 rounded-lg bg-gray-700 text-white font-bold flex items-center justify-center border-2 border-gray-600"
                        >
                          ›
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          {userProgress.badges.length > 0 && (
              <div className="flex justify-center mb-8">
                <Card className="w-full max-w-md border-2 border-yellow-400/50 bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-xl shadow-lg shadow-yellow-500/25">
                  <CardHeader>
                    <CardTitle className="text-center text-yellow-400 font-black text-2xl animate-pulse">
                      {t.achievements}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center space-x-4">
                      {userProgress.badges.slice(-3).map((badge, index) => (
                          <div
                              key={badge}
                              className="hover:scale-125 transition-transform cursor-pointer animate-bounce"
                              style={{ animationDelay: `${index * 0.2}s` }}
                          >
                            <Badge type={badge} earned size="sm" />
                          </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
          )}

          <div className="text-center mt-12 space-y-6">
            <div className="text-3xl font-black animate-pulse">
              <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
                {t.howToPractice.toUpperCase()}
              </span>
            </div>
            <div className="space-y-3 text-lg max-w-2xl mx-auto">
              <p className="text-cyan-300 font-bold">💡 {t.swipeInstructions}</p>
              <div className="flex justify-center space-x-8 text-sm md:text-base">
                <div className="text-green-400 font-bold">← {t.swipeLeft}</div>
                <div className="text-red-400 font-bold">{t.swipeRight} →</div>
              </div>
              <p className="text-green-300 font-bold">⌨️ {t.keyboardShortcuts}</p>
              <p className="text-yellow-300 font-bold">🔄 Toggle between Auto and Manual mode above</p>
              <p className="text-pink-300 font-bold">🏛️ Select a state to practice state-specific questions</p>
              <div>
                <p className="text-sm text-gray-300 font-semibold">
                  Press <span className="font-black">1 / 2 / 3 / 4</span> — the matching option <span className="font-black">A / B / C / D</span> will be selected and will trigger the same behavior as clicking the option.
                </p>
              </div>
            </div>
            <div className="text-2xl font-black text-white animate-bounce mt-8">{t.letsDominate} 🚀</div>
          </div>
        </div>

        {/* Reset Confirmation Dialog */}
        <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <DialogContent className="bg-gradient-to-br from-red-900/95 to-pink-900/95 border-2 border-red-400/50 text-white backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl font-black text-red-300">
                <AlertTriangle className="w-8 h-8 text-yellow-400 animate-pulse" />
                Reset All Progress?
              </DialogTitle>
              <DialogDescription className="text-gray-200 text-lg mt-4">
                This will permanently delete:
                <ul className="list-disc list-inside mt-3 space-y-2 text-left">
                  <li>All your XP and achievements</li>
                  <li>Your current streak and max streak</li>
                  <li>All badges earned</li>
                  <li>Flagged questions</li>
                  <li>All answered questions history</li>
                </ul>
                <p className="mt-4 font-bold text-yellow-300">⚠️ This action cannot be undone!</p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-3 sm:gap-2 mt-6">
              <Button
                onClick={() => setShowResetDialog(false)}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmReset}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Yes, Reset Everything
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}
