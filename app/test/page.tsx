"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Clock, CheckCircle, RotateCcw } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { getTranslation } from "@/lib/i18n"
import LanguageSelector from "@/components/LanguageSelector"
import type { Question } from "@/lib/store"

interface TestAnswer {
  questionId: string
  selectedAnswer: number
  isCorrect: boolean
}

export default function TestPage() {
  const { questions, language, loadQuestions } = useStore()
  const [testQuestions, setTestQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<TestAnswer[]>([])
  const [timeLeft, setTimeLeft] = useState(60 * 60) // 60 minutes in seconds
  const [isTestStarted, setIsTestStarted] = useState(false)
  const [isTestCompleted, setIsTestCompleted] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingError, setLoadingError] = useState<string | null>(null)

  const t = getTranslation(language)

  useEffect(() => {
    const initializeTest = async () => {
      setIsLoading(true)
      setLoadingError(null)

      try {
        let availableQuestions = questions

        // Load questions if not already loaded
        if (availableQuestions.length === 0) {
          availableQuestions = await loadQuestions()
        }

        // If still no questions, use fallback
        if (availableQuestions.length === 0) {
          const fallbackQuestions: Question[] = [
            {
              id: "1",
              question: "What is the capital of Germany?",
              options: ["Berlin", "Munich", "Hamburg", "Frankfurt"],
              answerIndex: 0,
              category: "Geography",
              explanation: "Berlin is the capital and largest city of Germany.",
            },
            {
              id: "2",
              question: "When was the German reunification?",
              options: ["1989", "1990", "1991", "1992"],
              answerIndex: 1,
              category: "History",
              explanation: "German reunification occurred on October 3, 1990.",
            },
          ]
          availableQuestions = fallbackQuestions
        }

        // Select 33 random questions for the test
        const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random())
        const selected = shuffled.slice(0, Math.min(33, shuffled.length))

        setTestQuestions(selected)
      } catch (error) {
        console.error("Failed to initialize test:", error)
        setLoadingError("Failed to load test questions")
      } finally {
        setIsLoading(false)
      }
    }

    initializeTest()
  }, [questions, loadQuestions])

  // Timer effect
  useEffect(() => {
    if (!isTestStarted || isTestCompleted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsTestCompleted(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isTestStarted, isTestCompleted])

  const currentQuestion = testQuestions[currentIndex]

  const startTest = () => {
    setIsTestStarted(true)
    setCurrentIndex(0)
    setAnswers([])
    setTimeLeft(60 * 60)
    setIsTestCompleted(false)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (!currentQuestion) return
    setSelectedAnswer(answerIndex)
  }

  const nextQuestion = () => {
    if (!currentQuestion || selectedAnswer === null) return

    const isCorrect = selectedAnswer === currentQuestion.answerIndex
    const newAnswer: TestAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
    }

    setAnswers((prev) => [...prev, newAnswer])
    setSelectedAnswer(null)

    if (currentIndex < testQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setIsTestCompleted(true)
    }
  }

  const previousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setSelectedAnswer(null)
      // Remove the answer for the current question if going back
      setAnswers((prev) => prev.slice(0, -1))
    }
  }

  const submitTest = () => {
    if (selectedAnswer !== null && currentQuestion) {
      const isCorrect = selectedAnswer === currentQuestion.answerIndex
      const finalAnswer: TestAnswer = {
        questionId: currentQuestion.id,
        selectedAnswer,
        isCorrect,
      }
      setAnswers((prev) => [...prev, finalAnswer])
    }
    setIsTestCompleted(true)
  }

  const resetTest = () => {
    setIsTestStarted(false)
    setIsTestCompleted(false)
    setCurrentIndex(0)
    setAnswers([])
    setSelectedAnswer(null)
    setTimeLeft(60 * 60)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const correctAnswers = answers.filter((a) => a.isCorrect).length
  const totalAnswered = answers.length
  const score = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0
  const passed = correctAnswers >= Math.ceil(testQuestions.length * 0.5) // 50% to pass

  if (isLoading || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-pink-900 text-white flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <Card className="w-full max-w-md border-2 border-cyan-400/50 bg-black/80 backdrop-blur-xl relative overflow-hidden shadow-2xl shadow-cyan-500/25">
          <CardContent className="p-8 text-center relative z-10">
            <div className="text-8xl mb-6 animate-bounce">🚀</div>
            {loadingError ? (
              <>
                <div className="text-red-400 text-2xl font-black mb-4">❌ {t.error}</div>
                <p className="text-red-300 text-lg mb-6">{loadingError}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                >
                  {t.tryAgain}
                </Button>
              </>
            ) : (
              <>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-400 border-t-transparent mx-auto mb-8"></div>
                <p className="text-cyan-300 text-2xl font-black animate-pulse">{t.preparingTest}</p>
                <p className="text-pink-400 text-lg font-bold mt-4 animate-bounce">{t.getReady}</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Test completion screen
  if (isTestCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-pink-900 text-white overflow-hidden relative">
        <div className="fixed inset-0 z-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="text-8xl mb-4 animate-bounce">{passed ? "🎉" : "💪"}</div>
            <h1 className="text-6xl font-black mb-4">
              <span
                className={`bg-gradient-to-r ${passed ? "from-green-400 to-emerald-400" : "from-red-400 to-pink-400"} bg-clip-text text-transparent`}
              >
                {passed ? t.passed.toUpperCase() : t.failed.toUpperCase()}
              </span>
            </h1>
            <p className="text-2xl text-gray-300 mb-8">{passed ? t.crushing : t.keepLearning}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-2 border-cyan-400/50 bg-black/60 backdrop-blur-xl">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-2">📊</div>
                <div className="text-3xl font-black text-cyan-400 mb-1">{score}%</div>
                <div className="text-sm text-gray-300 uppercase tracking-wider">{t.score}</div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-400/50 bg-black/60 backdrop-blur-xl">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-2">✅</div>
                <div className="text-3xl font-black text-green-400 mb-1">{correctAnswers}</div>
                <div className="text-sm text-gray-300 uppercase tracking-wider">{t.correct}</div>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-400/50 bg-black/60 backdrop-blur-xl">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-2">❌</div>
                <div className="text-3xl font-black text-red-400 mb-1">{totalAnswered - correctAnswers}</div>
                <div className="text-sm text-gray-300 uppercase tracking-wider">{t.incorrect}</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/practice">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 text-xl font-black rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110">
                🎮 {t.practice.toUpperCase()}
              </Button>
            </Link>
            <Button
              onClick={resetTest}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-xl font-black rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              {t.reset.toUpperCase()}
            </Button>
            <Link href="/">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-4 text-xl font-black rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110">
                🏠 {t.home.toUpperCase()}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Pre-test screen
  if (!isTestStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-pink-900 text-white overflow-hidden relative">
        <div className="fixed inset-0 z-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <Link href="/">
              <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-2 border-red-400/50 px-6 py-3 rounded-xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 transition-all transform hover:scale-110 backdrop-blur-sm font-black">
                <ArrowLeft className="w-5 h-5 mr-2" />
                {t.back.toUpperCase()}
              </Button>
            </Link>
            <LanguageSelector />
          </div>

          <div className="text-center mb-12">
            <div className="text-8xl mb-6 animate-bounce">🏆</div>
            <h1 className="text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                {t.testMode.toUpperCase()}
              </span>
            </h1>
            <p className="text-2xl text-gray-300 mb-8">{t.testSubtitle}</p>
          </div>

          <Card className="border-2 border-orange-400/50 bg-black/60 backdrop-blur-xl shadow-2xl shadow-orange-500/25 mb-8">
            <CardHeader>
              <CardTitle className="text-3xl font-black text-orange-400 text-center">📋 TEST INFORMATION</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">📝</div>
                  <div className="text-2xl font-black text-cyan-400">{testQuestions.length}</div>
                  <div className="text-sm text-gray-300 uppercase tracking-wider">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">⏰</div>
                  <div className="text-2xl font-black text-yellow-400">60</div>
                  <div className="text-sm text-gray-300 uppercase tracking-wider">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🎯</div>
                  <div className="text-2xl font-black text-green-400">50%</div>
                  <div className="text-sm text-gray-300 uppercase tracking-wider">To Pass</div>
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={startTest}
                  className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-black px-12 py-6 text-3xl font-black rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 border-0"
                >
                  🚀 {t.start.toUpperCase()} TEST
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Test in progress
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-pink-900 text-white overflow-hidden relative">
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-black text-cyan-400">
              {t.question} {currentIndex + 1} {t.of} {testQuestions.length}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-lg ${
                timeLeft < 300 ? "bg-red-900/50 text-red-400" : "bg-black/60 text-yellow-400"
              }`}
            >
              <Clock className="w-5 h-5" />
              {formatTime(timeLeft)}
            </div>
            <LanguageSelector />
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={(currentIndex / testQuestions.length) * 100} className="h-3 bg-black/60" />
          <div className="text-center mt-2 text-sm text-gray-400">
            {Math.round((currentIndex / testQuestions.length) * 100)}% Complete
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-cyan-400/50 bg-black/80 backdrop-blur-xl shadow-2xl shadow-cyan-500/25 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-white">{currentQuestion.question}</CardTitle>
              </CardHeader>
              <CardContent>
                {currentQuestion.image && (
                  <div className="mb-6 flex justify-center">
                    <img
                      src={currentQuestion.image || "/placeholder.svg"}
                      alt="Question illustration"
                      className="max-w-full h-auto rounded-lg shadow-lg border-2 border-cyan-400/30"
                      style={{ maxHeight: "300px" }}
                    />
                  </div>
                )}

                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 text-left rounded-xl font-bold text-lg transition-all duration-300 border-2 transform hover:scale-[1.02] ${
                        selectedAnswer === index
                          ? "bg-gradient-to-r from-cyan-500 to-blue-500 border-cyan-400 text-white shadow-lg shadow-cyan-500/50"
                          : "bg-black/60 border-cyan-400/30 text-white hover:bg-black/80 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25"
                      }`}
                    >
                      <span className="mr-3 text-xl font-black">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={previousQuestion}
            disabled={currentIndex === 0}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-black"
          >
            ← Previous
          </Button>

          <div className="flex gap-4">
            {currentIndex === testQuestions.length - 1 ? (
              <Button
                onClick={submitTest}
                disabled={selectedAnswer === null}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-black text-lg"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                {t.submitTest.toUpperCase()}
              </Button>
            ) : (
              <Button
                onClick={nextQuestion}
                disabled={selectedAnswer === null}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-black"
              >
                Next →
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
