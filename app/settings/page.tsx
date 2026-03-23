"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { useTheme, getTheme } from "@/lib/theme"
import ThemeToggle from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Download, Upload, RotateCcw } from "lucide-react"
import Link from "next/link"
import Badge from "@/components/Badge"
import StickyMobileHeader from "@/components/StickyMobileHeader"
import LanguageSelector from "@/components/LanguageSelector"

export default function SettingsPage() {
  const { userProgress, resetProgress, exportProgress, importProgress } = useStore()
  const { isDark, toggle: toggleTheme } = useTheme()
  const theme = getTheme(isDark)

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
      alert("Progress imported successfully!")
    }
  }

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all progress? This will delete everything and cannot be undone.")) {
      resetProgress()
      alert("Progress has been reset.")
    }
  }

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text}`}>
      <StickyMobileHeader title="Settings" showBackButton={true} backHref="/" />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="hidden sm:flex items-center justify-between mb-8">
          <Link href="/">
            <Button className={`border px-6 py-2 transition-all font-semibold ${isDark ? 'border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white' : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900'}`}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
          </Link>

          <div className="text-center">
            <h1 className={`text-4xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Settings
            </h1>
            <div className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Customize Your Experience</div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSelector />
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Stats */}
          <Card className={`border ${isDark ? 'border-gray-700 bg-black' : 'border-gray-200 bg-gray-50'}`}>
            <CardHeader>
              <CardTitle className={`text-center text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`text-center p-4 border ${isDark ? 'border-gray-700 bg-white/5' : 'border-gray-300 bg-gray-100'}`}>
                  <div className={`text-3xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {userProgress.xp}
                  </div>
                  <div className={`text-sm font-normal ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Total XP</div>
                </div>
                <div className={`text-center p-4 border ${isDark ? 'border-gray-700 bg-white/5' : 'border-gray-300 bg-gray-100'}`}>
                  <div className={`text-3xl font-semibold mb-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    {userProgress.correctAnswers}
                  </div>
                  <div className={`text-sm font-normal ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Correct</div>
                </div>
                <div className={`text-center p-4 border ${isDark ? 'border-gray-700 bg-white/5' : 'border-gray-300 bg-gray-100'}`}>
                  <div className={`text-3xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {userProgress.maxStreak}
                  </div>
                  <div className={`text-sm font-normal ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Best Streak
                  </div>
                </div>
                <div className={`text-center p-4 border ${isDark ? 'border-gray-700 bg-white/5' : 'border-gray-300 bg-gray-100'}`}>
                  <div className={`text-3xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {userProgress.questionsAnswered > 0
                      ? Math.min(Math.round((userProgress.correctAnswers / userProgress.questionsAnswered) * 100), 100)
                      : 0}
                    %
                  </div>
                  <div className={`text-sm font-normal ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Accuracy</div>
                </div>
              </div>

              {userProgress.badges.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <h4 className="font-semibold text-lg mb-4 text-center text-white">
                    Earned Badges
                  </h4>
                  <div className="flex flex-wrap justify-center gap-3">
                    {userProgress.badges.map((badge) => (
                      <div key={badge}>
                        <Badge type={badge} earned size="lg" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className={`border ${isDark ? 'border-gray-700 bg-black' : 'border-gray-200 bg-gray-50'}`}>
            <CardHeader>
              <CardTitle className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Appearance Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className={`flex items-center justify-between p-4 border ${isDark ? 'border-gray-700 bg-white/5' : 'border-gray-300 bg-gray-100'}`}>
                <div>
                  <Label htmlFor="dark-mode" className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {isDark ? "Dark Mode" : "Light Mode"}
                  </Label>
                  <p className={`text-sm font-normal ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Toggle between light and dark themes</p>
                </div>
                <Switch id="dark-mode" checked={isDark} onCheckedChange={toggleTheme} />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className={`border ${isDark ? 'border-gray-700 bg-black' : 'border-gray-200 bg-gray-50'}`}>
            <CardHeader>
              <CardTitle className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex gap-3">
                <Button
                  onClick={handleExport}
                  className={`flex-1 border font-semibold py-3 text-base ${isDark ? 'border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white' : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900'}`}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Progress
                </Button>
                <Button
                  onClick={() => setShowImportArea(!showImportArea)}
                  className={`flex-1 border font-semibold py-3 text-base ${isDark ? 'border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white' : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900'}`}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import Progress
                </Button>
              </div>

              {showImportArea && (
                <div className={`space-y-4 p-4 border ${isDark ? 'border-gray-700 bg-white/5' : 'border-gray-300 bg-gray-100'}`}>
                  <Label htmlFor="import-data" className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Paste Your Exported Progress Data:
                  </Label>
                  <Textarea
                    id="import-data"
                    placeholder="Paste your JSON data here to restore your progress..."
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    rows={6}
                    className={`font-mono ${isDark ? 'bg-black border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                  <div className="flex gap-3">
                    <Button
                      onClick={handleImport}
                      disabled={!importData.trim()}
                      className={`border font-semibold px-4 py-2 disabled:opacity-50 ${isDark ? 'border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white' : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900'}`}
                    >
                      Import Data
                    </Button>
                    <Button
                      onClick={() => {
                        setShowImportArea(false)
                        setImportData("")
                      }}
                      className={`border font-semibold px-4 py-2 ${isDark ? 'border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white' : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900'}`}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className={`pt-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-300'}`}>
                <Button
                  onClick={handleReset}
                  className={`w-full border font-semibold py-3 text-base ${isDark ? 'border-red-500 bg-transparent hover:bg-red-500/20 text-red-400 hover:text-red-300' : 'border-red-400 bg-transparent hover:bg-red-400/20 text-red-600 hover:text-red-700'}`}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset All Progress
                </Button>
                <p className={`text-sm font-normal mt-3 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  This will permanently delete ALL your progress, badges, and settings
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Study Statistics */}
          <Card className={`border ${isDark ? 'border-gray-700 bg-black' : 'border-gray-200 bg-gray-50'}`}>
            <CardHeader>
              <CardTitle className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Study Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className={`flex justify-between items-center p-4 border ${isDark ? 'border-gray-700 bg-white/5' : 'border-gray-300 bg-gray-100'}`}>
                  <span className={`text-base font-normal ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Questions Answered:</span>
                  <span className={`font-semibold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>{userProgress.questionsAnswered}</span>
                </div>
                <div className={`flex justify-between items-center p-4 border ${isDark ? 'border-gray-700 bg-white/5' : 'border-gray-300 bg-gray-100'}`}>
                  <span className={`text-base font-normal ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Correct Answers:</span>
                  <span className={`font-semibold text-xl ${isDark ? 'text-green-400' : 'text-green-600'}`}>{userProgress.correctAnswers}</span>
                </div>
                <div className={`flex justify-between items-center p-4 border ${isDark ? 'border-gray-700 bg-white/5' : 'border-gray-300 bg-gray-100'}`}>
                  <span className={`text-base font-normal ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Incorrect Answers:</span>
                  <span className={`font-semibold text-xl ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                    {userProgress.incorrectAnswers?.length || 0}
                  </span>
                </div>
                <div className={`flex justify-between items-center p-4 border ${isDark ? 'border-gray-700 bg-white/5' : 'border-gray-300 bg-gray-100'}`}>
                  <span className={`text-base font-normal ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Flagged Questions:</span>
                  <span className={`font-semibold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>{userProgress.flaggedQuestions.length}</span>
                </div>
                <div className={`flex justify-between items-center p-4 border ${isDark ? 'border-gray-700 bg-white/5' : 'border-gray-300 bg-gray-100'}`}>
                  <span className={`text-base font-normal ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Current Streak:</span>
                  <span className={`font-semibold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>{userProgress.streak}</span>
                </div>
                <div className={`flex justify-between items-center p-4 border ${isDark ? 'border-gray-700 bg-white/5' : 'border-gray-300 bg-gray-100'}`}>
                  <span className={`text-base font-normal ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Last Study Date:</span>
                  <span className={`font-semibold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>{userProgress.lastStudyDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card className={`border ${isDark ? 'border-gray-700 bg-black' : 'border-gray-200 bg-gray-50'}`}>
            <CardHeader>
              <CardTitle className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                About Leben in Deutschland
              </CardTitle>
            </CardHeader>
            <CardContent className={`p-4 space-y-4 text-base ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <p className="font-normal">
                This app helps you prepare for the German citizenship test with interactive learning methods.
              </p>
              <div>
                <p className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Features:</p>
                <ul className="list-disc list-inside space-y-2 font-normal">
                  <li>310+ official practice questions from the real test</li>
                  <li>Swipe-based learning interface</li>
                  <li>Timed test simulation (33 questions, 60 minutes)</li>
                  <li>Progress tracking with XP and badges</li>
                  <li>Question flagging and review system</li>
                  <li>Dark mode support</li>
                  <li>Progress export/import functionality</li>
                </ul>
              </div>
              <div className={`pt-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-300'}`}>
                <p className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Official Test Information:</p>
                <p className={`font-normal ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  The real "Leben in Deutschland" test required for German citizenship contains 33 questions, has a
                  60-minute time limit, and requires 17+ correct answers to pass. It covers politics, history, law,
                  culture, and geography.
                </p>
                <p className={`mt-3 font-normal ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  This is a practice app. Always verify current requirements with official sources.
                </p>
              </div>
              <div className={`pt-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-300'}`}>
                <p className={`font-semibold text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Version 2.0.0
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
