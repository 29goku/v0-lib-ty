"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { useTheme, getTheme } from "@/lib/theme"
import ThemeToggle from "@/components/ThemeToggle"
import LanguageSelector from "@/components/LanguageSelector"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Clock } from "lucide-react"
import SwipeCard from "@/components/SwipeCard"
import Link from "next/link"
import { getCategoryEmoji } from "@/lib/category-emojis"
import StickyMobileHeader from "@/components/StickyMobileHeader"

export default function TestPage() {
  const {
    questions,
    testQuestions,
    setTestQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    userProgress,
    answerQuestion,
    answerQuestionWithCategory,
    flagQuestion,
    unflagQuestion,
    testMode,
    testStartTime,
    testAnswers,
    startTest,
    endTest,
    recordTestAttempt,
    loadQuestions,
    updateStreak,
    addXP,
    addBadge,
  } = useStore()

  const { isDark } = useTheme()
  const theme = getTheme(isDark)
  const router = useRouter()

  // Start test with selected number of questions
  const handleStartTest = () => {
    // Shuffle and select questions from main questions pool (never modify main pool)
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    const selectedQuestions = shuffled.slice(0, selectedQuestionCount[0])
    setTestQuestions(selectedQuestions)
    setShowConfig(false)
    startTest()
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setIsTranslated(false)
    setTimeRemaining(60 * 60)
  }

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(60 * 60) // 60 minutes in seconds
  const [showResults, setShowResults] = useState(false)
  const [isTranslated, setIsTranslated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showConfig, setShowConfig] = useState(true)
  const [selectedQuestionCount, setSelectedQuestionCount] = useState([33])

  useEffect(() => {
    const initializeTest = async () => {
      try {
        await loadQuestions()
      } catch (error) {
        console.error("Failed to load questions:", error)
      } finally {
        setIsLoading(false)
      }
    }
    initializeTest()
  }, [loadQuestions])

  useEffect(() => {
    if (!testMode || showResults || showConfig) return
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Timer expired - submit test
          const timeSpent = testStartTime ? Date.now() - testStartTime : 0
          const correctCount = testAnswers.filter((a) => a.correct).length
          recordTestAttempt(correctCount, testQuestions.length, timeSpent)
          endTest()
          setShowResults(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [testMode, showResults, showConfig])

  // Cleanup test state when navigating away
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (testMode && !showResults) {
        endTest()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      if (testMode && !showResults && !showConfig) {
        endTest()
      }
    }
  }, [testMode, showResults, showConfig, endTest])

  const currentQuestion = testQuestions[currentQuestionIndex]
  const currentAnswer = testAnswers.find((a) => a.questionId === currentQuestion?.id)

  const handleAnswerSelect = (answerIndex: number) => {
    if (!currentQuestion) return

    setSelectedAnswer(answerIndex)
    const isCorrect = answerIndex === currentQuestion.answerIndex
    answerQuestionWithCategory(currentQuestion.id, answerIndex, isCorrect, currentQuestion.category)

    // Award XP and update streak in test mode (same as practice)
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
  }

  const handleNext = () => {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      const nextQuestion = testQuestions[currentQuestionIndex + 1]
      const existingAnswer = testAnswers.find((a) => a.questionId === nextQuestion?.id)
      setSelectedAnswer(existingAnswer?.selectedIndex ?? null)
      setIsTranslated(false)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      const prevQuestion = testQuestions[currentQuestionIndex - 1]
      const existingAnswer = testAnswers.find((a) => a.questionId === prevQuestion?.id)
      setSelectedAnswer(existingAnswer?.selectedIndex ?? null)
      setIsTranslated(false)
    }
  }

  const handleQuestionJump = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex)
    const targetQuestion = testQuestions[questionIndex]
    const existingAnswer = testAnswers.find((a) => a.questionId === targetQuestion?.id)
    setSelectedAnswer(existingAnswer?.selectedIndex ?? null)
    setIsTranslated(false)
  }

  const handleSubmitTest = () => {
    const timeSpent = testStartTime ? Date.now() - testStartTime : 0
    const correctCount = testAnswers.filter((a) => a.correct).length
    // Use testQuestions.length for accurate total (not testAnswers which may be incomplete)
    recordTestAttempt(correctCount, testQuestions.length, timeSpent)
    endTest()
    setShowResults(true)
  }

  const handleReadAloud = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "de-DE"
      speechSynthesis.speak(utterance)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const correctAnswers = testAnswers.filter((a) => a.correct).length
  const totalAnswered = testAnswers.length
  const scorePercentage = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0
  const requiredToPass = Math.ceil(selectedQuestionCount[0] * 0.5) // 50% to pass
  const passed = correctAnswers >= requiredToPass

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.bg}`}>
        <div className="text-center">
          <h2 className={`text-4xl font-semibold mb-4 ${theme.text}`}>Test Mode</h2>
          <div className={`w-64 h-1 mx-auto ${isDark ? 'bg-gray-800' : 'bg-gray-300'}`}>
            <div className="h-full animate-pulse" style={{ background: isDark ? 'white' : '#000' }}></div>
          </div>
          <div className={`mt-6 text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Loading your official simulation...</div>
        </div>
      </div>
    )
  }

  if (showConfig) {
    const timePerQuestion = Math.round(3600 / selectedQuestionCount[0]);
    const requiredCorrect = Math.ceil(selectedQuestionCount[0] * 0.5);

    return (
      <div className={`min-h-screen relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-black via-gray-950 to-black text-white' : 'bg-white text-gray-900'}`}>
        {/* Animated background gradient */}
        {isDark && (
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
          </div>
        )}

        <div className="relative z-10 container mx-auto px-4 py-5 md:py-6">
          <div className="hidden sm:flex items-center justify-between mb-5 md:mb-6">
            <Link href="/">
              <Button className={`border px-3 py-1.5 text-sm rounded transition-colors font-semibold ${isDark ? 'border-gray-700 bg-transparent hover:bg-gray-900 text-gray-300 hover:text-white' : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900'}`}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>⚡ Test</h1>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>
          <h1 className={`sm:hidden text-2xl font-bold mb-5 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>⚡ Test</h1>

          <div className="max-w-2xl mx-auto">
            {/* Main Configuration Card */}
            <div className={`border rounded-lg p-4 md:p-5 mb-4 md:mb-5 backdrop-blur-md ${isDark ? 'bg-gradient-to-br from-gray-900/50 to-black border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <h2 className={`text-base md:text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Customize Your Test</h2>
              <p className={`mb-3 md:mb-4 text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Choose question count</p>

              {/* Quick Preset Buttons */}
              <div className="mb-3 md:mb-4">
                <p className={`text-xs font-semibold mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Quick Presets:</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Short", value: 10, emoji: "⚡" },
                    { label: "Standard", value: 33, emoji: "🎯" },
                    { label: "Full", value: 60, emoji: "💪" }
                  ].map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setSelectedQuestionCount([preset.value])}
                      className={`p-2 md:p-2.5 rounded border font-semibold transition-all text-xs ${
                        selectedQuestionCount[0] === preset.value
                          ? isDark ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-blue-600 bg-blue-50 text-blue-700"
                          : isDark ? "border-gray-700 bg-gray-900/30 text-gray-300 hover:border-gray-600" : "border-gray-300 bg-gray-100 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <div className="text-sm mb-0.5">{preset.emoji}</div>
                      <div className="text-xs">{preset.label}</div>
                      <div className="text-xs font-bold">{preset.value}Q</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Slider */}
              <div className="mb-3 md:mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className={`text-xs md:text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Custom: {selectedQuestionCount[0]} Q</label>
                  <span className={`text-sm md:text-base font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{selectedQuestionCount[0]}</span>
                </div>
                <Slider
                  value={selectedQuestionCount}
                  onValueChange={setSelectedQuestionCount}
                  max={questions.length}
                  min={10}
                  step={5}
                  className="w-full"
                />
                <div className={`flex justify-between text-xs mt-1.5 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                  <span>10</span>
                  <span>{Math.round(questions.length / 2)}</span>
                  <span>{questions.length}</span>
                </div>
              </div>
            </div>

            {/* Test Info Grid */}
            <div className="grid grid-cols-4 gap-1.5 md:gap-2 mb-4 md:mb-5">
              <div className={`border rounded-lg p-2 md:p-2.5 backdrop-blur-md ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>
                <div className={`text-xs font-semibold mb-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Q</div>
                <div className={`text-sm md:text-base font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{selectedQuestionCount[0]}</div>
              </div>

              <div className={`border rounded-lg p-2 md:p-2.5 backdrop-blur-md ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>
                <div className={`text-xs font-semibold mb-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Time</div>
                <div className={`text-sm md:text-base font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>60m</div>
              </div>

              <div className={`border rounded-lg p-2 md:p-2.5 backdrop-blur-md ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>
                <div className={`text-xs font-semibold mb-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Pass</div>
                <div className={`text-sm md:text-base font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>{requiredCorrect}</div>
              </div>

              <div className={`border rounded-lg p-2 md:p-2.5 backdrop-blur-md ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>
                <div className={`text-xs font-semibold mb-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Mode</div>
                <div className={`text-sm md:text-base font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>📊</div>
              </div>
            </div>

            {/* Test Details */}
            <div className={`border rounded-lg p-3 md:p-4 mb-4 md:mb-5 backdrop-blur-md ${isDark ? 'bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-700/30' : 'bg-blue-50 border-blue-200'}`}>
              <h3 className={`text-xs md:text-sm font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>📋 Details</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Questions:</span>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedQuestionCount[0]} random</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Time:</span>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>60 min (~{timePerQuestion}s)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Pass:</span>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>≥{requiredCorrect} ({Math.round((requiredCorrect / selectedQuestionCount[0]) * 100)}%)</span>
                </div>
                <div className={`flex justify-between items-center pt-1.5 border-t ${isDark ? 'border-gray-700' : 'border-blue-300'}`}>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Target:</span>
                  <span className={`font-bold ${selectedQuestionCount[0] >= 33 ? (isDark ? 'text-green-400' : 'text-green-600') : (isDark ? 'text-yellow-400' : 'text-yellow-600')}`}>
                    {selectedQuestionCount[0] >= 33 ? '✅ Official' : '⚡ Practice'}
                  </span>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartTest}
              className={`w-full font-bold py-2.5 md:py-3 text-xs md:text-sm rounded-lg transition-all transform hover:scale-105 active:scale-95 ${isDark ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-blue-500/50 hover:shadow-2xl' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'}`}
            >
              🚀 Start Test with {selectedQuestionCount[0]} Q
            </button>

            <p className="text-center text-gray-400 text-xs mt-1.5">You can pause and resume anytime</p>
          </div>
        </div>
      </div>
    )
  }

  if (showResults) {
    const passPercentage = Math.round((requiredToPass / selectedQuestionCount[0]) * 100)
    const scorePercentageNum = Math.round((correctAnswers / selectedQuestionCount[0]) * 100)

    return (
      <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-black via-gray-950 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-white'}`}>
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className={`w-full max-w-2xl border backdrop-blur-sm ${isDark ? 'border-gray-700 bg-white/5' : 'border-gray-200 bg-white/80'}`}>
            <CardHeader className="text-center pb-6 border-b border-gray-700">
              <div className="mb-3">
                {passed ? (
                  <div className="text-5xl">🎉</div>
                ) : (
                  <div className="text-5xl">💪</div>
                )}
              </div>
              <CardTitle className={`text-4xl font-bold ${passed ? 'bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent' : 'text-white'}`}>
                {passed ? "Test Passed!" : "Keep Practicing"}
              </CardTitle>
              <p className={`text-lg mt-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {passed ? "Excellent! You've mastered this test!" : "You're making progress! Keep going!"}
              </p>
            </CardHeader>

            <CardContent className="space-y-8 pt-8">
              {/* Score Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg text-center border ${isDark ? 'border-green-500/30 bg-green-500/10' : 'border-green-300 bg-green-50'}`}>
                  <div className={`text-3xl sm:text-4xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>{correctAnswers}</div>
                  <div className={`text-xs sm:text-sm mt-1 font-semibold ${isDark ? 'text-green-300/70' : 'text-green-700'}`}>Correct</div>
                </div>
                <div className={`p-4 rounded-lg text-center border ${isDark ? 'border-red-500/30 bg-red-500/10' : 'border-red-300 bg-red-50'}`}>
                  <div className={`text-3xl sm:text-4xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>{selectedQuestionCount[0] - correctAnswers}</div>
                  <div className={`text-xs sm:text-sm mt-1 font-semibold ${isDark ? 'text-red-300/70' : 'text-red-700'}`}>Missed</div>
                </div>
                <div className={`p-4 rounded-lg text-center border ${isDark ? 'border-blue-500/30 bg-blue-500/10' : 'border-blue-300 bg-blue-50'}`}>
                  <div className={`text-3xl sm:text-4xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{scorePercentage}%</div>
                  <div className={`text-xs sm:text-sm mt-1 font-semibold ${isDark ? 'text-blue-300/70' : 'text-blue-700'}`}>Score</div>
                </div>
              </div>

              {/* Requirements Info */}
              <div className={`p-4 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-900/30' : 'border-gray-200 bg-gray-100'}`}>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Required to pass:</span>
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{requiredToPass}/{selectedQuestionCount[0]} ({passPercentage}%)</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Your score:</span>
                    <span className={`font-bold text-lg ${passed ? isDark ? 'text-green-400' : 'text-green-600' : isDark ? 'text-orange-400' : 'text-orange-600'}`}>{correctAnswers}/{selectedQuestionCount[0]} ({scorePercentage}%)</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Progress value={scorePercentageNum} className={`h-3 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-300'}`} />
                <div className={`text-center text-sm font-semibold ${passed ? isDark ? 'text-green-400' : 'text-green-600' : isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                  {passed ? "🎊 Congratulations! You passed!" : "💡 Keep practicing! You've got this!"}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link href="/review">
                  <Button className={`w-full font-semibold py-3 text-base rounded-lg transition-all border ${isDark ? 'border-purple-600 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-purple-200' : 'border-purple-400 bg-purple-400/20 hover:bg-purple-400/30 text-purple-600 hover:text-purple-700'}`}>
                    🔍 Review This Test
                  </Button>
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/practice">
                    <Button className={`w-full font-semibold py-3 text-base rounded-lg transition-all border ${isDark ? 'border-blue-600 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-blue-200' : 'border-blue-400 bg-blue-400/20 hover:bg-blue-400/30 text-blue-600 hover:text-blue-700'}`}>
                      📚 Practice More
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button className={`w-full font-semibold py-3 text-base rounded-lg transition-all border ${isDark ? 'border-gray-700 bg-transparent hover:bg-gray-900/50 text-gray-300 hover:text-white' : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900'}`}>
                      ← Home
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!testMode || !testQuestions.length || !currentQuestion) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Test Loading...</h2>
          <p className="mt-2 text-gray-400 text-sm">Please wait or click Start Test</p>
          <Link href="/">
            <Button className="mt-4">Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-black via-gray-950 to-black text-white' : 'bg-white text-gray-900'}`}>
      <StickyMobileHeader
        title="Official Test"
        subtitle={`Q ${currentQuestionIndex + 1}/${selectedQuestionCount[0]}`}
        showLanguage={true}
        showBackButton={true}
        backHref="/"
        rightContent={
          <div className="text-xs font-mono font-semibold text-blue-300">
            {formatTime(timeRemaining)}
          </div>
        }
      />
      <div className="w-full px-4 md:px-8 py-4 md:py-6">
        {/* Header - Desktop Only */}
        <div className="hidden sm:flex items-center justify-between mb-6 md:mb-8">
          <Link href="/">
            <Button className={`border px-3 py-1.5 text-xs md:text-sm transition-colors ${isDark ? 'border-gray-700 bg-transparent hover:bg-gray-900 text-gray-300 hover:text-white' : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900'}`}>
              <ArrowLeft className="w-3 h-3 mr-1" />
              Back
            </Button>
          </Link>

          <div className="text-center">
            <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Official Test</h1>
            <p className={`mt-1 text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Q {currentQuestionIndex + 1}/{selectedQuestionCount[0]}</p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-700/30 px-3 md:px-4 py-2 rounded-lg backdrop-blur-md">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="font-mono font-semibold text-blue-300 text-sm md:text-base">{formatTime(timeRemaining)}</span>
            </div>
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>

        {/* Progress Bar - Full Width */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Progress</span>
            <span className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{Math.round(((currentQuestionIndex + 1) / selectedQuestionCount[0]) * 100)}%</span>
          </div>
          <Progress value={((currentQuestionIndex + 1) / selectedQuestionCount[0]) * 100} className={`h-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-300'}`} />
        </div>

        {/* Main Content - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 mb-6">
          {/* Left: Question Card */}
          <div>
            {currentQuestion ? (
            <SwipeCard
              question={currentQuestion}
              onSwipe={(dir) => {
                if (dir === "right") handleNext()
                else handlePrevious()
              }}
              onFlag={() => {
                if (userProgress.flaggedQuestions.includes(currentQuestion.id)) {
                  unflagQuestion(currentQuestion.id)
                } else {
                  flagQuestion(currentQuestion.id)
                }
              }}
              isFlagged={userProgress.flaggedQuestions.includes(currentQuestion.id)}
              showAnswer={Boolean(currentAnswer)}
              onAnswerSelect={handleAnswerSelect}
              externalSelectedAnswer={currentAnswer ? currentAnswer.selectedIndex : null}
              isTranslated={isTranslated}
              onTranslate={() => setIsTranslated(!isTranslated)}
              totalQuestions={testQuestions.length}
              onJumpToQuestion={setCurrentQuestionIndex}
            />
            ) : null}
          </div>

          {/* Right: Question Grid */}
          <div className="hidden lg:flex flex-col">
            <div className="grid grid-cols-[repeat(5,minmax(0,1fr))] gap-1">
              {testQuestions.map((_, index) => {
                const answer = testAnswers.find((a) => a.questionId === testQuestions[index]?.id)
                const isAnswered = answer !== undefined
                const isCurrent = index === currentQuestionIndex
                const isFlagged = userProgress.flaggedQuestions.includes(testQuestions[index]?.id)

                return (
                  <button
                    key={index}
                    onClick={() => handleQuestionJump(index)}
                    className={`relative aspect-square rounded-lg font-semibold text-xs transition-all border ${
                      isCurrent
                        ? isDark ? "bg-white text-black border-white shadow-lg shadow-white/50" : "bg-blue-500 text-white border-blue-600 shadow-lg shadow-blue-400/50"
                        : isAnswered
                          ? answer.correct
                            ? "bg-green-500 text-white border-green-400 hover:opacity-80"
                            : "bg-red-500 text-white border-red-400 hover:opacity-80"
                          : isDark ? "border-gray-600 bg-transparent text-gray-300" : "border-gray-400 bg-transparent text-gray-600"
                    }`}
                  >
                    {index + 1}
                    {isFlagged && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Navigation Buttons - Sticky Bottom Desktop */}
        <div className={`hidden sm:grid fixed bottom-0 left-0 right-0 z-40 grid-cols-3 gap-2 md:gap-4 p-4 md:p-6 backdrop-blur-sm border-t transition-colors ${isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'}`}>
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex <= 0}
            className={`border font-semibold px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all truncate rounded ${isDark ? 'border-gray-700 bg-transparent hover:bg-gray-900 text-gray-300 hover:text-white' : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900'}`}
          >
            ← Previous
          </Button>

          <Button
            onClick={handleSubmitTest}
            className={`font-bold py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm rounded-lg transition-all transform hover:scale-105 active:scale-95 truncate border ${isDark ? 'border-red-600 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 shadow-lg hover:shadow-red-500/30' : 'border-red-400 bg-red-400/20 hover:bg-red-400/30 text-red-600 hover:text-red-700 shadow-lg hover:shadow-red-500/20'}`}
          >
            🏁 Submit
          </Button>

          <Button
            onClick={handleNext}
            disabled={currentQuestionIndex >= selectedQuestionCount[0] - 1}
            className={`border font-semibold px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all truncate rounded ${isDark ? 'border-gray-700 bg-transparent hover:bg-gray-900 text-gray-300 hover:text-white' : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900'}`}
          >
            Next →
          </Button>
        </div>

        {/* Add bottom padding for sticky nav on desktop */}
        <div className="hidden sm:block h-24"></div>

        {/* Mobile Question Grid */}
        <div className="lg:hidden">
          <div className={`border rounded-lg p-3 ${isDark ? 'border-gray-700 bg-transparent' : 'border-gray-200 bg-transparent'}`}>
            <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Progress: {testAnswers.length}/{selectedQuestionCount[0]}</h3>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-1">
              {testQuestions.map((_, index) => {
                const answer = testAnswers.find((a) => a.questionId === testQuestions[index]?.id)
                const isAnswered = answer !== undefined
                const isCurrent = index === currentQuestionIndex
                const isFlagged = userProgress.flaggedQuestions.includes(testQuestions[index]?.id)

                return (
                  <button
                    key={index}
                    onClick={() => handleQuestionJump(index)}
                    className={`relative aspect-square rounded font-semibold text-[0.65rem] sm:text-xs transition-all border flex items-center justify-center ${
                      isCurrent
                        ? isDark ? "bg-white text-black border-white shadow-lg shadow-white/50" : "bg-blue-500 text-white border-blue-600 shadow-lg shadow-blue-400/50"
                        : isAnswered
                          ? answer.correct
                            ? "bg-green-500 text-white border-green-400 hover:opacity-80"
                            : "bg-red-500 text-white border-red-400 hover:opacity-80"
                          : isDark ? "border-gray-600 bg-transparent text-gray-300" : "border-gray-400 bg-transparent text-gray-600"
                    }`}
                  >
                    {index + 1}
                    {isFlagged && (
                      <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

        </div>

        {/* Sticky Bottom Navigation - Mobile Only */}
        <div className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 grid grid-cols-3 gap-2 p-3 backdrop-blur-sm border-t transition-colors ${isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'}`}>
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex <= 0}
            className={`border font-semibold px-2 py-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all truncate rounded ${isDark ? 'border-gray-700 bg-transparent hover:bg-gray-900/50 text-gray-300 hover:text-white' : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900'}`}
          >
            ← Prev
          </Button>

          <Button
            onClick={handleSubmitTest}
            className={`font-bold py-2 px-2 text-xs rounded transition-all transform hover:scale-105 active:scale-95 truncate border ${isDark ? 'border-red-600 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 shadow-lg hover:shadow-red-500/30' : 'border-red-400 bg-red-400/20 hover:bg-red-400/30 text-red-600 hover:text-red-700 shadow-lg hover:shadow-red-500/20'}`}
          >
            🏁 Submit
          </Button>

          <Button
            onClick={handleNext}
            disabled={currentQuestionIndex >= selectedQuestionCount[0] - 1}
            className={`border font-semibold px-2 py-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all truncate rounded ${isDark ? 'border-gray-700 bg-transparent hover:bg-gray-900/50 text-gray-300 hover:text-white' : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900'}`}
          >
            Next →
          </Button>
        </div>

        {/* Add bottom padding for sticky nav on mobile */}
        <div className="sm:hidden h-20"></div>
      </div>
    </div>
  )
}
