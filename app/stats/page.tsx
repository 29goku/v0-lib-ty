"use client"

import { useState, useEffect } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, TrendingUp, Flame, Target, Award, BarChart3 } from "lucide-react"
import Link from "next/link"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default function StatsPage() {
  const { userProgress, questions } = useStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const accuracy = userProgress.questionsAnswered > 0
    ? Math.round((userProgress.correctAnswers / userProgress.questionsAnswered) * 100)
    : 0

  // Category performance
  const categoryData = Object.entries(userProgress.categoryStats || {}).map(([category, stats]) => ({
    category,
    accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    correct: stats.correct,
    total: stats.total,
  })).sort((a, b) => b.accuracy - a.accuracy)

  const weakestCategories = categoryData.filter(c => c.accuracy < 60).slice(0, 3)
  const strongestCategories = categoryData.filter(c => c.accuracy >= 80).slice(0, 3)

  // Daily stats
  const dailyData = Object.entries(userProgress.dailyStats || {})
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .slice(-10)
    .map(([date, stats]) => ({
      date: new Date(date).toLocaleDateString("de-DE", { month: "short", day: "numeric" }),
      accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      xp: stats.xp,
    }))

  // Recent tests
  const recentTests = (userProgress.testAttempts || [])
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const getAccuracyColor = (acc: number) => {
    if (acc >= 70) return "text-green-400"
    if (acc >= 50) return "text-yellow-400"
    return "text-red-400"
  }

  const getAccuracyBg = (acc: number) => {
    if (acc >= 70) return "bg-green-500/10"
    if (acc >= 50) return "bg-yellow-500/10"
    return "bg-red-500/10"
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button className="border border-gray-700 bg-transparent hover:bg-gray-900 text-gray-300 hover:text-white px-4 py-2 rounded transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>

          <h1 className="text-3xl md:text-4xl font-semibold text-white">
            📊 Statistics
          </h1>

          <div></div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-8">
          <Card className="border border-gray-700 bg-black hover:bg-gray-900/20 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl md:text-3xl font-bold ${getAccuracyColor(accuracy)}`}>
                    {accuracy}%
                  </div>
                  <div className="text-xs md:text-sm text-gray-400">Accuracy</div>
                </div>
                <Target className="w-6 h-6 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-700 bg-black hover:bg-gray-900/20 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-orange-400">
                    {userProgress.streak}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400">Streak</div>
                </div>
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-700 bg-black hover:bg-gray-900/20 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    {userProgress.xp}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400">XP</div>
                </div>
                <TrendingUp className="w-6 h-6 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-700 bg-black hover:bg-gray-900/20 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-green-400">
                    {userProgress.questionsAnswered}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400">Answered</div>
                </div>
                <BarChart3 className="w-6 h-6 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-700 bg-black hover:bg-gray-900/20 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    {userProgress.maxStreak}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400">Best Streak</div>
                </div>
                <Award className="w-6 h-6 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-700 bg-black hover:bg-gray-900/20 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-purple-400">
                    {userProgress.badges?.length || 0}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400">Badges</div>
                </div>
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Accuracy Trend */}
          {dailyData.length > 0 && (
            <Card className="border border-gray-700 bg-black">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  📈 Accuracy Trend (Last 10 Days)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #4B5563" }} />
                    <Line type="monotone" dataKey="accuracy" stroke="#10B981" dot={{ fill: "#10B981" }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Category Performance */}
          {categoryData.length > 0 && (
            <Card className="border border-gray-700 bg-black">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  🎯 Category Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={categoryData.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="category" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #4B5563" }} />
                    <Bar dataKey="accuracy" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Strongest Categories */}
          {strongestCategories.length > 0 && (
            <Card className="border border-gray-700 bg-black">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-green-400">
                  🏆 Top Performing
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {strongestCategories.map((cat) => (
                  <div key={cat.category} className="flex justify-between items-center p-3 border border-gray-800 rounded bg-green-500/5">
                    <span className="font-medium text-white">{cat.category}</span>
                    <span className="text-green-400 font-bold">{cat.accuracy}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Weakest Categories */}
          {weakestCategories.length > 0 && (
            <Card className="border border-gray-700 bg-black">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-red-400">
                  📍 Needs Work
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {weakestCategories.map((cat) => (
                  <div key={cat.category} className="flex justify-between items-center p-3 border border-gray-800 rounded bg-red-500/5">
                    <span className="font-medium text-white">{cat.category}</span>
                    <span className="text-red-400 font-bold">{cat.accuracy}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Test History */}
        {recentTests.length > 0 && (
          <Card className="border border-gray-700 bg-black">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">
                ✅ Recent Tests
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {recentTests.map((test, idx) => {
                  const score = Math.round((test.score / test.totalQuestions) * 100)
                  return (
                    <div key={idx} className={`p-3 border border-gray-800 rounded flex justify-between items-center ${getAccuracyBg(score)}`}>
                      <div>
                        <div className="font-medium text-white">
                          {test.score}/{test.totalQuestions} {test.state && `(${test.state})`}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(test.date).toLocaleDateString()} • {Math.round(test.timeSpent / 60)}m
                        </div>
                      </div>
                      <div className={`font-bold ${getAccuracyColor(score)}`}>
                        {score}%
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {userProgress.questionsAnswered === 0 && (
          <Card className="border border-gray-700 bg-black">
            <CardContent className="p-12 text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Stats Yet</h3>
              <p className="text-gray-400 mb-6">Start practicing to see your statistics here.</p>
              <Link href="/practice">
                <Button className="border border-gray-700 bg-transparent hover:bg-gray-900 text-gray-300 hover:text-white px-6 py-2 rounded transition-colors">
                  Start Practicing
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
