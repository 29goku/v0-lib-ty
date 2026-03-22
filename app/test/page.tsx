"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import { useTheme, getTheme } from "@/lib/theme"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Clock } from "lucide-react"
import SwipeCard from "@/components/SwipeCard"
import Link from "next/link"
import { getCategoryEmoji } from "@/lib/category-emojis"

export default function TestPage() {
  const {
    questions,
    testQuestions,
    setTestQuestions,
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
    loadQuestions,
  } = useStore()

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
    recordTestAttempt(correctCount, testAnswers.length, timeSpent)
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-semibold text-white mb-4">Test Mode</h2>
          <div className="w-64 h-1 bg-gray-800 mx-auto">
            <div className="h-full bg-white animate-pulse"></div>
          </div>
          <div className="mt-6 text-lg text-gray-300">Loading your official simulation...</div>
        </div>
      </div>
    )
  }

  if (showConfig) {
    const timePerQuestion = Math.round(3600 / selectedQuestionCount[0]);
    const requiredCorrect = Math.ceil(selectedQuestionCount[0] * 0.5);

    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-12">
            <Link href="/">
              <Button className="border border-gray-700 bg-transparent hover:bg-gray-900 text-gray-300 hover:text-white px-4 py-2 rounded transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold">⚡ Test Configuration</h1>
            <div className="w-16"></div>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Main Configuration Card */}
            <div className="bg-gradient-to-br from-gray-900/50 to-black border border-gray-700 rounded-2xl p-8 md:p-10 mb-8 backdrop-blur-md">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Customize Your Test</h2>
              <p className="text-gray-400 mb-8">Choose the difficulty level and question count</p>

              {/* Quick Preset Buttons */}
              <div className="mb-8">
                <p className="text-sm font-semibold text-gray-300 mb-3">Quick Presets:</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Short", value: 10, emoji: "⚡" },
                    { label: "Standard", value: 33, emoji: "🎯" },
                    { label: "Full", value: 60, emoji: "💪" }
                  ].map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setSelectedQuestionCount([preset.value])}
                      className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                        selectedQuestionCount[0] === preset.value
                          ? "border-blue-500 bg-blue-500/10 text-blue-400"
                          : "border-gray-700 bg-gray-900/30 text-gray-300 hover:border-gray-600 hover:bg-gray-900/50"
                      }`}
                    >
                      <div className="text-xl mb-1">{preset.emoji}</div>
                      <div className="text-xs">{preset.label}</div>
                      <div className="text-sm font-bold">{preset.value}Q</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Slider */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-white">Custom: {selectedQuestionCount[0]} Questions</label>
                  <span className="text-2xl font-bold text-blue-400">{selectedQuestionCount[0]}</span>
                </div>
                <Slider
                  value={selectedQuestionCount}
                  onValueChange={setSelectedQuestionCount}
                  max={questions.length}
                  min={10}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>10 Questions</span>
                  <span>{Math.round(questions.length / 2)}</span>
                  <span>{questions.length} Questions</span>
                </div>
              </div>
            </div>

            {/* Test Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 backdrop-blur-md">
                <div className="text-gray-400 text-xs font-semibold mb-1">Questions</div>
                <div className="text-2xl font-bold text-blue-400">{selectedQuestionCount[0]}</div>
                <div className="text-xs text-gray-500 mt-1">questions</div>
              </div>

              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 backdrop-blur-md">
                <div className="text-gray-400 text-xs font-semibold mb-1">Time Limit</div>
                <div className="text-2xl font-bold text-orange-400">60m</div>
                <div className="text-xs text-gray-500 mt-1">{timePerQuestion}s per Q</div>
              </div>

              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 backdrop-blur-md">
                <div className="text-gray-400 text-xs font-semibold mb-1">Pass Threshold</div>
                <div className="text-2xl font-bold text-green-400">50%</div>
                <div className="text-xs text-gray-500 mt-1">{requiredCorrect} correct</div>
              </div>

              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 backdrop-blur-md">
                <div className="text-gray-400 text-xs font-semibold mb-1">Difficulty</div>
                <div className="text-2xl font-bold text-purple-400">📊</div>
                <div className="text-xs text-gray-500 mt-1">adaptive</div>
              </div>
            </div>

            {/* Test Details */}
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-xl p-6 mb-8 backdrop-blur-md">
              <h3 className="text-lg font-bold text-white mb-4">📋 Test Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Questions:</span>
                  <span className="text-white font-semibold">{selectedQuestionCount[0]} randomly selected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Time Allowed:</span>
                  <span className="text-white font-semibold">60 minutes (~{timePerQuestion}s per question)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Pass Requirement:</span>
                  <span className="text-white font-semibold">≥{requiredCorrect} correct ({Math.round((requiredCorrect / selectedQuestionCount[0]) * 100)}%)</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                  <span className="text-gray-300">Your Target:</span>
                  <span className={`font-bold text-lg ${selectedQuestionCount[0] >= 33 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {selectedQuestionCount[0] >= 33 ? '✅ Official' : '⚡ Practice'}
                  </span>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartTest}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 md:py-5 text-lg md:text-xl rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/50 hover:shadow-2xl"
            >
              🚀 Start Test with {selectedQuestionCount[0]} Questions
            </button>

            <p className="text-center text-gray-400 text-sm mt-4">You can pause and resume your test anytime</p>
          </div>
        </div>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-2xl border border-gray-700 bg-white/5">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-semibold text-white">
                {passed ? "Test Completed" : "Keep Practicing"}
              </CardTitle>
              <p className="text-lg text-gray-300 mt-2">Practice more to improve your results</p>
            </CardHeader>

            <CardContent className="space-y-8">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-semibold text-green-400">{correctAnswers}</div>
                  <div className="text-sm text-gray-300">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-semibold text-red-400">{selectedQuestionCount[0] - correctAnswers}</div>
                  <div className="text-sm text-gray-300">Missed</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-semibold text-white">{scorePercentage}%</div>
                  <div className="text-sm text-gray-300">Score</div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <div className="text-base">
                  <span className="text-gray-300">
                    Required to pass: {requiredToPass}/{selectedQuestionCount[0]} (
                    {Math.round((requiredToPass / selectedQuestionCount[0]) * 100)}%)
                  </span>
                </div>
                <div className="text-base">
                  <span className="text-white font-semibold">
                    Your score: {correctAnswers}/{selectedQuestionCount[0]} ({scorePercentage}%)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Progress value={(correctAnswers / selectedQuestionCount[0]) * 100} className="h-2 bg-gray-700" />
                <div className="text-center text-sm text-gray-400">
                  {passed ? "Congratulations! You passed!" : "Keep practicing! You've got this!"}
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/practice">
                    <Button className="w-full border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white font-semibold py-3 text-base">
                      Practice More
                    </Button>
                  </Link>
                  <Link href="/review">
                    <Button className="w-full border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white font-semibold py-3 text-base">
                      Review Answers
                    </Button>
                  </Link>
                </div>

                <Link href="/">
                  <Button className="w-full border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white font-semibold py-3 text-base">
                    ← Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">No questions available</h2>
          <Link href="/">
            <Button className="mt-4">Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button className="border border-gray-700 bg-transparent hover:bg-gray-900 text-gray-300 hover:text-white px-4 py-2 rounded transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Official Test</h1>
            <p className="text-gray-400 mt-1">Question {currentQuestionIndex + 1} of {selectedQuestionCount[0]}</p>
          </div>

          <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-700/30 px-4 py-3 rounded-lg backdrop-blur-md">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="font-mono font-semibold text-blue-300 text-lg">{formatTime(timeRemaining)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-400">Progress</span>
            <span className="text-xs font-semibold text-gray-400">{Math.round(((currentQuestionIndex + 1) / selectedQuestionCount[0]) * 100)}%</span>
          </div>
          <Progress value={((currentQuestionIndex + 1) / selectedQuestionCount[0]) * 100} className="h-3 bg-gray-800 rounded-full" />
        </div>

        <div className="mb-8">
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
            isTranslated={isTranslated}
            onTranslate={() => setIsTranslated(!isTranslated)}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center gap-4 mb-8">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex <= 0}
            className="flex-1 border border-gray-700 bg-transparent hover:bg-gray-900 text-gray-300 hover:text-white font-semibold px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            ← Previous
          </Button>

          <Button
            onClick={handleSubmitTest}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-500/50"
          >
            🏁 Submit Test
          </Button>

          <Button
            onClick={handleNext}
            disabled={currentQuestionIndex >= selectedQuestionCount[0] - 1}
            className="flex-1 border border-gray-700 bg-transparent hover:bg-gray-900 text-gray-300 hover:text-white font-semibold px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next →
          </Button>
        </div>

        <Card className="border border-gray-700 bg-gradient-to-br from-gray-900/40 to-black backdrop-blur-md">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl md:text-2xl font-bold text-white">📋 Answer Overview</CardTitle>
              <div className="text-sm font-semibold text-gray-300 bg-blue-500/10 border border-blue-700/30 px-3 py-1 rounded-full">
                {testAnswers.length} / {selectedQuestionCount[0]} Completed
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question Grid */}
            <div className="grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-1.5">
              {testQuestions.map((_, index) => {
                const answer = testAnswers.find((a) => a.questionId === testQuestions[index]?.id)
                const isAnswered = answer !== undefined
                const isCurrent = index === currentQuestionIndex
                const isFlagged = userProgress.flaggedQuestions.includes(testQuestions[index]?.id)

                return (
                  <button
                    key={index}
                    onClick={() => handleQuestionJump(index)}
                    className={`
                      relative aspect-square border rounded-md font-bold text-xs transition-all transform
                      ${
                        isCurrent
                          ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400 scale-110 shadow-lg shadow-blue-500/50"
                          : isAnswered
                            ? answer.correct
                              ? "bg-gradient-to-br from-green-900/50 to-green-900/30 text-green-300 border-green-600 hover:from-green-800/60 hover:to-green-800/40"
                              : "bg-gradient-to-br from-orange-900/50 to-orange-900/30 text-orange-300 border-orange-600 hover:from-orange-800/60 hover:to-orange-800/40"
                            : "bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-700/50"
                      }
                    `}
                  >
                    {index + 1}
                    {isFlagged && (
                      <div className="absolute -top-2 -right-2 w-2.5 h-2.5 bg-red-500 rounded-full border border-red-300 shadow-lg shadow-red-500/50"></div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-br from-green-900/50 to-green-900/30 border border-green-600 rounded"></div>
                <span className="text-xs text-green-400 font-semibold">Correct</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-br from-orange-900/50 to-orange-900/30 border border-orange-600 rounded"></div>
                <span className="text-xs text-orange-400 font-semibold">Incorrect</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-800/50 border border-gray-700 rounded"></div>
                <span className="text-xs text-gray-400 font-semibold">Unanswered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full border border-red-300"></div>
                <span className="text-xs text-red-400 font-semibold">Flagged</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
