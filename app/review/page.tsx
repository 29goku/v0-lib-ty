"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowLeft, Flag, CheckCircle, RotateCcw } from "lucide-react"
import Link from "next/link"
import { getCategoryEmoji } from "@/lib/category-emojis"
import SwipeCard from "@/components/SwipeCard"

export default function ReviewPage() {
  const { questions, setQuestions, userProgress, unflagQuestion, flagQuestion } = useStore()
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      useStore.getState().resetProgress()
    }
  }

  const flaggedQuestions = questions.filter((q) => userProgress.flaggedQuestions?.includes(q.id) || false)
  const completedQuestions = questions.filter((q) => userProgress.completedQuestions?.includes(q.id) || false)
  const incorrectQuestions = questions.filter((q) => userProgress.incorrectAnswers?.includes(q.id) || false)

  const selectedQuestionData = questions.find((q) => q.id === selectedQuestion)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-black flex items-center justify-center overflow-hidden relative">
        {/* Animated background and floating emojis */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-900 via-purple-900 to-black"></div>
          <div className="absolute top-10 left-10 text-6xl animate-bounce" style={{ animationDelay: '0s' }}>🎯</div>
          <div className="absolute top-32 right-20 text-5xl animate-bounce" style={{ animationDelay: '1s' }}>🔥</div>
          <div className="absolute bottom-32 left-32 text-7xl animate-bounce" style={{ animationDelay: '2s' }}>🏆</div>
          <div className="absolute bottom-20 right-20 text-5xl animate-bounce" style={{ animationDelay: '3s' }}>✨</div>
        </div>
        <div className="text-center z-10">
          <div className="text-8xl mb-8 animate-bounce">🎯</div>
          <h2 className="text-5xl font-black bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x mb-4">REVIEW MODE</h2>
          <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full animate-pulse"></div>
          </div>
          <div className="mt-6 text-xl text-pink-200 animate-pulse">Loading your flagged & completed questions...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-black text-white overflow-hidden relative">
      {/* Animated background and floating emojis */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900 via-purple-900 to-black"></div>
        <div className="absolute top-10 left-10 text-6xl animate-bounce" style={{ animationDelay: '0s' }}>🎯</div>
        <div className="absolute top-32 right-20 text-5xl animate-bounce" style={{ animationDelay: '1s' }}>🔥</div>
        <div className="absolute bottom-32 left-32 text-7xl animate-bounce" style={{ animationDelay: '2s' }}>🏆</div>
        <div className="absolute bottom-20 right-20 text-5xl animate-bounce" style={{ animationDelay: '3s' }}>✨</div>
      </div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header with MAXIMUM ENERGY & mobile friendly */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <ArrowLeft className="w-5 h-5 mr-2" />
                BACK TO HOME
              </Button>
            </Link>
            <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
              🎯 REVIEW MODE
            </h1>
            <Badge variant="outline" className="ml-2 text-xs bg-pink-700/30 border-pink-400 text-pink-200 shadow-lg animate-pulse">Review flagged & completed questions</Badge>
          </div>
          <Button
            onClick={handleResetProgress}
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white border-0 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 animate-bounce"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            RESET PROGRESS
          </Button>
        </div>
        {/* Mobile UI improvements */}
        <style jsx global>{`
          @media (max-width: 640px) {
            .flex.flex-col.sm\:flex-row.items-center.justify-between.mb-8.gap-4 {
              flex-direction: column;
              gap: 1rem;
            }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 3s ease infinite;
          }
          @keyframes gradient-x {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>

        {/* Stats Overview with INSANE ENERGY */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-cyan-500/50 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
            <CardContent className="p-6 text-center relative z-10">
              <div className="text-4xl mb-2 group-hover:animate-bounce">⚡</div>
              <div className="text-3xl font-black text-cyan-400 mb-1">{userProgress.xp}</div>
              <div className="text-sm text-gray-300 uppercase tracking-wider font-bold">TOTAL XP</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-500/50 bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
            <CardContent className="p-6 text-center relative z-10">
              <div className="text-4xl mb-2 group-hover:animate-bounce">🎯</div>
              <div className="text-3xl font-black text-green-400 mb-1">{userProgress.correctAnswers}</div>
              <div className="text-sm text-gray-300 uppercase tracking-wider font-bold">CORRECT</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-500/50 bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
            <CardContent className="p-6 text-center relative z-10">
              <div className="text-4xl mb-2 group-hover:animate-bounce">🔥</div>
              <div className="text-3xl font-black text-orange-400 mb-1">{userProgress.maxStreak}</div>
              <div className="text-sm text-gray-300 uppercase tracking-wider font-bold">BEST STREAK</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-500/50 bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
            <CardContent className="p-6 text-center relative z-10">
              <div className="text-4xl mb-2 group-hover:animate-bounce">🏆</div>
              <div className="text-3xl font-black text-purple-400 mb-1">{userProgress.badges.length}</div>
              <div className="text-sm text-gray-300 uppercase tracking-wider font-bold">BADGES</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Question Lists */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="flagged" className="w-full ">
              <TabsList className="grid w-full h-full grid-cols-3 bg-black/50 border-2 border-purple-500/50 rounded-xl p-2">
                <TabsTrigger
                  value="flagged"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white font-bold text-lg py-3 rounded-lg transition-all"
                >
                  🚩 FLAGGED ({flaggedQuestions.length})
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white font-bold text-lg py-3 rounded-lg transition-all"
                >
                  ✅ COMPLETED ({completedQuestions.length})
                </TabsTrigger>
                <TabsTrigger
                  value="incorrect"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white font-bold text-lg py-3 rounded-lg transition-all"
                >
                  ❌ INCORRECT ({incorrectQuestions.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="flagged" className="mt-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {flaggedQuestions.length === 0 ? (
                    <Card className="border-2 border-gray-600 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm">
                      <CardContent className="p-8 text-center text-gray-400">
                        <div className="text-6xl mb-4">🎯</div>
                        <p className="text-xl font-bold">No flagged questions yet!</p>
                        <p className="text-sm mt-2">Flag questions during practice to review them here.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    flaggedQuestions.map((question) => (
                      <Card
                        key={question.id}
                        className={`border-2 cursor-pointer transition-all transform hover:scale-105 ${
                          selectedQuestion === question.id
                            ? "border-red-400 bg-gradient-to-r from-red-900/50 to-pink-900/50 shadow-lg shadow-red-500/25"
                            : "border-red-500/50 bg-gradient-to-r from-red-900/30 to-black/50 hover:border-red-400"
                        }`}
                        onClick={() => setSelectedQuestion(question.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 px-3 py-1 text-sm font-bold">
                                {getCategoryEmoji(question.category)} {question.category.toUpperCase()}
                              </Badge>
                              <span className="font-bold text-white">Question {question.id}</span>
                            </div>
                            <Flag className="w-5 h-5 text-red-400" />
                          </div>
                          <p className="text-white mt-2 text-sm line-clamp-2">{question.question}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {completedQuestions.length === 0 ? (
                    <Card className="border-2 border-gray-600 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm">
                      <CardContent className="p-8 text-center text-gray-400">
                        <div className="text-6xl mb-4">🎯</div>
                        <p className="text-xl font-bold">No completed questions yet!</p>
                        <p className="text-sm mt-2">Complete questions during practice to see them here.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    completedQuestions.map((question) => (
                      <Card
                        key={question.id}
                        className={`border-2 cursor-pointer transition-all transform hover:scale-105 ${
                          selectedQuestion === question.id
                            ? "border-green-400 bg-gradient-to-r from-green-900/50 to-emerald-900/50 shadow-lg shadow-green-500/25"
                            : "border-green-500/50 bg-gradient-to-r from-green-900/30 to-black/50 hover:border-green-400"
                        }`}
                        onClick={() => setSelectedQuestion(question.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 px-3 py-1 text-sm font-bold">
                                {getCategoryEmoji(question.category)} {question.category.toUpperCase()}
                              </Badge>
                              <span className="font-bold text-white">Question {question.id}</span>
                            </div>
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          </div>
                          <p className="text-white mt-2 text-sm line-clamp-2">{question.question}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="incorrect" className="mt-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {incorrectQuestions.length === 0 ? (
                    <Card className="border-2 border-gray-600 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm">
                      <CardContent className="p-8 text-center text-gray-400">
                        <div className="text-6xl mb-4">🎯</div>
                        <p className="text-xl font-bold">No incorrect answers yet!</p>
                        <p className="text-sm mt-2">Questions you answer incorrectly will appear here.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    incorrectQuestions.map((question) => (
                      <Card
                        key={question.id}
                        className={`border-2 cursor-pointer transition-all transform hover:scale-105 ${
                          selectedQuestion === question.id
                            ? "border-orange-400 bg-gradient-to-r from-orange-900/50 to-red-900/50 shadow-lg shadow-orange-500/25"
                            : "border-orange-500/50 bg-gradient-to-r from-orange-900/30 to-black/50 hover:border-orange-400"
                        }`}
                        onClick={() => setSelectedQuestion(question.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 px-3 py-1 text-sm font-bold">
                                {getCategoryEmoji(question.category)} {question.category.toUpperCase()}
                              </Badge>
                              <span className="font-bold text-white">Question {question.id}</span>
                            </div>
                            <span className="text-2xl">❌</span>
                          </div>
                          <p className="text-white mt-2 text-sm line-clamp-2">{question.question}</p>
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
              <Card className="border-2 border-gray-600 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm">
                <CardContent className="p-12 text-center text-gray-400">
                  <div className="text-center mb-8">
                    <div className="text-8xl">🎯</div>
                  </div>
                  <h3 className="text-3xl font-black mb-4 text-white">SELECT A QUESTION</h3>
                  <p className="text-xl">Choose a question from the lists to review it here with full explanations!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
