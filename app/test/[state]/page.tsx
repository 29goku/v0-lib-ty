"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { useTheme } from "@/lib/theme"
import ThemeToggle from "@/components/ThemeToggle"
import { GERMAN_STATES, getStateByCode } from "@/lib/states"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Clock } from "lucide-react"
import SwipeCard from "@/components/SwipeCard"
import Link from "next/link"
import { getCategoryEmoji } from "@/lib/category-emojis"

export default function StateTestPage() {
  const params = useParams()
  const router = useRouter()
  const stateCode = params?.state as string

  // Validate state code
  const state = getStateByCode(stateCode)
  const [stateValid, setStateValid] = useState(false)
  const [stateQuestions, setStateQuestions] = useState<any[]>([])
  const [testQuestions, setTestQuestions] = useState<any[]>([])

  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    userProgress,
    answerQuestion,
    flagQuestion,
    unflagQuestion,
    testMode,
    testStartTime,
    testAnswers,
    startTest,
    endTest,
    recordTestAttempt,
  } = useStore()

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(60 * 60) // 60 minutes in seconds
  const [showResults, setShowResults] = useState(false)
  const [isTranslated, setIsTranslated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showConfig, setShowConfig] = useState(true)
  const [selectedQuestionCount, setSelectedQuestionCount] = useState([33])

  // Validate state and load questions
  useEffect(() => {
    const loadStateQuestions = async () => {
      if (!state) {
        setStateValid(false)
        setIsLoading(false)
        return
      }

      setStateValid(true)

      try {
        // Load general questions
        const response = await fetch("/data/questions.json")
        if (!response.ok) throw new Error("Failed to load general questions")
        const allQuestions = await response.json()

        // Load state-specific questions
        const stateResponse = await fetch("/data/state-questions.json")
        if (!stateResponse.ok) throw new Error("Failed to load state questions")
        const stateData = await stateResponse.json()

        // Get state questions using the slug
        const selectedStateQuestions = stateData[state.slug] || []
        setStateQuestions(selectedStateQuestions)

        // For state test: use first 30 general + 3 state-specific
        const generalFirst30 = allQuestions.slice(0, 30)
        const combined = [...generalFirst30, ...selectedStateQuestions]
        setTestQuestions(combined)
      } catch (error) {
        console.error("Failed to load questions:", error)
        setTestQuestions([])
      } finally {
        setIsLoading(false)
      }
    }

    loadStateQuestions()
  }, [state])

  // Start test
  const handleStartTest = () => {
    if (testQuestions.length === 0) return

    // Use exactly 33 questions: 30 general + 3 state-specific
    const toUse = testQuestions.slice(0, 33)
    setTestQuestions(toUse)
    setShowConfig(false)
    startTest()
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setIsTranslated(false)
    setTimeRemaining(60 * 60)
  }

  // Timer
  useEffect(() => {
    if (!testMode || showResults || showConfig) return
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmitTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [testMode, showResults, showConfig])

  const currentQuestion = testQuestions[currentQuestionIndex]
  const currentAnswer = testAnswers.find((a) => a.questionId === currentQuestion?.id)

  const handleAnswerSelect = (answerIndex: number) => {
    if (!currentQuestion) return

    setSelectedAnswer(answerIndex)
    const isCorrect = answerIndex === currentQuestion.answerIndex
    answerQuestion(currentQuestion.id, answerIndex, isCorrect)
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

  const handleSubmitTest = () => {
    const timeSpent = testStartTime ? Date.now() - testStartTime : 0
    const correctCount = testAnswers.filter((a) => a.correct).length
    recordTestAttempt(correctCount, testQuestions.length, timeSpent, stateCode, testQuestions, testAnswers)
    setShowResults(true)
    endTest()
  }

  const correctCount = testAnswers.filter((a) => a.correct).length
  const passThreshold = 17 // Need 17/33 to pass
  const passed = correctCount >= passThreshold

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Invalid state
  if (!isLoading && !stateValid) {
    return (
      <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
        <Card className="w-full max-w-md border border-gray-700 bg-white/5">
          <CardHeader>
            <CardTitle className="text-red-400">Invalid State Code</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              State code "{stateCode}" not found. Valid codes:
            </p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {GERMAN_STATES.map((s) => (
                <code key={s.code} className="text-xs bg-gray-700 p-1 text-blue-400">
                  {s.code}
                </code>
              ))}
            </div>
            <Link href="/test">
              <Button className="w-full border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white">← Back to Test Selection</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Loading {state?.nameDE} test...</p>
        </div>
      </div>
    )
  }

  // Configuration screen
  if (showConfig) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link href="/test" className="inline-flex items-center gap-2 text-gray-400 hover:text-white">
              <ArrowLeft size={20} />
              Back
            </Link>
            <ThemeToggle />
          </div>

          <Card className="border border-gray-700 bg-white/5">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                {state?.nameDE} Test
              </CardTitle>
              <p className="text-gray-400 mt-2">{state?.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Test Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border border-gray-700 bg-white/5 p-3">
                    <div className="text-gray-400 text-sm">Questions</div>
                    <div className="text-xl font-semibold">33</div>
                    <div className="text-xs text-gray-500">30 general + 3 state</div>
                  </div>
                  <div className="border border-gray-700 bg-white/5 p-3">
                    <div className="text-gray-400 text-sm">Duration</div>
                    <div className="text-xl font-semibold">60</div>
                    <div className="text-xs text-gray-500">minutes</div>
                  </div>
                  <div className="border border-gray-700 bg-white/5 p-3">
                    <div className="text-gray-400 text-sm">Pass Score</div>
                    <div className="text-xl font-semibold">17</div>
                    <div className="text-xs text-gray-500">/33 correct</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">State Questions</h3>
                <div className="border border-gray-700 bg-white/5 p-4">
                  <p className="text-sm text-gray-300">
                    This test includes 3 questions specific to {state?.nameDE}. These cover important facts about this Bundesland.
                  </p>
                  <div className="mt-3 space-y-1">
                    {stateQuestions.slice(0, 3).map((q: any, i: number) => (
                      <div key={i} className="text-xs text-gray-400 truncate">
                        • {q.question}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleStartTest}
                size="lg"
                className="w-full border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white"
              >
                Start Test
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Results screen
  if (showResults) {
    const percentage = Math.round((correctCount / testQuestions.length) * 100)

    return (
      <div className="min-h-screen bg-black text-white p-4">
        <div className="max-w-2xl mx-auto">
          <Card className={`border ${passed ? "border-green-500" : "border-red-500"} bg-white/5`}>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center">
                {passed ? "Test Passed!" : "Test Failed"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-semibold mb-2">{correctCount}/33</div>
                <div className="text-gray-400">{percentage}% correct</div>
                <div className={`mt-2 text-base font-semibold ${passed ? "text-green-400" : "text-red-400"}`}>
                  {passed ? `You need 17/33 to pass. Great job!` : `You need 17/33 to pass. Try again!`}
                </div>
              </div>

              <div className="border border-gray-700 bg-white/5 p-4">
                <h3 className="font-semibold mb-3">Results by Category</h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(
                    testAnswers.reduce(
                      (acc: any, a: any) => {
                        const q = testQuestions.find((q: any) => q.id === a.questionId)
                        const cat = q?.category || "Other"
                        acc[cat] = acc[cat] || { correct: 0, total: 0 }
                        acc[cat].total++
                        if (a.correct) acc[cat].correct++
                        return acc
                      },
                      {}
                    )
                  ).map(([cat, stats]: [string, any]) => (
                    <div key={cat} className="flex justify-between">
                      <span>{cat}</span>
                      <span className={stats.correct === stats.total ? "text-green-400" : "text-gray-400"}>
                        {stats.correct}/{stats.total}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Link href="/test" className="flex-1">
                  <Button className="w-full border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white">
                    Choose Another State
                  </Button>
                </Link>
                <Button
                  onClick={() => window.location.reload()}
                  className="flex-1 border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Test in progress
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl">No questions loaded</p>
          <Link href="/test">
            <Button className="mt-4 border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white">← Back</Button>
          </Link>
        </div>
      </div>
    )
  }

  const progressPercent = ((currentQuestionIndex + 1) / testQuestions.length) * 100

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">
              {state?.nameDE} Test
            </h1>
            <p className="text-gray-400">
              Question {currentQuestionIndex + 1} of {testQuestions.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="text-right">
              <div className="text-2xl font-semibold text-white">{formatTime(timeRemaining)}</div>
              <Clock className="inline-block mt-1 text-gray-400" size={16} />
            </div>
          </div>
        </div>

        {/* Progress */}
        <Progress value={progressPercent} className="mb-6" />

        {/* Question Card */}
        <SwipeCard
          question={currentQuestion}
          onAnswer={handleAnswerSelect}
          selectedAnswer={selectedAnswer}
          isCorrect={selectedAnswer !== null ? selectedAnswer === currentQuestion.answerIndex : undefined}
          isTranslated={isTranslated}
          onTranslate={() => setIsTranslated(!isTranslated)}
          onFlag={() => {
            if (userProgress.flaggedQuestions.includes(currentQuestion.id)) {
              unflagQuestion(currentQuestion.id)
            } else {
              flagQuestion(currentQuestion.id)
            }
          }}
          isFlagged={userProgress.flaggedQuestions.includes(currentQuestion.id)}
        />

        {/* Navigation */}
        <div className="mt-6 flex gap-3">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex-1 border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white disabled:opacity-50"
          >
            ← Previous
          </Button>
          {currentQuestionIndex === testQuestions.length - 1 ? (
            <Button
              onClick={handleSubmitTest}
              className="flex-1 border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white"
            >
              Submit Test
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="flex-1 border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white"
            >
              Next →
            </Button>
          )}
        </div>

        {/* Question stats */}
        <div className="mt-4 text-xs text-gray-400 text-center">
          {testAnswers.filter((a) => a.correct).length} correct •{" "}
          {testAnswers.filter((a) => !a.correct).length} incorrect •{" "}
          {testQuestions.length - testAnswers.length} unanswered
        </div>
      </div>
    </div>
  )
}
