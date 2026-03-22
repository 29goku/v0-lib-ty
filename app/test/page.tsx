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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-semibold text-white mb-4">Test Mode</h2>
          <div className="w-64 h-1 bg-gray-800 rounded overflow-hidden mx-auto">
            <div className="h-full bg-white rounded animate-pulse"></div>
          </div>
          <div className="mt-6 text-lg text-gray-300">Loading your official simulation...</div>
        </div>
      </div>
    )
  }

  if (showConfig) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Button className="border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-semibold">Test Configuration</h1>
            <div></div>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="border border-gray-700 bg-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center text-xl font-semibold text-white">Configure Your Test</CardTitle>
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

                <div className="border border-gray-700 bg-white/5 rounded p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Test Information</h3>
                  <div className="space-y-2 text-gray-300">
                    <p>Time Limit: 60 minutes</p>
                    <p>Pass Rate: 50% ({Math.ceil(selectedQuestionCount[0] * 0.5)} correct answers needed)</p>
                    <p>Questions: {selectedQuestionCount[0]} randomly selected</p>
                  </div>
                </div>

                <Button
                  onClick={handleStartTest}
                  className="w-full border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white font-semibold py-4 text-lg rounded transition-all"
                >
                  Start Test with {selectedQuestionCount[0]} Questions
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
      <div className="min-h-screen bg-black text-white">
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-2xl border border-gray-700 bg-white/5 backdrop-blur-sm">
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
                    <Button className="w-full border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white font-semibold py-3 text-base rounded transition-all">
                      Practice More
                    </Button>
                  </Link>
                  <Link href="/review">
                    <Button className="w-full border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white font-semibold py-3 text-base rounded transition-all">
                      Review Answers
                    </Button>
                  </Link>
                </div>

                <Link href="/">
                  <Button className="w-full border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white font-semibold py-3 text-base rounded transition-all">
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
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button className="border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>

          <div className="text-center">
            <h1 className="text-2xl font-semibold">Official Test</h1>
            <p className="text-gray-300">
              Question {currentQuestionIndex + 1} of {selectedQuestionCount[0]}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 border border-gray-700 px-4 py-2 rounded">
              <Clock className="w-4 h-4 text-gray-300" />
              <span className="font-mono text-gray-300">{formatTime(timeRemaining)}</span>
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
            className="border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white font-semibold px-6 py-2 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </Button>

          <Button
            onClick={handleSubmitTest}
            className="border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white font-semibold px-6 py-2 rounded transition-all"
          >
            Submit Test
          </Button>

          <Button
            onClick={handleNext}
            disabled={currentQuestionIndex >= selectedQuestionCount[0] - 1}
            className="border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white font-semibold px-6 py-2 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </Button>
        </div>

        <Card className="border border-gray-700 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-lg font-semibold text-white">Answer Overview</CardTitle>
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
                      relative aspect-square rounded border font-semibold text-sm transition-all
                      ${
                        isCurrent
                          ? "bg-white text-black border-white"
                          : isAnswered
                            ? "bg-green-500 text-white border-green-400 hover:bg-green-600"
                            : "bg-gray-600 text-gray-300 border-gray-500 hover:bg-gray-500"
                      }
                    `}
                  >
                    {index + 1}
                    {isFlagged && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded border border-green-400"></div>
                <span className="text-green-400 font-semibold">Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-600 rounded border border-gray-500"></div>
                <span className="text-gray-400 font-semibold">Unanswered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-red-400 font-semibold">Flagged</span>
              </div>
              <div className="text-white font-semibold">
                {testAnswers.length} / {selectedQuestionCount[0]} Completed
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
