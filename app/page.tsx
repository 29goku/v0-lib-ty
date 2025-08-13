"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { getTranslation } from "@/lib/i18n"
import LanguageSelector from "@/components/LanguageSelector"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Languages } from "lucide-react"

export default function HomePage() {
  const { language, questions, userProgress, loadQuestions } = useStore()
  const t = getTranslation(language)
  const [mounted, setMounted] = useState(false)
  const [showTranslationDialog, setShowTranslationDialog] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load questions to show correct stats
    if (questions.length === 0) {
      loadQuestions()
    }
  }, [questions.length, loadQuestions])

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return null
  }

  // Calculate stats from store data
  const stats = {
    totalQuestions: questions.length || 300,
    xp: userProgress.xp,
    streak: userProgress.streak,
    correctAnswers: userProgress.correctAnswers,
    completedQuestions: userProgress.completedQuestions.length,
    questionsAnswered: userProgress.questionsAnswered,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Modern background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute top-0 left-0 w-48 h-48 md:w-96 md:h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute bottom-0 right-0 w-40 h-40 md:w-80 md:h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s", animationDuration: "10s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-64 md:h-64 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "6s", animationDuration: "12s" }}
        ></div>

        {/* Static emojis with subtle hover effects */}
        <div className="absolute top-10 left-10 md:top-20 md:left-20 text-xl md:text-3xl hover:scale-110 transition-transform cursor-pointer">
          🚀
        </div>
        <div className="absolute top-20 right-16 md:top-40 md:right-32 text-lg md:text-2xl hover:scale-110 transition-transform cursor-pointer">
          ⚡
        </div>
        <div className="absolute bottom-16 left-16 md:bottom-32 md:left-32 text-2xl md:text-4xl hover:scale-110 transition-transform cursor-pointer">
          🔥
        </div>
        <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 text-lg md:text-2xl hover:scale-110 transition-transform cursor-pointer">
          🎯
        </div>
      </div>

      <div className="relative z-10">
        {/* Language Selector */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center space-x-4">
          <Dialog open={showTranslationDialog} onOpenChange={setShowTranslationDialog}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-blue-500/20 border-2 border-blue-500/50 rounded-full p-2 transition-all transform hover:scale-110"
              >
                <Languages className="w-4 h-4 text-blue-400" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/90 border-2 border-blue-500/50 text-white">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-blue-400">🌐 {t.translate} Feature</DialogTitle>
              </DialogHeader>
              <div className="p-4">
                <p className="text-gray-300 mb-4">
                  Our translation feature helps you understand German citizenship questions in your preferred language.
                  Look for the translation button on question cards throughout the app.
                </p>
                <div className="bg-blue-900/50 p-4 rounded-lg border border-blue-400/30 mb-4">
                  <h4 className="text-blue-300 font-bold mb-2">🎯 How to use:</h4>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li>
                      • Look for the <Languages className="w-4 h-4 inline mx-1 text-blue-400" /> button on question
                      cards in Practice and Review modes
                    </li>
                    <li>
                      • Click to translate the question, all answer options, and explanations to your selected language
                    </li>
                    <li>• Click again to toggle back to the original German text</li>
                    <li>• Translation resets automatically when you move to the next question</li>
                  </ul>
                </div>
                <div className="bg-yellow-900/50 p-4 rounded-lg border border-yellow-400/30">
                  <p className="text-yellow-300 font-semibold">
                    💡 Pro Tip: Use translation sparingly to build your German comprehension skills for the real test!
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <LanguageSelector />
        </div>

        {/* Hero Section */}
        <div className="min-h-screen flex items-center justify-center px-4 relative">
          <div className="text-center max-w-6xl mx-auto">
            {/* Main title with smooth effects */}
            <div className="mb-8 md:mb-12 relative">
              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-2 md:mb-4 leading-none relative hover:scale-105 transition-transform duration-500">
                <span className="bg-gradient-to-r from-yellow-300 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                  {t.heroTitle}
                </span>
              </h1>

              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black mb-4 md:mb-8 leading-none relative hover:scale-105 transition-transform duration-500">
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black text-white mr-2 md:mr-4">
                  🇩🇪
                </span>
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  {t.heroTitle.includes("LEBEN") ? t.heroTitle : "LEBEN IN DEUTSCHLAND"}
                </span>
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black text-white ml-2 md:ml-4">
                  🇩🇪
                </span>
              </h1>

              {/* Subtitle */}
              <div className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold text-white mb-6 md:mb-8 leading-relaxed px-4">
                <span className="hover:scale-110 transition-transform inline-block cursor-pointer">🚀</span>
                <span className="mx-2">{t.heroSubtitle}</span>
                <span className="hover:scale-110 transition-transform inline-block cursor-pointer ml-2">🎯</span>
              </div>
            </div>

            {/* Stats with hover effects */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-8 mb-12 md:mb-16 px-4">
              <div className="text-center group cursor-pointer">
                <div className="text-3xl md:text-6xl mb-2 group-hover:scale-110 transition-transform">🔥</div>
                <div className="text-2xl md:text-4xl font-black text-yellow-400 mb-1">{stats.totalQuestions}</div>
                <div className="text-xs md:text-sm text-gray-300 uppercase tracking-wider">{t.totalQuestions}</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-3xl md:text-6xl mb-2 group-hover:scale-110 transition-transform">⚡</div>
                <div className="text-2xl md:text-4xl font-black text-green-400 mb-1">33</div>
                <div className="text-xs md:text-sm text-gray-300 uppercase tracking-wider">TEST LENGTH</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-3xl md:text-6xl mb-2 group-hover:scale-110 transition-transform">⏰</div>
                <div className="text-2xl md:text-4xl font-black text-pink-400 mb-1">60</div>
                <div className="text-xs md:text-sm text-gray-300 uppercase tracking-wider">MINUTES</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-12 md:mb-16 px-4">
              <Link href="/practice">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-black px-8 md:px-12 py-4 md:py-6 text-lg md:text-2xl font-black rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 border-0 relative overflow-hidden group">
                  <span className="relative z-10">
                    🎮 {t.start.toUpperCase()} {t.practice.toUpperCase()}
                  </span>
                </Button>
              </Link>
              <Link href="/test">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 md:px-12 py-4 md:py-6 text-lg md:text-2xl font-black rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 border-0 relative overflow-hidden group">
                  <span className="relative z-10">🏆 {t.test.toUpperCase()}</span>
                </Button>
              </Link>
            </div>

            {/* Scroll indicator */}
            <div className="hover:scale-110 transition-transform cursor-pointer">
              <div className="text-2xl md:text-4xl">👇</div>
              <div className="text-sm md:text-lg text-gray-400 mt-2">SCROLL FOR MORE</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 md:py-24 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-20 relative">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 md:mb-6 relative hover:scale-105 transition-transform duration-500">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                  {t.chooseWeapon}
                </span>
              </h2>
              <p className="text-lg md:text-2xl text-gray-300 px-4">
                Four epic ways to dominate the citizenship test 💪
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {/* Practice Card */}
              <Link href="/practice" className="group">
                <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-2 border-cyan-500/50 hover:border-cyan-400 transition-all duration-500 group-hover:scale-105 backdrop-blur-sm overflow-hidden relative transform hover:shadow-2xl hover:shadow-cyan-500/50 h-full">
                  <div className="absolute top-0 right-0 text-3xl md:text-6xl opacity-20 transform rotate-12 translate-x-2 -translate-y-2 md:translate-x-4 md:-translate-y-4">
                    📚
                  </div>
                  <CardContent className="p-4 md:p-8 relative h-full flex flex-col">
                    <div className="text-3xl md:text-6xl mb-3 md:mb-4 group-hover:scale-125 transition-transform">
                      🎯
                    </div>
                    <h3 className="text-xl md:text-3xl font-black text-cyan-400 mb-3 md:mb-4">
                      {t.practice.toUpperCase()}
                    </h3>
                    <p className="text-gray-300 text-sm md:text-lg mb-4 md:mb-6 leading-relaxed group-hover:text-white transition-colors flex-grow">
                      {t.swipeLearn}: {stats.totalQuestions} questions with instant feedback 🔥
                    </p>
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-center group-hover:scale-105 transition-transform text-sm md:text-base">
                      {t.start.toUpperCase()}! 🚀
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Test Card */}
              <Link href="/test" className="group">
                <Card className="bg-gradient-to-br from-red-600/20 to-orange-600/20 border-2 border-orange-500/50 hover:border-orange-400 transition-all duration-500 group-hover:scale-105 backdrop-blur-sm overflow-hidden relative transform hover:shadow-2xl hover:shadow-orange-500/50 h-full">
                  <div className="absolute top-0 right-0 text-3xl md:text-6xl opacity-20 transform rotate-12 translate-x-2 -translate-y-2 md:translate-x-4 md:-translate-y-4">
                    ⏱️
                  </div>
                  <CardContent className="p-4 md:p-8 relative h-full flex flex-col">
                    <div className="text-3xl md:text-6xl mb-3 md:mb-4 group-hover:scale-125 transition-transform">
                      ⚡
                    </div>
                    <h3 className="text-xl md:text-3xl font-black text-orange-400 mb-3 md:mb-4">
                      {t.testMode.toUpperCase()}
                    </h3>
                    <p className="text-gray-300 text-sm md:text-lg mb-4 md:mb-6 leading-relaxed group-hover:text-white transition-colors flex-grow">
                      {t.testSubtitle}! 33 questions, 60 minutes. Test simulation! 😤
                    </p>
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-center group-hover:scale-105 transition-transform text-sm md:text-base">
                      {t.start.toUpperCase()}! 💪
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Review Card */}
              <Link href="/review" className="group">
                <Card className="bg-gradient-to-br from-yellow-600/20 to-amber-600/20 border-2 border-yellow-500/50 hover:border-yellow-400 transition-all duration-500 group-hover:scale-105 backdrop-blur-sm overflow-hidden relative transform hover:shadow-2xl hover:shadow-yellow-500/50 h-full">
                  <div className="absolute top-0 right-0 text-3xl md:text-6xl opacity-20 transform rotate-12 translate-x-2 -translate-y-2 md:translate-x-4 md:-translate-y-4">
                    🏃
                  </div>
                  <CardContent className="p-4 md:p-8 relative h-full flex flex-col">
                    <div className="text-3xl md:text-6xl mb-3 md:mb-4 group-hover:scale-125 transition-transform">
                      🧠
                    </div>
                    <h3 className="text-xl md:text-3xl font-black text-yellow-400 mb-3 md:mb-4">
                      {t.review.toUpperCase()}
                    </h3>
                    <p className="text-gray-300 text-sm md:text-lg mb-4 md:mb-6 leading-relaxed group-hover:text-white transition-colors flex-grow">
                      Study your mistakes, track progress, become unstoppable! 📈
                    </p>
                    <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-center group-hover:scale-105 transition-transform text-sm md:text-base">
                      LEVEL UP! ⬆️
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Settings Card */}
              <Link href="/settings" className="group">
                <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-500 group-hover:scale-105 backdrop-blur-sm overflow-hidden relative transform hover:shadow-2xl hover:shadow-purple-500/50 h-full">
                  <div className="absolute top-0 right-0 text-3xl md:text-6xl opacity-20 transform rotate-12 translate-x-2 -translate-y-2 md:translate-x-4 md:-translate-y-4">
                    ⚙️
                  </div>
                  <CardContent className="p-4 md:p-8 relative h-full flex flex-col">
                    <div className="text-3xl md:text-6xl mb-3 md:mb-4 group-hover:scale-125 transition-transform">
                      🎮
                    </div>
                    <h3 className="text-xl md:text-3xl font-black text-purple-400 mb-3 md:mb-4">
                      {t.settings.toUpperCase()}
                    </h3>
                    <p className="text-gray-300 text-sm md:text-lg mb-4 md:mb-6 leading-relaxed group-hover:text-white transition-colors flex-grow">
                      Customize everything! Dark mode, language, stats, and more! ✨
                    </p>
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-center group-hover:scale-105 transition-transform text-sm md:text-base">
                      CUSTOMIZE! 🎨
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>

        {/* Progress Section - Only show if user has progress */}
        {stats.questionsAnswered > 0 && (
          <div className="py-16 md:py-24 px-4 bg-gradient-to-r from-slate-800/50 to-purple-800/50 relative">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black mb-8 md:mb-12 relative hover:scale-105 transition-transform duration-500">
                <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  YOUR {t.progress.toUpperCase()}
                </span>
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-8">
                <div className="text-center group cursor-pointer">
                  <div className="text-3xl md:text-6xl mb-2 group-hover:scale-110 transition-transform">💎</div>
                  <div className="text-2xl md:text-4xl font-black text-cyan-400 mb-1">{stats.xp}</div>
                  <div className="text-xs md:text-sm text-gray-300 uppercase tracking-wider">{t.xp}</div>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="text-3xl md:text-6xl mb-2 group-hover:scale-110 transition-transform">🔥</div>
                  <div className="text-2xl md:text-4xl font-black text-orange-400 mb-1">{stats.streak}</div>
                  <div className="text-xs md:text-sm text-gray-300 uppercase tracking-wider">{t.streak}</div>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="text-3xl md:text-6xl mb-2 group-hover:scale-110 transition-transform">✅</div>
                  <div className="text-2xl md:text-4xl font-black text-green-400 mb-1">{stats.correctAnswers}</div>
                  <div className="text-xs md:text-sm text-gray-300 uppercase tracking-wider">{t.correct}</div>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="text-3xl md:text-6xl mb-2 group-hover:scale-110 transition-transform">📚</div>
                  <div className="text-2xl md:text-4xl font-black text-purple-400 mb-1">{stats.completedQuestions}</div>
                  <div className="text-xs md:text-sm text-gray-300 uppercase tracking-wider">
                    {t.completedQuestions}
                  </div>
                </div>
              </div>

              <div className="text-lg md:text-xl text-gray-300 mb-8">
                You're {Math.round((stats.correctAnswers / stats.totalQuestions) * 100)}% ready for the test! 🎯
              </div>
            </div>
          </div>
        )}

        {/* Final CTA */}
        <div className="py-16 md:py-24 px-4 bg-gradient-to-r from-purple-900 via-pink-900 to-red-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="relative max-w-6xl mx-auto text-center">
            <div className="text-4xl md:text-8xl mb-6 md:mb-8 hover:scale-125 transition-transform cursor-pointer">
              🇩🇪
            </div>

            <div className="relative mb-6 md:mb-8">
              <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black mb-2 md:mb-4 leading-tight relative hover:scale-105 transition-transform duration-500">
                <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
                  READY TO BECOME
                </span>
              </h2>

              <span className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-500 inline-block">
                A GERMAN CITIZEN?
              </span>
            </div>

            <p className="text-lg sm:text-xl md:text-3xl text-white mb-8 md:mb-12 font-bold leading-relaxed max-w-4xl mx-auto px-4">
              🎮 Join members who are CRUSHING the citizenship test with our addictive swipe-based learning!
              <br />
              <span className="text-yellow-300">No boring textbooks. No endless lectures. Just pure FUN! 🔥</span>
            </p>

            <Link href="/practice">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-black px-8 md:px-16 py-4 md:py-8 text-xl md:text-3xl font-black rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 border-0 relative overflow-hidden group">
                <span className="relative z-10">🚀 {t.start.toUpperCase()} NOW - IT'S FREE! 🚀</span>
              </Button>
            </Link>

            <div className="mt-6 md:mt-8 text-lg md:text-xl text-gray-300">
              ⏰ Join now and get instant access to {stats.totalQuestions} questions!
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
