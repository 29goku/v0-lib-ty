"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
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
  // Start test with selected number of questions
  const handleStartTest = () => {
    // Shuffle and select questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    const selectedQuestions = shuffled.slice(0, selectedQuestionCount[0])
    setQuestions(selectedQuestions)
    setShowConfig(false)
    startTest()
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setIsTranslated(false)
    setTimeRemaining(60 * 60)
  }
  const {
    questions,
    setQuestions,
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
    loadQuestions,
  } = useStore()

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

  const currentQuestion = questions[currentQuestionIndex]
  const currentAnswer = testAnswers.find((a) => a.questionId === currentQuestion?.id)

  const handleAnswerSelect = (answerIndex: number) => {
    if (!currentQuestion) return

    setSelectedAnswer(answerIndex)
    const isCorrect = answerIndex === currentQuestion.answerIndex
    answerQuestion(currentQuestion.id, answerIndex, isCorrect)
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      const nextQuestion = questions[currentQuestionIndex + 1]
      const existingAnswer = testAnswers.find((a) => a.questionId === nextQuestion?.id)
      setSelectedAnswer(existingAnswer?.selectedIndex ?? null)
      setIsTranslated(false)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      const prevQuestion = questions[currentQuestionIndex - 1]
      const existingAnswer = testAnswers.find((a) => a.questionId === prevQuestion?.id)
      setSelectedAnswer(existingAnswer?.selectedIndex ?? null)
      setIsTranslated(false)
    }
  }

  const handleQuestionJump = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex)
    const targetQuestion = questions[questionIndex]
    const existingAnswer = testAnswers.find((a) => a.questionId === targetQuestion?.id)
    setSelectedAnswer(existingAnswer?.selectedIndex ?? null)
    setIsTranslated(false)
  }

  const handleSubmitTest = () => {
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
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-black flex items-center justify-center overflow-hidden relative">
        {/* Animated background and floating emojis */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-900 via-purple-900 to-black"></div>
          <div className="absolute top-10 left-10 text-6xl animate-bounce" style={{ animationDelay: '0s' }}>📝</div>
          <div className="absolute top-32 right-20 text-5xl animate-bounce" style={{ animationDelay: '1s' }}>⏱️</div>
          <div className="absolute bottom-32 left-32 text-7xl animate-bounce" style={{ animationDelay: '2s' }}>🏆</div>
          <div className="absolute bottom-20 right-20 text-5xl animate-bounce" style={{ animationDelay: '3s' }}>✨</div>
        </div>
        <div className="text-center z-10">
          <div className="text-8xl mb-8 animate-bounce">�</div>
          <h2 className="text-5xl font-black bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x mb-4">TEST MODE</h2>
          <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full animate-pulse"></div>
          </div>
          <div className="mt-6 text-xl text-pink-200 animate-pulse">Loading your official simulation...</div>
        </div>
      </div>
    )
  }

  if (showConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">🎯 TEST CONFIGURATION</h1>
            <div></div>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-purple-500/50 bg-gradient-to-br from-purple-900/30 to-black/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center text-2xl font-bold text-purple-300">Configure Your Test</CardTitle>
                <p className="text-center text-gray-300">Choose how many questions you want to answer in your test</p>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-lg font-semibold text-white">Number of Questions:</label>
                    <div className="text-2xl font-bold text-cyan-400">{selectedQuestionCount[0]}</div>
                  </div>

                  <Slider
                    value={selectedQuestionCount}
                    onValueChange={setSelectedQuestionCount}
                    max={questions.length}
                    min={10}
                    step={1}
                    className="w-full"
                  />

                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Min: 10</span>
                    <span>Default: 33</span>
                    <span>Max: {questions.length}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-6 border border-blue-500/30">
                  <h3 className="text-lg font-bold text-blue-300 mb-3">📋 Test Information</h3>
                  <div className="space-y-2 text-gray-300">
                    <p>⏱️ Time Limit: 60 minutes</p>
                    <p>✅ Pass Rate: 50% ({Math.ceil(selectedQuestionCount[0] * 0.5)} correct answers needed)</p>
                    <p>🎯 Questions: {selectedQuestionCount[0]} randomly selected</p>
                  </div>
                </div>

                <Button
                  onClick={handleStartTest}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-black py-4 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  🚀 START TEST WITH {selectedQuestionCount[0]} QUESTIONS
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white relative overflow-hidden">
        <div className="absolute top-10 left-10 text-4xl animate-bounce" style={{ animationDelay: "0s" }}>
          🎉
        </div>
        <div className="absolute top-20 right-20 text-3xl animate-bounce" style={{ animationDelay: "0.5s" }}>
          ⭐
        </div>
        <div className="absolute bottom-20 left-20 text-5xl animate-bounce" style={{ animationDelay: "1s" }}>
          🏆
        </div>
        <div className="absolute bottom-10 right-10 text-3xl animate-bounce" style={{ animationDelay: "1.5s" }}>
          🔥
        </div>
        <div className="absolute top-1/2 left-10 text-4xl animate-bounce" style={{ animationDelay: "2s" }}>
          💪
        </div>
        <div className="absolute top-1/3 right-10 text-3xl animate-bounce" style={{ animationDelay: "2.5s" }}>
          🧠
        </div>

        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-2xl border-4 border-orange-500 bg-gradient-to-br from-purple-900/80 to-black/80 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 animate-pulse"></div>

            <CardHeader className="text-center relative z-10">
              <div className="text-6xl mb-4">💪</div>
              <CardTitle className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                keepGrinding 💪
              </CardTitle>
              <p className="text-xl text-gray-300 mt-2">🧠 Practice More to Dominate! 🧠</p>
            </CardHeader>

            <CardContent className="space-y-8 relative z-10">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-5xl font-black text-green-400">{correctAnswers}</div>
                  <div className="text-sm text-gray-300 font-bold">🧠 CORRECT</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-black text-orange-400">{selectedQuestionCount[0] - correctAnswers}</div>
                  <div className="text-sm text-gray-300 font-bold">⚡ MISSED</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-black text-cyan-400">{scorePercentage}%</div>
                  <div className="text-sm text-gray-300 font-bold">🎯 SCORE</div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <div className="text-lg">
                  <span className="text-orange-400 font-bold">
                    🧠 Required to pass: {requiredToPass}/{selectedQuestionCount[0]} (
                    {Math.round((requiredToPass / selectedQuestionCount[0]) * 100)}%)
                  </span>
                </div>
                <div className="text-lg">
                  <span className="text-cyan-400 font-bold">
                    Your score: {correctAnswers}/{selectedQuestionCount[0]} ({scorePercentage}%)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Progress value={(correctAnswers / selectedQuestionCount[0]) * 100} className="h-4 bg-gray-700" />
                <div className="text-center text-sm text-gray-400">
                  {passed ? "🎉 CONGRATULATIONS! YOU PASSED! 🎉" : "💪 Keep grinding! You've got this! 💪"}
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/practice">
                    <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-black py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                      🎮 PRACTICE MORE
                    </Button>
                  </Link>
                  <Link href="/review">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                      🧠 REVIEW ANSWERS
                    </Button>
                  </Link>
                </div>

                <Link href="/">
                  <Button className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-black py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                    ← 🏠 BACK TO HOME
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
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold">No questions available</h2>
          <Link href="/">
            <Button className="mt-4">Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>

          <div className="text-center">
            <h1 className="text-3xl font-bold">🎯 OFFICIAL TEST</h1>
            <p className="text-gray-300">
              Question {currentQuestionIndex + 1} of {selectedQuestionCount[0]}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-red-500/20 px-4 py-2 rounded-full border border-red-500/50">
              <Clock className="w-4 h-4 text-red-400" />
              <span className="font-mono text-red-400">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <Progress value={((currentQuestionIndex + 1) / selectedQuestionCount[0]) * 100} className="h-2" />
        </div>

        <div className="mb-6">
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

        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex <= 0}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-black px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </Button>

          <Button
            onClick={handleSubmitTest}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-black px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            🏁 SUBMIT TEST
          </Button>

          <Button
            onClick={handleNext}
            disabled={currentQuestionIndex >= selectedQuestionCount[0] - 1}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-black px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </Button>
        </div>

        <Card className="border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-black text-yellow-400">🏆 ANSWER OVERVIEW 🏆</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-11 gap-2 mb-6">
              {questions.map((_, index) => {
                const answer = testAnswers.find((a) => a.questionId === questions[index]?.id)
                const isAnswered = answer !== undefined
                const isCurrent = index === currentQuestionIndex
                const isFlagged = userProgress.flaggedQuestions.includes(questions[index]?.id)

                return (
                  <button
                    key={index}
                    onClick={() => handleQuestionJump(index)}
                    className={`
                      relative aspect-square rounded-lg font-bold text-sm transition-all transform hover:scale-110 border-2
                      ${
                        isCurrent
                          ? "bg-cyan-400 text-black border-cyan-300 shadow-lg shadow-cyan-500/50"
                          : isAnswered
                            ? "bg-green-500 text-white border-green-400 hover:bg-green-600"
                            : "bg-gray-600 text-gray-300 border-gray-500 hover:bg-gray-500"
                      }
                    `}
                  >
                    {index + 1}
                    {isFlagged && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded border-2 border-green-400"></div>
                <span className="text-green-400 font-bold">✅ ANSWERED</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-600 rounded border-2 border-gray-500"></div>
                <span className="text-gray-400 font-bold">❓ UNANSWERED</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-red-400 font-bold">🚩 FLAGGED</span>
              </div>
              <div className="text-cyan-400 font-bold">
                🎯 {testAnswers.length} / {selectedQuestionCount[0]} COMPLETED
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
