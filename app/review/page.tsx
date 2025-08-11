"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowLeft, Flag, CheckCircle, RotateCcw, Volume2, Languages } from "lucide-react"
import Link from "next/link"
import { getCategoryEmoji } from "@/lib/category-emojis"

export default function ReviewPage() {
  const { questions, setQuestions, userProgress, unflagQuestion, flagQuestion } = useStore()
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [isTranslated, setIsTranslated] = useState(false)
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

        console.log("🚀 Successfully loaded", data.length, "questions for review!")
        setQuestions(data)
      } catch (err) {
        console.error("Failed to load questions:", err)

        // Fallback: create some sample questions if loading fails
        const fallbackQuestions = [
          {
            id: "q001",
            category: "Politics",
            question: "What is the capital of Germany?",
            options: ["Berlin", "Munich", "Frankfurt", "Hamburg"],
            answerIndex: 0,
            explanation: "Berlin has been the federal capital of Germany since reunification in 1990.",
          },
          {
            id: "q002",
            category: "History",
            question: "When was the Berlin Wall built?",
            options: ["1959", "1961", "1963", "1965"],
            answerIndex: 1,
            explanation: "The Berlin Wall was built on August 13, 1961, to separate East and West Berlin.",
          },
          {
            id: "q003",
            category: "Politics",
            question: "How many federal states (Bundesländer) does Germany have?",
            options: ["14", "15", "16", "17"],
            answerIndex: 2,
            explanation: "Germany consists of 16 federal states (Bundesländer).",
          },
        ]
        console.log("💪 Using fallback questions for review")
        setQuestions(fallbackQuestions)
      } finally {
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

  const flaggedQuestions = questions.filter((q) => userProgress.flaggedQuestions.includes(q.id))
  const completedQuestions = questions.filter((q) => userProgress.completedQuestions.includes(q.id))
  const selectedQuestionData = selectedQuestion ? questions.find((q) => q.id === selectedQuestion) : null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🔄</div>
          <h2 className="text-2xl font-bold">Loading Questions...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* INSANE animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black"></div>

        {/* Floating elements */}
        <div
          className="absolute top-10 left-10 w-4 h-4 bg-yellow-400 rotate-45 animate-spin"
          style={{ animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-32 right-20 w-6 h-6 bg-pink-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-40 left-32 w-8 h-8 bg-green-400 rotate-45 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 right-40 w-3 h-3 bg-cyan-400 animate-ping"
          style={{ animationDelay: "1.5s" }}
        ></div>

        {/* Moving orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Floating emojis */}
        <div className="absolute top-20 left-20 text-3xl animate-bounce" style={{ animationDelay: "0s" }}>
          🧠
        </div>
        <div className="absolute top-40 right-32 text-2xl animate-bounce" style={{ animationDelay: "1s" }}>
          📚
        </div>
        <div className="absolute bottom-32 left-32 text-4xl animate-bounce" style={{ animationDelay: "2s" }}>
          🎯
        </div>
        <div className="absolute bottom-20 right-20 text-2xl animate-bounce" style={{ animationDelay: "3s" }}>
          💎
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with MAXIMUM ENERGY */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-black px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 border-0">
              <ArrowLeft className="w-5 h-5 mr-2" />🏠 BACK
            </Button>
          </Link>

          <div className="text-center">
            <h1 className="text-5xl font-black mb-2">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent animate-pulse">
                🧠 REVIEW MODE 🧠
              </span>
            </h1>
            <div className="text-lg text-gray-300 animate-bounce">MASTER YOUR MISTAKES! 📚</div>
          </div>

          <div></div>
        </div>

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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Question Lists with GAMING VIBE */}
          <div className="lg:col-span-1">
            <Tabs defaultValue="flagged" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-2 border-purple-500/50">
                <TabsTrigger
                  value="flagged"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-black font-black"
                >
                  <Flag className="w-4 h-4 mr-2" />🚩 FLAGGED ({flaggedQuestions.length})
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-black font-black"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />✅ COMPLETED ({completedQuestions.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="flagged" className="space-y-3 max-h-96 overflow-y-auto">
                {flaggedQuestions.length === 0 ? (
                  <Card className="border-2 border-gray-600 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm">
                    <CardContent className="p-6 text-center text-gray-400">
                      <div className="text-4xl mb-4">🎯</div>
                      <p className="font-bold">NO FLAGGED QUESTIONS YET!</p>
                      <p className="text-sm mt-2">Flag difficult questions while practicing</p>
                    </CardContent>
                  </Card>
                ) : (
                  flaggedQuestions.map((question) => (
                    <Card
                      key={question.id}
                      className={`cursor-pointer transition-all duration-300 border-2 backdrop-blur-sm hover:scale-105 ${
                        selectedQuestion === question.id
                          ? "border-yellow-400 bg-gradient-to-br from-yellow-900/50 to-orange-900/50 shadow-lg shadow-yellow-500/25"
                          : "border-gray-600 bg-gradient-to-br from-gray-900/50 to-black/50 hover:border-yellow-500/50"
                      }`}
                      onClick={() => setSelectedQuestion(question.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Badge className="mb-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 font-black">
                              {getCategoryEmoji(question.category)} {question.category.toUpperCase()}
                            </Badge>
                            <p className="text-sm line-clamp-2 font-semibold">{question.question}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-yellow-500/20 border-2 border-yellow-500/50 rounded-full p-2 transition-all transform hover:scale-110"
                            onClick={(e) => {
                              e.stopPropagation()
                              unflagQuestion(question.id)
                            }}
                          >
                            <Flag className="w-4 h-4 text-yellow-400" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-3 max-h-96 overflow-y-auto">
                {completedQuestions.length === 0 ? (
                  <Card className="border-2 border-gray-600 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm">
                    <CardContent className="p-6 text-center text-gray-400">
                      <div className="text-4xl mb-4">🎮</div>
                      <p className="font-bold">NO COMPLETED QUESTIONS YET!</p>
                      <p className="text-sm mt-2">Start practicing to see your progress</p>
                    </CardContent>
                  </Card>
                ) : (
                  completedQuestions.map((question) => (
                    <Card
                      key={question.id}
                      className={`cursor-pointer transition-all duration-300 border-2 backdrop-blur-sm hover:scale-105 ${
                        selectedQuestion === question.id
                          ? "border-green-400 bg-gradient-to-br from-green-900/50 to-emerald-900/50 shadow-lg shadow-green-500/25"
                          : "border-gray-600 bg-gradient-to-br from-gray-900/50 to-black/50 hover:border-green-500/50"
                      }`}
                      onClick={() => setSelectedQuestion(question.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Badge className="mb-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 font-black">
                              {getCategoryEmoji(question.category)} {question.category.toUpperCase()}
                            </Badge>
                            <p className="text-sm line-clamp-2 font-semibold">{question.question}</p>
                          </div>
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1 animate-pulse" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Question Detail with MAXIMUM VIBE */}
          <div className="lg:col-span-2">
            {selectedQuestionData ? (
              <Card className="border-2 border-purple-500/50 bg-gradient-to-br from-purple-900/30 to-black/50 backdrop-blur-sm shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-pulse"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 px-4 py-2 text-lg font-black">
                      {getCategoryEmoji(selectedQuestionData.category)} {selectedQuestionData.category.toUpperCase()}
                    </Badge>
                    <div className="flex space-x-3">
                      {/* Action buttons */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-blue-500/20 border-2 border-blue-500/50 rounded-full p-2 transition-all transform hover:scale-110"
                        onClick={() => setIsTranslated(!isTranslated)}
                      >
                        <Languages className="w-4 h-4 text-blue-400" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-green-500/20 border-2 border-green-500/50 rounded-full p-2 transition-all transform hover:scale-110"
                        onClick={() => handleReadAloud(selectedQuestionData.question)}
                      >
                        <Volume2 className="w-4 h-4 text-green-400" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className={`border-2 rounded-full p-2 transition-all transform hover:scale-110 ${
                          userProgress.flaggedQuestions.includes(selectedQuestionData.id)
                            ? "bg-yellow-500/20 border-yellow-500/50 hover:bg-yellow-500/30"
                            : "hover:bg-yellow-500/20 border-yellow-500/50"
                        }`}
                        onClick={() => {
                          if (userProgress.flaggedQuestions.includes(selectedQuestionData.id)) {
                            unflagQuestion(selectedQuestionData.id)
                          } else {
                            flagQuestion(selectedQuestionData.id)
                          }
                        }}
                      >
                        <Flag
                          className={`w-4 h-4 ${
                            userProgress.flaggedQuestions.includes(selectedQuestionData.id)
                              ? "text-yellow-400 fill-current"
                              : "text-yellow-400"
                          }`}
                        />
                      </Button>

                      {userProgress.flaggedQuestions.includes(selectedQuestionData.id) && (
                        <div className="flex items-center space-x-1 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/50">
                          <Flag className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 font-bold text-sm">FLAGGED</span>
                        </div>
                      )}
                      {userProgress.completedQuestions.includes(selectedQuestionData.id) && (
                        <div className="flex items-center space-x-1 bg-green-500/20 px-3 py-1 rounded-full border border-green-500/50">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 font-bold text-sm">COMPLETED</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-white leading-relaxed">
                    {isTranslated ? "English translation would appear here" : selectedQuestionData.question}
                  </CardTitle>
                  {selectedQuestionData.image && (
                    <div className="mt-4">
                      <img
                        src={selectedQuestionData.image || "/placeholder.svg"}
                        alt="Question image"
                        className="w-full max-w-md mx-auto rounded-lg border-2 border-purple-500/30"
                      />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6 relative z-10">
                  {selectedQuestionData.options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                        index === selectedQuestionData.answerIndex
                          ? "bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-400 text-green-300 shadow-lg shadow-green-500/25"
                          : "bg-gradient-to-r from-gray-900/50 to-black/50 border-gray-600 text-gray-300"
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-4 font-black text-2xl w-8 text-yellow-400">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="flex-1 font-semibold">{option}</span>
                        {index === selectedQuestionData.answerIndex && (
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                            <span className="text-2xl animate-bounce">🎉</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="mt-8 p-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl border-2 border-blue-500/50 relative overflow-hidden">
                    <div className="absolute top-2 right-2 text-2xl animate-bounce">💡</div>
                    <div className="flex items-start gap-4">
                      <div className="text-3xl animate-pulse">🧠</div>
                      <div>
                        <h4 className="font-black text-yellow-400 mb-3 text-xl">💡 EXPLANATION</h4>
                        <p className="text-blue-100 leading-relaxed text-lg font-semibold">
                          {selectedQuestionData.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-gray-600 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm">
                <CardContent className="p-12 text-center text-gray-400">
                  <div className="text-center mb-8">
                    <div className="text-8xl">🎯</div>
                  </div>
                  <h3 className="text-3xl font-black mb-4 text-white">SELECT A QUESTION</h3>
                  <p className="text-xl">Choose a question from the list to review it in detail</p>
                  <div className="mt-6 text-6xl animate-pulse">📚</div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Quick Actions with MAXIMUM ENERGY */}
        <div className="mt-12 flex justify-center space-x-6">
          <Link href="/practice">
            <Button className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-black font-black px-8 py-4 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-110 border-0">
              <RotateCcw className="w-6 h-6 mr-3" />🎮 PRACTICE MORE
            </Button>
          </Link>
          <Link href="/test">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black px-8 py-4 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-110 border-0">
              ⚡ TAKE TEST
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
