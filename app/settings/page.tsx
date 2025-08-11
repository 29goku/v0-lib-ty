"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Download, Upload, RotateCcw } from "lucide-react"
import Link from "next/link"
import Badge from "@/components/Badge"

export default function SettingsPage() {
  const { userProgress, darkMode, toggleDarkMode, resetProgress, exportProgress, importProgress } = useStore()

  const [importData, setImportData] = useState("")
  const [showImportArea, setShowImportArea] = useState(false)

  const handleExport = () => {
    const data = exportProgress()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `leben-in-deutschland-progress-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    if (importData.trim()) {
      importProgress(importData)
      setImportData("")
      setShowImportArea(false)
      alert("🚀 Progress imported successfully! You're back in the game!")
    }
  }

  const handleReset = () => {
    if (confirm("⚠️ Are you sure you want to RESET ALL PROGRESS? This will delete everything and cannot be undone!")) {
      resetProgress()
      alert("💥 Progress has been reset. Time to start your journey again!")
    }
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
          ⚙️
        </div>
        <div className="absolute top-40 right-32 text-2xl animate-bounce" style={{ animationDelay: "1s" }}>
          🎮
        </div>
        <div className="absolute bottom-32 left-32 text-4xl animate-bounce" style={{ animationDelay: "2s" }}>
          🔧
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
                ⚙️ SETTINGS ⚙️
              </span>
            </h1>
            <div className="text-lg text-gray-300 animate-bounce">CUSTOMIZE YOUR EXPERIENCE! 🎮</div>
          </div>

          <div></div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Stats with INSANE ENERGY */}
          <Card className="border-2 border-purple-500/50 bg-gradient-to-br from-purple-900/30 to-black/50 backdrop-blur-sm shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-pulse"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-center text-3xl font-black">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  🏆 YOUR EPIC PROGRESS 🏆
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center group cursor-pointer">
                  <div className="absolute inset-0 bg-blue-400/10 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                  <div className="text-6xl mb-3 group-hover:animate-bounce group-hover:scale-125 transition-transform relative z-10">
                    ⚡
                  </div>
                  <div className="text-4xl font-black text-blue-400 mb-2 group-hover:animate-pulse relative z-10">
                    {userProgress.xp}
                  </div>
                  <div className="text-sm text-gray-300 uppercase tracking-wider font-bold relative z-10">TOTAL XP</div>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="absolute inset-0 bg-green-400/10 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                  <div className="text-6xl mb-3 group-hover:animate-bounce group-hover:scale-125 transition-transform relative z-10">
                    🎯
                  </div>
                  <div className="text-4xl font-black text-green-400 mb-2 group-hover:animate-pulse relative z-10">
                    {userProgress.correctAnswers}
                  </div>
                  <div className="text-sm text-gray-300 uppercase tracking-wider font-bold relative z-10">CORRECT</div>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="absolute inset-0 bg-orange-400/10 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                  <div className="text-6xl mb-3 group-hover:animate-bounce group-hover:scale-125 transition-transform relative z-10">
                    🔥
                  </div>
                  <div className="text-4xl font-black text-orange-400 mb-2 group-hover:animate-pulse relative z-10">
                    {userProgress.maxStreak}
                  </div>
                  <div className="text-sm text-gray-300 uppercase tracking-wider font-bold relative z-10">
                    BEST STREAK
                  </div>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="absolute inset-0 bg-purple-400/10 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                  <div className="text-6xl mb-3 group-hover:animate-bounce group-hover:scale-125 transition-transform relative z-10">
                    📊
                  </div>
                  <div className="text-4xl font-black text-purple-400 mb-2 group-hover:animate-pulse relative z-10">
                    {userProgress.questionsAnswered > 0
                      ? Math.round((userProgress.correctAnswers / userProgress.questionsAnswered) * 100)
                      : 0}
                    %
                  </div>
                  <div className="text-sm text-gray-300 uppercase tracking-wider font-bold relative z-10">ACCURACY</div>
                </div>
              </div>

              {userProgress.badges.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-black text-2xl mb-6 text-center">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                      🏆 EARNED BADGES 🏆
                    </span>
                  </h4>
                  <div className="flex flex-wrap justify-center gap-6">
                    {userProgress.badges.map((badge, index) => (
                      <div key={badge} className="animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                        <Badge type={badge} earned size="lg" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Appearance with GAMING VIBE */}
          <Card className="border-2 border-cyan-500/50 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-sm shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 animate-pulse"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl font-black">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  🎨 APPEARANCE SETTINGS 🎨
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-900/50 to-black/50 rounded-xl border-2 border-gray-600">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl animate-bounce">{darkMode ? "🌙" : "☀️"}</div>
                  <div>
                    <Label htmlFor="dark-mode" className="text-xl font-black text-white">
                      {darkMode ? "🌙 DARK MODE" : "☀️ LIGHT MODE"}
                    </Label>
                    <p className="text-sm text-gray-400 font-semibold">Toggle between light and dark themes</p>
                  </div>
                </div>
                <Switch id="dark-mode" checked={darkMode} onCheckedChange={toggleDarkMode} className="scale-150" />
              </div>
            </CardContent>
          </Card>

          {/* Data Management with MAXIMUM CHAOS */}
          <Card className="border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-sm shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 animate-pulse"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl font-black">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  💾 DATA MANAGEMENT 💾
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="flex space-x-4">
                <Button
                  onClick={handleExport}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-black py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-0"
                >
                  <Download className="w-5 h-5 mr-3" />📥 EXPORT PROGRESS
                </Button>
                <Button
                  onClick={() => setShowImportArea(!showImportArea)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-black py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-0"
                >
                  <Upload className="w-5 h-5 mr-3" />📤 IMPORT PROGRESS
                </Button>
              </div>

              {showImportArea && (
                <div className="space-y-4 p-6 bg-gradient-to-r from-gray-900/50 to-black/50 rounded-xl border-2 border-purple-500/50">
                  <Label htmlFor="import-data" className="text-lg font-black text-purple-400">
                    🔥 PASTE YOUR EXPORTED PROGRESS DATA:
                  </Label>
                  <Textarea
                    id="import-data"
                    placeholder="Paste your JSON data here to restore your progress..."
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    rows={6}
                    className="bg-black/50 border-2 border-purple-500/50 text-white font-mono"
                  />
                  <div className="flex space-x-3">
                    <Button
                      onClick={handleImport}
                      disabled={!importData.trim()}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-black px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-0 disabled:opacity-50"
                    >
                      🚀 IMPORT DATA
                    </Button>
                    <Button
                      onClick={() => {
                        setShowImportArea(false)
                        setImportData("")
                      }}
                      className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-black px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-0"
                    >
                      ❌ CANCEL
                    </Button>
                  </div>
                </div>
              )}

              <div className="pt-6 border-t-2 border-red-500/50">
                <Button
                  onClick={handleReset}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-black py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-0"
                >
                  <RotateCcw className="w-5 h-5 mr-3" />💥 RESET ALL PROGRESS
                </Button>
                <p className="text-sm text-gray-400 mt-3 text-center font-semibold">
                  ⚠️ This will permanently delete ALL your progress, badges, and settings
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Study Statistics with INSANE ENERGY */}
          <Card className="border-2 border-green-500/50 bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 animate-pulse"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl font-black">
                <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  📊 STUDY STATISTICS 📊
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-900/50 to-black/50 rounded-xl border border-gray-600">
                  <span className="text-lg font-bold text-gray-300">📝 Questions Answered:</span>
                  <span className="font-black text-2xl text-cyan-400">{userProgress.questionsAnswered}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-900/50 to-black/50 rounded-xl border border-gray-600">
                  <span className="text-lg font-bold text-gray-300">✅ Correct Answers:</span>
                  <span className="font-black text-2xl text-green-400">{userProgress.correctAnswers}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-900/50 to-black/50 rounded-xl border border-gray-600">
                  <span className="text-lg font-bold text-gray-300">❌ Incorrect Answers:</span>
                  <span className="font-black text-2xl text-red-400">
                    {userProgress.questionsAnswered - userProgress.correctAnswers}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-900/50 to-black/50 rounded-xl border border-gray-600">
                  <span className="text-lg font-bold text-gray-300">🚩 Flagged Questions:</span>
                  <span className="font-black text-2xl text-yellow-400">{userProgress.flaggedQuestions.length}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-900/50 to-black/50 rounded-xl border border-gray-600">
                  <span className="text-lg font-bold text-gray-300">🔥 Current Streak:</span>
                  <span className="font-black text-2xl text-orange-400">{userProgress.streak}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-900/50 to-black/50 rounded-xl border border-gray-600">
                  <span className="text-lg font-bold text-gray-300">📅 Last Study Date:</span>
                  <span className="font-black text-2xl text-purple-400">{userProgress.lastStudyDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About with MAXIMUM HYPE */}
          <Card className="border-2 border-pink-500/50 bg-gradient-to-br from-pink-900/30 to-purple-900/30 backdrop-blur-sm shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 animate-pulse"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl font-black">
                <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                  ℹ️ ABOUT LEBEN IN DEUTSCHLAND ℹ️
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-lg text-gray-300 font-semibold relative z-10">
              <p className="leading-relaxed">
                🚀 This app helps you prepare for the German citizenship test with INSANE interactive learning methods!
              </p>
              <div>
                <p className="font-black text-xl text-white mb-3">🔥 EPIC FEATURES:</p>
                <ul className="list-none space-y-2 ml-4">
                  <li className="flex items-center space-x-3">
                    <span className="text-2xl">📚</span>
                    <span>100+ official practice questions from the real test</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-2xl">📱</span>
                    <span>Tinder-style swipe learning (addictive AF!)</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-2xl">⏱️</span>
                    <span>Timed test simulation (33 questions, 60 minutes)</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-2xl">🎮</span>
                    <span>Progress tracking with XP and badges</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-2xl">🚩</span>
                    <span>Question flagging and review system</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-2xl">🌙</span>
                    <span>Dark mode support (for night owls)</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-2xl">💾</span>
                    <span>Progress export/import functionality</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t-2 border-pink-500/50">
                <p className="font-black text-xl text-white mb-2">📋 OFFICIAL TEST INFO:</p>
                <p className="text-gray-300">
                  The real "Leben in Deutschland" test required for German citizenship contains 33 questions, has a
                  60-minute time limit, and requires 17+ correct answers to pass. It covers politics, history, law,
                  culture, and geography.
                </p>
                <p className="mt-3 text-yellow-400 font-bold animate-pulse">
                  ⚠️ This is a practice app. Always verify current requirements with official sources!
                </p>
              </div>
              <div className="text-center pt-4">
                <p className="font-black text-2xl">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    🚀 VERSION: 2.0.0 - MAXIMUM ENERGY EDITION! 🚀
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
