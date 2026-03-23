"use client"

import { useEffect, useState, useRef } from "react"
import { useStore } from "@/lib/store"
import { useTheme, getTheme } from "@/lib/theme"
import SwipeCard from "@/components/SwipeCard"
import ProgressBar from "@/components/ProgressBar"
import Badge from "@/components/Badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, RotateCcw, Filter, MapPin, AlertTriangle, ChevronDown } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { getTranslation } from "@/lib/i18n"
import LanguageSelector from "@/components/LanguageSelector"
import ThemeToggle from "@/components/ThemeToggle"
import { getCategoryEmoji } from "@/lib/category-emojis"
import { MultiSelect } from "@/components/MultiSelect"
import StickyMobileHeader from "@/components/StickyMobileHeader"
import DesktopHeader from "@/components/DesktopHeader"

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
    answerQuestionWithCategory,
    flagQuestion,
    unflagQuestion,
    addXP,
    updateStreak,
    addBadge,
    language,
    loadQuestions,
  } = useStore()

  const { isDark } = useTheme()
  const theme = getTheme(isDark)

  const [showAnswer, setShowAnswer] = useState(false)
  const [lastAnswer, setLastAnswer] = useState<{
    correct: boolean
    selectedIndex: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [showTranslation, setShowTranslation] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const overviewRef = useRef<HTMLDivElement | null>(null)

  // Multi-select filter states
  const [selectedFlagFilters, setSelectedFlagFilters] = useState<string[]>([])
  const [selectedStates, setSelectedStates] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  // Reset confirmation dialog
  const [showResetDialog, setShowResetDialog] = useState(false)
  // Store current question to prevent UI update during transition
  const [displayQuestion, setDisplayQuestion] = useState<any>(null)

  // emoji for the currently selected state (used in compact pagination)
  const stateEmoji = selectedState ? germanStates.find((s) => s.id === selectedState)?.emoji : undefined

  const t = getTranslation(language)

  // Use ref to track if we've already attempted to load questions (prevent infinite loops)
  const initRef = useRef(false)

  useEffect(() => {
    const initializePractice = async () => {
      if (initRef.current) return
      initRef.current = true

      setLoading(true)

      try {
        // Only load if questions are empty
        if (questions.length === 0) {
          console.log("📥 Starting question load...")
          await loadQuestions()
          console.log("✅ Question load completed")
        }

        // Load state questions if a state is selected
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
  }, [])

  // Get the appropriate questions based on state selection
  const getQuestionsToUse = () => {
    if (selectedStates.length > 0) {
      // Use state-specific questions if available
      return stateQuestions.length > 0 ? stateQuestions : questions
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

  // Add bounds checking to prevent index out of bounds errors
  const currentQuestion = filteredQuestions[currentIndex] || null

  // Auto-correct currentIndex if it's out of bounds
  useEffect(() => {
    if (filteredQuestions.length > 0 && currentIndex >= filteredQuestions.length) {
      setCurrentIndex(0)
    }
  }, [filteredQuestions.length, currentIndex])

  // Calculate progress for filtered questions only
  const answeredInFilter = filteredQuestions.filter((q) =>
    userProgress.completedQuestions.includes(q.id)
  ).length

  // Calculate filtered stats
  const correctInFilter = filteredQuestions.filter((q) =>
    userProgress.completedQuestions.includes(q.id) &&
    !(userProgress.incorrectAnswers || []).includes(q.id)
  ).length

  const accuracyInFilter = answeredInFilter > 0
    ? Math.round((correctInFilter / answeredInFilter) * 100)
    : 0

  const xpInFilter = correctInFilter * 10

  // Load state questions when state is selected
  useEffect(() => {
    const loadStateQuestionsForFilter = async () => {
      if (selectedStates.length > 0) {
        try {
          const stateResponse = await fetch("/data/state-questions.json")
          if (stateResponse.ok) {
            const stateData = await stateResponse.json()
            // If multiple states selected, combine them; if one, use that one
            if (selectedStates.length === 1) {
              setStateQuestions(stateData[selectedStates[0]] || [])
            } else {
              // Combine questions from multiple states
              const combined: any[] = []
              selectedStates.forEach(stateId => {
                if (stateData[stateId]) {
                  combined.push(...stateData[stateId])
                }
              })
              setStateQuestions(combined)
            }
          } else {
            // Clear stale data if fetch fails
            setStateQuestions([])
          }
        } catch (error) {
          console.error("Failed to load state questions:", error)
          setStateQuestions([])
        }
      } else {
        setStateQuestions([])
      }
      setSelectedCategory(null)
      setCurrentIndex(0)
    }

    loadStateQuestionsForFilter()
  }, [selectedStates, setSelectedCategory, setStateQuestions])

  useEffect(() => {
    if (!overviewRef.current) return
    const el = overviewRef.current.querySelector(`[data-index="${currentIndex}"]`) as HTMLElement | null
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [currentIndex])

  const handleFlag = () => {
    if (!currentQuestion) return
    if (userProgress.flaggedQuestions.includes(currentQuestion.id)) {
      unflagQuestion(currentQuestion.id)
    } else {
      flagQuestion(currentQuestion.id)
    }
  }

  const nextQuestion = () => {
    setShowAnswer(false)
    setLastAnswer(null)
    setShowTranslation(false)

    // Add safety check for empty filter
    if (filteredQuestions.length === 0) {
      setCurrentIndex(0)
      return
    }

    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(0)
    }
  }

  const previousQuestion = () => {
    setShowAnswer(false)
    setLastAnswer(null)
    setShowTranslation(false)

    // Add safety check for empty filter
    if (filteredQuestions.length === 0) {
      setCurrentIndex(0)
      return
    }

    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else {
      // Wrap to last question if at beginning
      setCurrentIndex(filteredQuestions.length - 1)
    }
  }

  const handleQuestionJump = (index: number) => {
    // Add bounds checking for question jump - prevent accessing empty arrays
    if (filteredQuestions.length === 0) {
      setCurrentIndex(0)
      return
    }
    const safeIndex = Math.max(0, Math.min(index, filteredQuestions.length - 1))
    setCurrentIndex(safeIndex)
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
    if (showAnswer || !currentQuestion || currentQuestion.answerIndex === undefined) return

    const isCorrect = selectedAnswerIndex === currentQuestion.answerIndex

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

    // Use new function that tracks category stats
    answerQuestionWithCategory(currentQuestion.id, selectedAnswerIndex, isCorrect, currentQuestion.category)

    if (isCorrect) {
      addXP(10)
      const newStreak = updateStreak(true)

      if (newStreak === 5) addBadge("streak-5")
      if (newStreak === 10) addBadge("streak-10")

      const newXP = userProgress.xp + 10
      if (newXP >= 100 && !userProgress.badges.includes("xp-100")) addBadge("xp-100")
      if (newXP >= 500 && !userProgress.badges.includes("xp-500")) addBadge("xp-500")
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
        setShowAnswer(false)

        // After state updates, check bounds and adjust index if needed
        // Use a second timeout to ensure state updates have processed
        setTimeout(() => {
          if (currentFilterLength <= 1) {
            // If this was the last question in filter, reset to 0
            setCurrentIndex(0)
          } else if (currentIndex >= currentFilterLength - 1) {
            // If we were at the last question, go to start
            setCurrentIndex(0)
          }
          // Otherwise, stay at same index (which will now show the next question)
        }, 0)
      }, 2000)
    }
  }

  const resetProgress = () => {
    setCurrentIndex(0)
    setShowAnswer(false)
    setLastAnswer(null)
    setShowTranslation(false)
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
        <div className={`min-h-screen flex items-center justify-center ${theme.bg} ${theme.text}`}>
          <Card className={`w-full max-w-md ${isDark ? 'bg-white/5 backdrop-blur-sm' : 'bg-gray-50'}`}>
            <CardContent className="p-8 text-center">
              <div className={`animate-spin rounded-full h-16 w-16 border-2 mx-auto mb-8 ${isDark ? 'border-white border-t-transparent' : 'border-gray-700 border-t-transparent'}`}></div>
              <p className={`text-xl font-semibold ${theme.text}`}>{t.loadingQuestions}</p>
              <p className={`text-base mt-4 ${theme.textSecondary}`}>{t.getReady}</p>
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
      return ""
    }

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text}`}>
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 md:mb-8 gap-4">
              <Link href="/">
                <Button className="border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white px-4 py-2 md:px-6 md:py-3 rounded transition-all font-semibold text-sm md:text-base">
                  <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                  {t.back}
                </Button>
              </Link>

              <div className="text-center">
                <h1 className={`text-2xl md:text-4xl font-semibold mb-1 md:mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t.practiceMode}
                </h1>
                <div className={`text-sm md:text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {selectedState
                      ? `${germanStates.find((s) => s.id === selectedState)?.name || selectedState} Questions`
                      : t.practiceSubtitle}
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-4">
                <ThemeToggle />
                <LanguageSelector />
                <Button
                    onClick={resetProgress}
                    className="border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white px-4 py-2 md:px-6 md:py-3 rounded transition-all font-semibold text-sm md:text-base"
                >
                  <RotateCcw className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                  {t.reset}
                </Button>
              </div>
            </div>

            {/* MultiSelect Dropdown Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              <Card className={`${isDark ? 'bg-white/5 backdrop-blur-sm' : 'bg-gray-50'}`}>
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
                      icon={<MapPin className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />}
                      className="w-full"
                  />
                </CardContent>
              </Card>

              <Card className={`${isDark ? 'bg-white/5 backdrop-blur-sm' : 'bg-gray-50'}`}>
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
                      icon={<Filter className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />}
                      className="w-full"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Card className={`w-full max-w-2xl ${isDark ? 'border border-gray-700 bg-white/5 backdrop-blur-sm' : 'border border-gray-200 bg-gray-50'}`}>
                <CardContent className="p-8 text-center">
                  <h2 className={`text-2xl font-semibold mb-4 ${theme.text}`}>No Questions Found</h2>
                  <p className={`text-lg mb-6 ${theme.textSecondary}`}>{getEmptyStateMessage()}</p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {(selectedFlagFilters.length > 0 || selectedCategories.length > 0 || selectedStates.length > 0) && (
                        <Button
                            onClick={clearAllFilters}
                            className={`border font-semibold px-6 py-3 rounded-xl transition-all ${isDark ? 'border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300' : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700'}`}
                        >
                          Show All Questions
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
      <div className={`min-h-screen overflow-hidden relative ${theme.bg} ${theme.text}`}>
        <StickyMobileHeader
          title={t.practiceMode.toUpperCase()}
          subtitle={`Q ${currentIndex + 1}/${filteredQuestions.length}`}
          showBackButton={true}
          backHref="/"
        />
        <div className="fixed inset-0 z-0">
        </div>


        <div className="relative z-10 container mx-auto px-4 py-8 sm:py-8">
          <div className="hidden sm:flex flex-col md:flex-row items-center justify-between mb-6 md:mb-8 gap-4">
            <Link href="/">
              <Button className={`border transition-all font-semibold text-sm md:text-base px-4 py-2 md:px-6 md:py-3 ${isDark ? 'border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300' : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700'}` }>
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                {t.back.toUpperCase()}
              </Button>
            </Link>

            <div className="text-center">
              <h1 className={`text-2xl md:text-4xl font-bold mb-1 md:mb-2 ${theme.text}`}>
              <span>
                {t.practiceMode.toUpperCase()}
              </span>
              </h1>
              <div className={`text-sm md:text-lg font-semibold ${theme.textSecondary}`}>
                {selectedStates.length === 1 && selectedState
                    ? `${germanStates.find((s) => s.id === selectedState)?.name || selectedState} Questions 🏛️`
                    : `${t.practiceSubtitle} 🚀`}
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <ThemeToggle />
              <LanguageSelector />
              <Button
                  onClick={resetProgress}
                  className="border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 font-semibold px-4 py-2 md:px-6 md:py-3 transition-all text-sm md:text-base"
              >
                <RotateCcw className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                {t.reset.toUpperCase()}
              </Button>
            </div>
          </div>


          {/* Stats Cards - Hidden on mobile, shown on md+ screens */}
          <div className="hidden md:grid md:grid-cols-4 gap-4 mb-8">
            <Card className={`border transition-all duration-300 group hover:bg-white/10 ${isDark ? 'border-gray-700 bg-white/5' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t.progress}</p>
                    <p className={`text-3xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {answeredInFilter}/{filteredQuestions.length}
                    </p>
                  </div>
                  <div className="text-4xl group-hover:scale-125 transition-transform animate-pulse">🎯</div>
                </div>
                <div className="mt-4">
                  <ProgressBar current={answeredInFilter} total={filteredQuestions.length} label="" showNumbers={false} />
                </div>
              </CardContent>
            </Card>

            <Card className={`border transition-all duration-300 group hover:bg-white/10 ${isDark ? 'border-gray-700 bg-white/5' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t.xp}</p>
                    <p className={`text-3xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{xpInFilter}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`border transition-all duration-300 group hover:bg-white/10 ${isDark ? 'border-gray-700 bg-white/5' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t.streak}</p>
                    <p className={`text-3xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{correctInFilter}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`border transition-all duration-300 group hover:bg-white/10 ${isDark ? 'border-gray-700 bg-white/5' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-green-300' : 'text-green-700'}`}>{t.accuracy}</p>
                    <p className={`text-3xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {accuracyInFilter}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters Toggle Button */}
          <div className="mb-4">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className={`w-full sm:w-auto border bg-transparent font-semibold px-4 py-2 transition-colors flex items-center gap-2 ${isDark ? 'border-gray-700 hover:bg-gray-900/20 text-gray-300 hover:text-white' : 'border-gray-300 hover:bg-gray-100 text-gray-700 hover:text-gray-900'}`}
            >
              <Filter className="w-4 h-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </Button>
            {(selectedStates.length > 0 || selectedCategories.length > 0) && (
              <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {selectedStates.length > 0 && `${selectedStates.length} state${selectedStates.length > 1 ? 's' : ''}`}
                {selectedStates.length > 0 && selectedCategories.length > 0 && " • "}
                {selectedCategories.length > 0 && `${selectedCategories.length} categor${selectedCategories.length > 1 ? 'ies' : 'y'}`}
              </p>
            )}
          </div>

          {/* MultiSelect Dropdown Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              <Card className="bg-white/5">
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
                      icon={<MapPin className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />}
                      className="w-full"
                  />
                </CardContent>
              </Card>

              <Card className="bg-white/5">
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
                      icon={<Filter className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />}
                      className="w-full"
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Flag Filter Section - keeping as buttons */}
          <div className="flex justify-center mb-6 md:mb-8">
            <Card className={`border w-full max-w-5xl ${isDark ? 'border-gray-700 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className={`w-5 h-5 md:w-6 md:h-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}></div>
                  <h3 className={`text-lg md:text-xl font-semibold uppercase tracking-wider ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Filter by Status {selectedFlagFilters.length > 0 && `(${selectedFlagFilters.length} selected)`}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedFlagFilters.length > 0 && (
                      <button
                          onClick={clearAllFilters}
                          className={`px-3 py-2 md:px-4 md:py-2 rounded-lg font-semibold transition-all text-sm md:text-base bg-transparent ${isDark ? 'text-gray-300 hover:bg-gray-900/20' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        🌟 Clear Status Filters ({selectedFlagFilters.length})
                      </button>
                  )}
                  {flaggedCount > 0 && (
                      <button
                          onClick={() => handleFlagFilterSelection("flagged")}
                          className={`px-3 py-2 md:px-4 md:py-2 rounded font-semibold transition-all text-sm md:text-base border ${
                              selectedFlagFilters.includes("flagged")
                                  ? isDark ? "bg-red-500/20 border-red-500/50 text-red-300" : "bg-red-100 border-red-400 text-red-800"
                                  : isDark ? "border-gray-700 text-gray-300 hover:bg-gray-900/20" : "border-gray-300 text-gray-700 hover:bg-gray-100"
                          }`}
                      >
                        Flagged ({flaggedCount})
                        {selectedFlagFilters.includes("flagged") && <span className="ml-1">✓</span>}
                      </button>
                  )}
                  {incorrectCount > 0 && (
                      <button
                          onClick={() => handleFlagFilterSelection("incorrect")}
                          className={`px-3 py-2 md:px-4 md:py-2 rounded font-semibold transition-all text-sm md:text-base border ${
                              selectedFlagFilters.includes("incorrect")
                                  ? isDark ? "bg-red-500/20 border-red-500/50 text-red-300" : "bg-red-100 border-red-400 text-red-800"
                                  : isDark ? "border-gray-700 text-gray-300 hover:bg-gray-900/20" : "border-gray-300 text-gray-700 hover:bg-gray-100"
                          }`}
                      >
                        Incorrect ({incorrectCount})
                        {selectedFlagFilters.includes("incorrect") && <span className="ml-1">✓</span>}
                      </button>
                  )}
                  {correctCount > 0 && (
                      <button
                          onClick={() => handleFlagFilterSelection("correct")}
                          className={`px-3 py-2 md:px-4 md:py-2 rounded font-semibold transition-all text-sm md:text-base border ${
                              selectedFlagFilters.includes("correct")
                                  ? isDark ? "bg-green-500/20 border-green-500/50 text-green-300" : "bg-green-100 border-green-400 text-green-800"
                                  : isDark ? "border-gray-700 text-gray-300 hover:bg-gray-900/20" : "border-gray-300 text-gray-700 hover:bg-gray-100"
                          }`}
                      >
                        Correct ({correctCount})
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
                  {currentQuestion ? (
                    <SwipeCard
                        question={currentQuestion}
                        onSwipe={handleSwipe}
                        onAnswerSelect={handleAnswerSelect}
                        showAnswer={showAnswer}
                        onFlag={handleFlag}
                        isFlagged={userProgress.flaggedQuestions.includes(currentQuestion.id)}
                        externalSelectedAnswer={lastAnswer?.selectedIndex ?? null}
                        isTranslated={showTranslation}
                        onTranslate={() => setShowTranslation(!showTranslation)}
                        totalQuestions={filteredQuestions.length}
                        onJumpToQuestion={(index) => handleQuestionJump(index)}
                    />
                  ) : null}

                  {showAnswer && (
                      <div className="flex justify-start mt-4">
                        <Button
                            onClick={nextQuestion}
                            className="border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 font-semibold px-6 py-3 rounded-xl transition-all"
                        >
                          Next Question →
                        </Button>
                      </div>
                  )}

                </div>

                {/* Right: Question Overview */}
                <div className="w-full">
                  <Card className={`h-full !bg-transparent !shadow-none`}>
                    <CardContent>
                      <div ref={overviewRef} className="hidden lg:grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1 mb-0">
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
                                  className={`relative aspect-square rounded-lg font-semibold text-sm transition-all border ${
                                      isCurrent
                                          ? isDark ? "bg-white text-black border-white shadow-lg shadow-white/50" : "bg-blue-500 text-white border-blue-600 shadow-lg shadow-blue-400/50"
                                          : isIncorrect
                                              ? "bg-red-500 text-white border-red-400 hover:opacity-80"
                                              : isAnswered
                                                  ? "bg-green-500 text-white border-green-400 hover:opacity-80"
                                                  : isDark ? "border-gray-600 bg-transparent text-gray-300" : "border-gray-400 bg-transparent text-gray-600"
                                  }`}
                              >
                                {originalQuestionNumber}
                                {isFlagged && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                                )}
                              </button>
                          )
                        })}
                      </div>

                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* Sticky Bottom Navigation - Median Navigation on Mobile Only */}
        <div className={`fixed bottom-0 left-0 right-0 z-40 border-t md:hidden ${isDark ? 'bg-black/80 border-gray-800 backdrop-blur-sm' : 'bg-white/80 border-gray-200 backdrop-blur-sm'}`}>
          <div className="flex items-center justify-between gap-1 px-2 py-2 sm:gap-2 sm:px-3 sm:py-3 overflow-x-auto">
            <button
                aria-label="Previous"
                onClick={() => currentIndex > 0 && handleQuestionJump(currentIndex - 1)}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-600 text-white font-bold text-base sm:text-lg flex items-center justify-center border border-blue-500 hover:bg-blue-700 transition-colors flex-shrink-0 shadow-lg"
            >
              ‹
            </button>

            <div className="flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto">
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
                          className="px-1 sm:px-2 h-9 flex items-center justify-center rounded-lg bg-white text-black border border-gray-300 hover:opacity-80 transition-all flex-shrink-0 text-xs"
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
                        className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg font-semibold flex items-center justify-center transition-all border flex-shrink-0 text-xs ${
                            isCurrent
                                ? 'bg-white text-black border-white'
                                : isIncorrect
                                    ? 'bg-red-500 text-white border-red-400'
                                    : isAnswered
                                        ? 'bg-green-500 text-white border-green-400'
                                        : 'border-gray-600 bg-transparent text-gray-300 hover:bg-gray-900/20'
                        }`}
                    >
                      <span className="z-10">{originalQuestionNumber}</span>
                      {isFlagged && (
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                      )}
                    </button>
                )
              })
            })()}
            </div>

            <button
                aria-label="Next"
                onClick={() => currentIndex < pageCount - 1 && handleQuestionJump(currentIndex + 1)}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-600 text-white font-bold text-base sm:text-lg flex items-center justify-center border border-blue-500 hover:bg-blue-700 transition-colors flex-shrink-0 shadow-lg"
            >
              ›
            </button>
          </div>
        </div>

        {/* Add padding to account for sticky bottom nav */}
        <div className="md:hidden h-20"></div>
      </div>
  )
}
