"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Flag, CheckCircle, RotateCcw, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { getCategoryEmoji } from "@/lib/category-emojis"
import SwipeCard from "@/components/SwipeCard"

export default function ReviewPage() {
  const { questions, setQuestions, userProgress, unflagQuestion, flagQuestion } = useStore()
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showResetDialog, setShowResetDialog] = useState(false)

  useEffect(() => {
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
  }, [setQuestions])

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

  const flaggedQuestions = questions.filter((q) => userProgress.flaggedQuestions?.includes(q.id) || false)
  const completedQuestions = questions.filter((q) => userProgress.completedQuestions?.includes(q.id) || false)
  const incorrectQuestions = questions.filter((q) => userProgress.incorrectAnswers?.includes(q.id) || false)

  const selectedQuestionData = questions.find((q) => q.id === selectedQuestion)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-semibold text-white mb-4">Review Mode</h2>
          <div className="w-64 h-1 bg-gray-800 rounded overflow-hidden mx-auto">
            <div className="h-full bg-white rounded animate-pulse"></div>
          </div>
          <div className="mt-6 text-lg text-gray-300">Loading your flagged & completed questions...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button className="border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white px-6 py-2 rounded transition-all">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-semibold text-white">
              Review Mode
            </h1>
            <Badge variant="outline" className="ml-2 text-xs border-gray-700 text-gray-300">Review flagged & completed questions</Badge>
          </div>
          <Button
            onClick={handleResetProgress}
            className="border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white px-6 py-2 rounded transition-all"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset Progress
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border border-gray-700 bg-transparent">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-semibold text-white mb-1">{userProgress.xp}</div>
              <div className="text-sm text-gray-300">Total XP</div>
            </CardContent>
          </Card>

          <Card className="border border-gray-700 bg-transparent">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-semibold text-green-400 mb-1">{userProgress.correctAnswers}</div>
              <div className="text-sm text-gray-300">Correct</div>
            </CardContent>
          </Card>

          <Card className="border border-gray-700 bg-transparent">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-semibold text-white mb-1">{userProgress.maxStreak}</div>
              <div className="text-sm text-gray-300">Best Streak</div>
            </CardContent>
          </Card>

          <Card className="border border-gray-700 bg-transparent">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-semibold text-white mb-1">{userProgress.badges.length}</div>
              <div className="text-sm text-gray-300">Badges</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Question Lists */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="flagged" className="w-full ">
              <TabsList className="grid w-full grid-cols-3 bg-transparent border border-gray-700 p-2">
                <TabsTrigger
                  value="flagged"
                  className="data-[state=active]:bg-gray-900/20 data-[state=active]:text-white font-semibold py-3 transition-colors"
                >
                  FLAGGED ({flaggedQuestions.length})
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-gray-900/20 data-[state=active]:text-white font-semibold py-3 transition-colors"
                >
                  COMPLETED ({completedQuestions.length})
                </TabsTrigger>
                <TabsTrigger
                  value="incorrect"
                  className="data-[state=active]:bg-gray-900/20 data-[state=active]:text-white font-semibold py-3 transition-colors"
                >
                  INCORRECT ({incorrectQuestions.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="flagged" className="mt-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {flaggedQuestions.length === 0 ? (
                    <Card className="border border-gray-700 bg-transparent">
                      <CardContent className="p-8 text-center text-gray-400">
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
                            ? "border-red-400 bg-gray-900/20"
                            : "border-gray-700 bg-transparent hover:bg-gray-900/20"
                        }`}
                        onClick={() => setSelectedQuestion(question.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Badge className="border border-gray-700 bg-transparent text-gray-300 px-3 py-1 text-sm">
                                {question.category.toUpperCase()}
                              </Badge>
                              <span className="font-semibold text-white">Question {question.id}</span>
                            </div>
                            <Flag className="w-5 h-5 text-red-400" />
                          </div>
                          <p className="text-gray-300 mt-2 text-sm line-clamp-2">{question.question}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {completedQuestions.length === 0 ? (
                    <Card className="border border-gray-700 bg-transparent">
                      <CardContent className="p-8 text-center text-gray-400">
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
                            ? "border-green-400 bg-gray-900/20"
                            : "border-gray-700 bg-transparent hover:bg-gray-900/20"
                        }`}
                        onClick={() => setSelectedQuestion(question.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Badge className="border border-gray-700 bg-transparent text-gray-300 px-3 py-1 text-sm">
                                {question.category.toUpperCase()}
                              </Badge>
                              <span className="font-semibold text-white">Question {question.id}</span>
                            </div>
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          </div>
                          <p className="text-gray-300 mt-2 text-sm line-clamp-2">{question.question}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="incorrect" className="mt-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {incorrectQuestions.length === 0 ? (
                    <Card className="border border-gray-700 bg-transparent">
                      <CardContent className="p-8 text-center text-gray-400">
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
                            ? "border-red-400 bg-gray-900/20"
                            : "border-gray-700 bg-transparent hover:bg-gray-900/20"
                        }`}
                        onClick={() => setSelectedQuestion(question.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Badge className="border border-gray-700 bg-transparent text-gray-300 px-3 py-1 text-sm">
                                {question.category.toUpperCase()}
                              </Badge>
                              <span className="font-semibold text-white">Question {question.id}</span>
                            </div>
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                          </div>
                          <p className="text-gray-300 mt-2 text-sm line-clamp-2">{question.question}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Question Detail with SwipeCard */}
          <div className="lg:col-span-2">
            {selectedQuestionData ? (
              <div className="space-y-4">
                <SwipeCard
                  question={selectedQuestionData}
                  onSwipe={() => {}} // No swipe functionality in review mode
                  onFlag={() => handleToggleFlag(selectedQuestionData.id)}
                  isFlagged={userProgress.flaggedQuestions?.includes(selectedQuestionData.id) || false}
                  showAnswer={true} // Always show answers in review mode
                />
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
