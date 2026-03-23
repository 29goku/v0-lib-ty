"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import { useTheme, getTheme } from "@/lib/theme"
import ThemeToggle from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Flag, CheckCircle, RotateCcw, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { getCategoryEmoji } from "@/lib/category-emojis"
import SwipeCard from "@/components/SwipeCard"
import StickyMobileHeader from "@/components/StickyMobileHeader"
import LanguageSelector from "@/components/LanguageSelector"

export default function ReviewPage() {
  const { questions, setQuestions, userProgress, unflagQuestion, flagQuestion, lastTestQuestions, lastTestAnswers } = useStore()
  const { isDark } = useTheme()
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [activeTab, setActiveTab] = useState<'allTests' | 'test' | 'flagged' | 'completed' | 'incorrect'>('allTests')
  const [mounted, setMounted] = useState(false)
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null)
  const [selectedTestQuestions, setSelectedTestQuestions] = useState<any[]>([])
  const [selectedTestAnswers, setSelectedTestAnswers] = useState<any[]>([])

  const theme = getTheme(isDark)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Load questions for review with better error handling
    const loadQuestions = async () => {
      try {
        console.log("🔥 LOADING REVIEW QUESTIONS...")

        // First try to load from the store's loadQuestions method
        const storeQuestions = await useStore.getState().loadQuestions()
        if (storeQuestions && storeQuestions.length > 0) {
          console.log("🚀 Successfully loaded", storeQuestions.length, "questions from store!")
          setIsLoading(false)
          return
        }

        // Fallback: try direct fetch
        const response = await fetch("/data/questions.json")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON")
        }

        const data = await response.json()
        if (!Array.isArray(data)) {
          throw new Error("Expected an array of questions")
        }

        console.log("🚀 Successfully loaded", data.length, "questions from JSON!")
        setQuestions(data)
        setIsLoading(false)
      } catch (error) {
        console.error("❌ Failed to load questions:", error)
        setIsLoading(false)
      }
    }

    loadQuestions()
  }, [setQuestions, mounted])

  // Filter questions by status (memoized to avoid recreation)
  const flaggedQuestions = questions.filter((q) => userProgress.flaggedQuestions?.includes(q.id) || false)
  const completedQuestions = questions.filter((q) => userProgress.completedQuestions?.includes(q.id) || false)
  const incorrectQuestions = questions.filter((q) => userProgress.incorrectAnswers?.includes(q.id) || false)

  // Find selected question data - ensure it updates when selectedQuestion changes
  const selectedQuestionData = selectedQuestion ?
    (activeTab === 'test' ? lastTestQuestions.find((q) => q.id === selectedQuestion) :
     activeTab === 'allTests' ? selectedTestQuestions.find((q) => q.id === selectedQuestion) :
     questions.find((q) => q.id === selectedQuestion)) : null

  // Get filtered questions based on active tab for jump navigation
  const filteredQuestions =
    activeTab === 'allTests' ? selectedTestQuestions :
    activeTab === 'test' ? lastTestQuestions :
    activeTab === 'flagged' ? flaggedQuestions :
    activeTab === 'completed' ? completedQuestions :
    activeTab === 'incorrect' ? incorrectQuestions : []

  // Auto-select first question when tab changes or when no question is selected
  useEffect(() => {
    if (activeTab === 'allTests') {
      // For all tests tab, don't auto-select a question yet
      setSelectedQuestion(null)
    } else if (activeTab === 'test') {
      if (lastTestQuestions.length > 0 && !selectedQuestion) {
        setSelectedQuestion(lastTestQuestions[0].id)
      }
    } else if (activeTab === 'flagged') {
      if (flaggedQuestions.length > 0 && !selectedQuestion) {
        setSelectedQuestion(flaggedQuestions[0].id)
      }
    } else if (activeTab === 'completed') {
      if (completedQuestions.length > 0 && !selectedQuestion) {
        setSelectedQuestion(completedQuestions[0].id)
      }
    } else if (activeTab === 'incorrect') {
      if (incorrectQuestions.length > 0 && !selectedQuestion) {
        setSelectedQuestion(incorrectQuestions[0].id)
      }
    } else {
      setSelectedQuestion(null)
    }
  }, [activeTab])

  const handleReadAloud = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "de-DE"
      speechSynthesis.speak(utterance)
    }
  }

  const handleToggleFlag = (questionId: string) => {
    if (userProgress.flaggedQuestions.includes(questionId)) {
      unflagQuestion(questionId)
    } else {
      flagQuestion(questionId)
    }
  }

  const handleResetProgress = () => {
    setShowResetDialog(true)
  }

  const confirmReset = () => {
    useStore.getState().resetProgress()
    setShowResetDialog(false)
    // Force a page reload to ensure all state is cleared
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  if (!mounted) {
    return null
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.bg}`}>
        <div className="text-center">
          <h2 className={`text-4xl font-semibold mb-4 ${theme.text}`}>Review Mode</h2>
          <div className={`w-64 h-1 rounded overflow-hidden mx-auto ${isDark ? 'bg-gray-800' : 'bg-gray-300'}`}>
            <div className="h-full rounded animate-pulse" style={{ background: isDark ? 'white' : '#000' }}></div>
          </div>
          <div className={`mt-6 text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Loading your flagged & completed questions...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text}`}>
      <StickyMobileHeader
        title="Review Mode"
        subtitle={`${flaggedQuestions.length + completedQuestions.length + incorrectQuestions.length} questions`}
        showBackButton={true}
        backHref="/"
      />
      <div className="container mx-auto px-4 py-8">
        {/* Header - Desktop Only */}
        <div className="hidden sm:flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button className={`border font-semibold px-6 py-2 transition-all ${isDark ? 'border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white' : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900'}`}>
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className={`text-3xl md:text-4xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Review Mode
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSelector />
            <Button
              onClick={handleResetProgress}
              className={`border font-semibold px-6 py-2 rounded transition-all ${isDark ? 'border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white' : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900'}`}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset Progress
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className={`border ${isDark ? 'border-gray-700 bg-transparent' : 'border-gray-200 bg-gray-50'}`}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{userProgress.xp}</div>
              <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Total XP</div>
            </CardContent>
          </Card>

          <Card className={`border ${isDark ? 'border-gray-700 bg-transparent' : 'border-gray-200 bg-gray-50'}`}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-semibold mb-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}>{userProgress.correctAnswers}</div>
              <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Correct</div>
            </CardContent>
          </Card>

          <Card className={`border ${isDark ? 'border-gray-700 bg-transparent' : 'border-gray-200 bg-gray-50'}`}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{userProgress.maxStreak}</div>
              <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Best Streak</div>
            </CardContent>
          </Card>

          <Card className={`border ${isDark ? 'border-gray-700 bg-transparent' : 'border-gray-200 bg-gray-50'}`}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{userProgress.badges.length}</div>
              <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Badges</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Question Lists */}
          <div className="lg:col-span-3">
            {/* Custom Tab Navigation */}
            <div className={`grid grid-cols-5 w-full border rounded-lg overflow-hidden ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
              {['allTests', 'test', 'flagged', 'completed', 'incorrect'].map((tab, idx) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`py-3 px-2 font-semibold text-center text-sm transition-all ${
                    activeTab === tab
                      ? isDark ? 'bg-gray-900/20 text-white' : 'bg-gray-200 text-gray-900'
                      : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                  } ${idx < 4 ? isDark ? 'border-r border-gray-700' : 'border-r border-gray-300' : ''}`}
                >
                  {tab === 'allTests' && `ALL TESTS (${userProgress.testAttempts?.length || 0})`}
                  {tab === 'test' && `RECENT (${lastTestQuestions.length})`}
                  {tab === 'flagged' && `FLAGGED (${flaggedQuestions.length})`}
                  {tab === 'completed' && `COMPLETED (${completedQuestions.length})`}
                  {tab === 'incorrect' && `INCORRECT (${incorrectQuestions.length})`}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === 'allTests' && (
                <>
                  {selectedTestId ? (
                    // Show questions list when a test is selected
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                      {selectedTestQuestions.length === 0 ? (
                        <Card className={`border ${isDark ? 'border-gray-700 bg-transparent' : 'border-gray-200 bg-gray-50'}`}>
                          <CardContent className={`p-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <p className="text-sm">No questions in this test</p>
                          </CardContent>
                        </Card>
                      ) : (
                        selectedTestQuestions.map((question) => {
                          const testAnswer = selectedTestAnswers.find((a) => a.questionId === question.id)
                          const isCorrect = testAnswer?.correct
                          return (
                            <Card
                              key={question.id}
                              onClick={() => setSelectedQuestion(question.id)}
                              className={`border cursor-pointer transition-all ${
                                selectedQuestion === question.id
                                  ? isDark ? 'bg-gray-900/50 border-blue-500' : 'bg-blue-50 border-blue-400'
                                  : isDark ? 'border-gray-700 hover:bg-gray-900/30' : 'border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              <CardContent className="p-4 flex items-center gap-3">
                                <div className="flex-1">
                                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Q {selectedTestQuestions.indexOf(question) + 1}</p>
                                  <p className={`text-sm line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{question.question}</p>
                                </div>
                                {isCorrect ? (
                                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                ) : (
                                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                )}
                              </CardContent>
                            </Card>
                          )
                        })
                      )}
                    </div>
                  ) : (
                    // Show test list when no test is selected
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                      {!userProgress.testAttempts || userProgress.testAttempts.length === 0 ? (
                        <Card className={`border ${isDark ? 'border-gray-700 bg-transparent' : 'border-gray-200 bg-gray-50'}`}>
                          <CardContent className={`p-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <p className="text-xl font-semibold">No test attempts yet!</p>
                            <p className="text-sm mt-2">Take a test to see your history here.</p>
                          </CardContent>
                        </Card>
                      ) : (
                        [...(userProgress.testAttempts || [])].reverse().map((attempt) => {
                          const percentage = attempt.totalQuestions > 0 ? Math.round((attempt.score / attempt.totalQuestions) * 100) : 0
                          const testDate = new Date(attempt.date)
                          const displayDate = testDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
                          const displayTime = testDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                          const isPassed = percentage >= 52

                          return (
                            <Card
                              key={attempt.id}
                              className={`border cursor-pointer transition-colors ${
                                selectedTestId === attempt.id
                                  ? isDark ? 'border-blue-400 bg-blue-900/20' : 'border-blue-500 bg-blue-50'
                                  : isDark ? 'border-gray-700 bg-transparent hover:bg-gray-900/20' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                              }`}
                              onClick={() => {
                                setSelectedTestId(attempt.id)
                                setSelectedTestQuestions(attempt.questions || [])
                                setSelectedTestAnswers(attempt.answers || [])
                                setSelectedQuestion(attempt.questions?.[0]?.id || null)
                              }}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <span className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {displayDate} at {displayTime}
                                      </span>
                                      {attempt.state && (
                                        <Badge className={`border px-2 py-1 text-xs ${isDark ? 'border-gray-700 bg-transparent text-gray-300' : 'border-gray-300 bg-gray-100 text-gray-700'}`}>
                                          {attempt.state}
                                        </Badge>
                                      )}
                                    </div>
                                    <div className={`text-lg font-bold ${isPassed ? isDark ? 'text-green-400' : 'text-green-600' : isDark ? 'text-red-400' : 'text-red-600'}`}>
                                      {attempt.score}/{attempt.totalQuestions} ({percentage}%)
                                    </div>
                                  </div>
                                  <div className={`text-right`}>
                                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                      {Math.round(attempt.timeSpent / 1000 / 60)}m
                                    </div>
                                    {isPassed ? (
                                      <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                                    ) : (
                                      <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })
                      )}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'test' && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {lastTestQuestions.length === 0 ? (
                    <Card className={`border ${isDark ? 'border-gray-700 bg-transparent' : 'border-gray-200 bg-gray-50'}`}>
                      <CardContent className={`p-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <p className="text-xl font-semibold">No test attempt to review!</p>
                        <p className="text-sm mt-2">Take a test first to review your answers here.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    lastTestQuestions.map((question) => {
                      const testAnswer = lastTestAnswers.find((a) => a.questionId === question.id)
                      const isCorrect = testAnswer?.correct
                      return (
                        <Card
                          key={question.id}
                          onClick={() => setSelectedQuestion(question.id)}
                          className={`border cursor-pointer transition-all ${
                            selectedQuestion === question.id
                              ? isDark ? 'bg-gray-900/50 border-blue-500' : 'bg-blue-50 border-blue-400'
                              : isDark ? 'border-gray-700 hover:bg-gray-900/30' : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <CardContent className="p-4 flex items-center gap-3">
                            <div className="flex-1">
                              <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {question.id}
                              </p>
                              <p className={`text-sm mt-1 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {question.question}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              {isCorrect ? (
                                <CheckCircle className="w-6 h-6 text-green-500" />
                              ) : (
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </div>
              )}
              {activeTab === 'flagged' && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {flaggedQuestions.length === 0 ? (
                    <Card className={`border ${isDark ? 'border-gray-700 bg-transparent' : 'border-gray-200 bg-gray-50'}`}>
                      <CardContent className={`p-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <p className="text-xl font-semibold">No flagged questions yet!</p>
                        <p className="text-sm mt-2">Flag questions during practice to review them here.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    flaggedQuestions.map((question) => (
                      <Card
                        key={question.id}
                        className={`border cursor-pointer transition-colors ${
                          selectedQuestion === question.id
                            ? isDark ? "border-red-400 bg-gray-900/20" : "border-red-500 bg-red-50"
                            : isDark ? "border-gray-700 bg-transparent hover:bg-gray-900/20" : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedQuestion(question.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Badge className={`border px-3 py-1 text-sm ${isDark ? 'border-gray-700 bg-transparent text-gray-300' : 'border-gray-300 bg-gray-100 text-gray-700'}`}>
                                {question.category.toUpperCase()}
                              </Badge>
                              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Question {question.id}</span>
                            </div>
                            <Flag className="w-5 h-5 text-red-400" />
                          </div>
                          <p className={`mt-2 text-sm line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{question.question}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'completed' && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {completedQuestions.length === 0 ? (
                    <Card className={`border ${isDark ? 'border-gray-700 bg-transparent' : 'border-gray-200 bg-gray-50'}`}>
                      <CardContent className={`p-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <p className="text-xl font-semibold">No completed questions yet!</p>
                        <p className="text-sm mt-2">Complete questions during practice to see them here.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    completedQuestions.map((question) => (
                      <Card
                        key={question.id}
                        className={`border cursor-pointer transition-colors ${
                          selectedQuestion === question.id
                            ? isDark ? "border-green-400 bg-gray-900/20" : "border-green-500 bg-green-50"
                            : isDark ? "border-gray-700 bg-transparent hover:bg-gray-900/20" : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedQuestion(question.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Badge className={`border px-3 py-1 text-sm ${isDark ? 'border-gray-700 bg-transparent text-gray-300' : 'border-gray-300 bg-gray-100 text-gray-700'}`}>
                                {question.category.toUpperCase()}
                              </Badge>
                              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Question {question.id}</span>
                            </div>
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          </div>
                          <p className={`mt-2 text-sm line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{question.question}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'incorrect' && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {incorrectQuestions.length === 0 ? (
                    <Card className={`border ${isDark ? 'border-gray-700 bg-transparent' : 'border-gray-200 bg-gray-50'}`}>
                      <CardContent className={`p-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <p className="text-xl font-semibold">No incorrect answers yet!</p>
                        <p className="text-sm mt-2">Questions you answer incorrectly will appear here.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    incorrectQuestions.map((question) => (
                      <Card
                        key={question.id}
                        className={`border cursor-pointer transition-colors ${
                          selectedQuestion === question.id
                            ? isDark ? "border-red-400 bg-gray-900/20" : "border-red-500 bg-red-50"
                            : isDark ? "border-gray-700 bg-transparent hover:bg-gray-900/20" : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedQuestion(question.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Badge className={`border px-3 py-1 text-sm ${isDark ? 'border-gray-700 bg-transparent text-gray-300' : 'border-gray-300 bg-gray-100 text-gray-700'}`}>
                                {question.category.toUpperCase()}
                              </Badge>
                              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Question {question.id}</span>
                            </div>
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                          </div>
                          <p className={`mt-2 text-sm line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{question.question}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Question Detail with SwipeCard */}
          <div className="lg:col-span-2">
            {selectedQuestionData ? (
              <div className="space-y-4">
                {(activeTab === 'test' && lastTestAnswers.length > 0) || (activeTab === 'allTests' && selectedTestAnswers.length > 0) ? (
                  <>
                    <SwipeCard
                      question={selectedQuestionData}
                      onSwipe={() => {}} // No swipe functionality in review mode
                      onFlag={() => handleToggleFlag(selectedQuestionData.id)}
                      isFlagged={userProgress.flaggedQuestions?.includes(selectedQuestionData.id) || false}
                      showAnswer={true} // Always show answers in review mode
                      externalSelectedAnswer={
                        activeTab === 'allTests'
                          ? selectedTestAnswers.find((a) => a.questionId === selectedQuestionData.id)?.selectedIndex ?? null
                          : lastTestAnswers.find((a) => a.questionId === selectedQuestionData.id)?.selectedIndex ?? null
                      }
                      totalQuestions={filteredQuestions.length}
                      onJumpToQuestion={(index) => setSelectedQuestion(filteredQuestions[index]?.id)}
                    />
                    {/* Test feedback badge */}
                    {lastTestAnswers.find((a) => a.questionId === selectedQuestionData.id) && (
                      <Card className={`border ${
                        lastTestAnswers.find((a) => a.questionId === selectedQuestionData.id)?.correct
                          ? isDark ? 'border-green-500/50 bg-green-500/10' : 'border-green-300 bg-green-50'
                          : isDark ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                      }`}>
                        <CardContent className={`p-4 text-center font-semibold ${
                          lastTestAnswers.find((a) => a.questionId === selectedQuestionData.id)?.correct
                            ? isDark ? 'text-green-400' : 'text-green-700'
                            : isDark ? 'text-red-400' : 'text-red-700'
                        }`}>
                          {lastTestAnswers.find((a) => a.questionId === selectedQuestionData.id)?.correct
                            ? '✓ CORRECT'
                            : '✗ INCORRECT'}
                        </CardContent>
                      </Card>
                    )}
                  </>
                ) : (
                  <SwipeCard
                    question={selectedQuestionData}
                    onSwipe={() => {}} // No swipe functionality in review mode
                    onFlag={() => handleToggleFlag(selectedQuestionData.id)}
                    isFlagged={userProgress.flaggedQuestions?.includes(selectedQuestionData.id) || false}
                    showAnswer={true} // Always show answers in review mode
                    totalQuestions={filteredQuestions.length}
                    onJumpToQuestion={(index) => setSelectedQuestion(filteredQuestions[index]?.id)}
                  />
                )}
              </div>
            ) : (
              <Card className="border border-gray-700 bg-transparent">
                <CardContent className="p-12 text-center text-gray-400">
                  <h3 className="text-3xl font-semibold mb-4 text-white">SELECT A QUESTION</h3>
                  <p className="text-xl">Choose a question from the lists to review it here with full explanations!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Reset Confirmation Dialog */}
        <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <DialogContent className="bg-black border border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl font-semibold text-white">
                <AlertTriangle className="w-8 h-8 text-red-400" />
                Reset All Progress?
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-lg mt-4">
                This will permanently delete:
                <ul className="list-disc list-inside mt-3 space-y-2 text-left">
                  <li>All your XP and achievements</li>
                  <li>Your current streak and max streak</li>
                  <li>All badges earned</li>
                  <li>Flagged questions</li>
                  <li>All answered questions history</li>
                </ul>
                <p className="mt-4 font-semibold text-red-400">This action cannot be undone!</p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-3 sm:gap-2 mt-6">
              <Button
                onClick={() => setShowResetDialog(false)}
                className="border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white px-6 py-3 transition-colors"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmReset}
                className="border border-red-400 bg-transparent hover:bg-red-400/20 text-red-400 hover:text-red-300 px-6 py-3 transition-colors"
              >
                Yes, Reset Everything
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
