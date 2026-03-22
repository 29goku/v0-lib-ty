"use client"

import Link from "next/link"
import Head from "next/head"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { getTranslation } from "@/lib/i18n"
import LanguageSelector from "@/components/LanguageSelector"
import { useEffect, useState } from "react"
import { Icon } from "@/components/Icon"
import ThemeToggle from "@/components/ThemeToggle"
import { useTheme } from "@/lib/theme"
import AdBanner from "@/components/AdBanner"

export default function HomePage() {
  const { language, questions, userProgress, loadQuestions } = useStore()
  const { isDark } = useTheme()
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
      <>
        <Head>
          <title>Leben in Deutschland Test 2025 – 310 Offizielle Fragen & Vorbereitung</title>
          <meta name="description" content="Kostenlose Vorbereitung für den Leben in Deutschland Test 2025 mit allen 310 offiziellen Fragen, Antworten und Erklärungen. Interaktiv, mobilfreundlich und perfekt für den Einbürgerungstest." />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href="https://lebeninde.com/" />
          <link rel="alternate" href="https://lebeninde.com/en/" hrefLang="en" />
          <link rel="alternate" href="https://lebeninde.com/" hrefLang="de" />
          {/* Open Graph */}
          <meta property="og:title" content="Leben in Deutschland Test 2025 – 310 Offizielle Fragen & Vorbereitung" />
          <meta property="og:description" content="Kostenlose Vorbereitung für den Leben in Deutschland Test 2025 mit allen 310 offiziellen Fragen, Antworten und Erklärungen. Interaktiv, mobilfreundlich und perfekt für den Einbürgerungstest." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://lebeninde.com/" />
          <meta property="og:image" content="/public/placeholder-logo.png" />
          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Leben in Deutschland Test 2025 – 310 Offizielle Fragen & Vorbereitung" />
          <meta name="twitter:description" content="Kostenlose Vorbereitung für den Leben in Deutschland Test 2025 mit allen 310 offiziellen Fragen, Antworten und Erklärungen. Interaktiv, mobilfreundlich und perfekt für den Einbürgerungstest." />
          <meta name="twitter:image" content="/public/placeholder-logo.png" />
          {/* Schema.org Structured Data */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Leben in Deutschland Test 2025",
            "description": "Kostenlose Vorbereitung für den Leben in Deutschland Test 2025 mit allen 310 offiziellen Fragen, Antworten und Erklärungen.",
            "url": "https://lebeninde.com/",
            "inLanguage": "de",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://lebeninde.com/"},
                {"@type": "ListItem", "position": 2, "name": "Fragenkatalog", "item": "https://lebeninde.com/fragenkatalog"},
                {"@type": "ListItem", "position": 3, "name": "Test", "item": "https://lebeninde.com/test"}
              ]
            },
            "mainEntity": [
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "Wie viele Fragen hat der Leben in Deutschland Test?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Der Test besteht aus 33 Fragen, davon 3 zu Ihrem Bundesland."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Besteht man den Test ohne Vorbereitung?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Eine gezielte Vorbereitung erhöht die Erfolgschancen deutlich."
                    }
                  }
                ]
              },
              {
                "@type": "Quiz",
                "name": "Leben in Deutschland Test Quiz",
                "about": "310 offizielle Fragen zum Leben in Deutschland Test",
                "url": "https://lebeninde.com/test"
              }
            ]
          }) }} />
          {/* English alternate structured data */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Leben in Deutschland Test 2025",
            "description": "Free preparation for the Leben in Deutschland Test 2025 with all 310 official questions, answers, and explanations. Interactive, mobile-friendly, and perfect for the citizenship test.",
            "url": "https://lebeninde.com/en/",
            "inLanguage": "en",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://lebeninde.com/en/"},
                {"@type": "ListItem", "position": 2, "name": "Question Catalog", "item": "https://lebeninde.com/en/questions"},
                {"@type": "ListItem", "position": 3, "name": "Test", "item": "https://lebeninde.com/en/test"}
              ]
            },
            "mainEntity": [
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "How many questions are in the Leben in Deutschland Test?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "The test consists of 33 questions, including 3 about your federal state."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can you pass the test without preparation?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Targeted preparation significantly increases your chances of success."
                    }
                  }
                ]
              },
              {
                "@type": "Quiz",
                "name": "Leben in Deutschland Test Quiz",
                "about": "310 official questions for the Leben in Deutschland Test",
                "url": "https://lebeninde.com/en/test"
              }
            ]
          }) }} />
        </Head>
        <div className={`min-h-screen relative ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex gap-2 sm:gap-3">
        <ThemeToggle />
        <LanguageSelector />
      </div>

      <div className="relative z-10">


        {/* Hero Section */}
        <div className="pt-20 sm:pt-12 md:py-20 flex items-center justify-center px-4 relative">

          <div className="text-center max-w-6xl mx-auto">

            {/* Main title */}
            <div className="mb-4 sm:mb-6 md:mb-8 relative">
              <h1 className={`text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold mb-1 sm:mb-2 md:mb-3 leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
                LEBEN
              </h1>

              <h1 className={`text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-semibold mb-2 sm:mb-3 md:mb-4 leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
                IN DEUTSCHLAND
              </h1>

              {/* Subtitle */}
              <div className={`text-lg sm:text-xl md:text-2xl font-normal mb-4 md:mb-6 leading-relaxed px-4 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                {t.heroSubtitle}
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-6 mb-8 md:mb-10 px-4">
              <div className="text-center">
                <div className={`text-2xl md:text-3xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.totalQuestions}</div>
                <div className={`text-xs md:text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t.totalQuestions}</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl md:text-3xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>33</div>
                <div className={`text-xs md:text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Test Length</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl md:text-3xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>60</div>
                <div className={`text-xs md:text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Minutes</div>
              </div>
            </div>

            {/* CTA Buttons - Main App Functionality */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-12 md:mb-16 px-4">
              <Link href="/practice" className="group flex-1 sm:flex-none">
                <button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-8 md:px-12 py-4 md:py-5 text-lg md:text-xl rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/50 hover:shadow-2xl relative overflow-hidden group">
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
                  <span className="relative flex items-center justify-center gap-2">
                    🎯 {t.start} {t.practice}
                  </span>
                </button>
              </Link>

              <Link href="/test" className="group flex-1 sm:flex-none">
                <button className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-8 md:px-12 py-4 md:py-5 text-lg md:text-xl rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-orange-500/50 hover:shadow-2xl relative overflow-hidden group">
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
                  <span className="relative flex items-center justify-center gap-2">
                    ⚡ {t.test}
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Ad Banner - After Hero Section */}
        <div className="py-4 px-4">
          <AdBanner slot="1234567890" format="auto" responsive={true} />
        </div>

        {/* Features Section */}
        <div className="md:py-16 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 md:mb-12 relative">
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-semibold mb-2 md:mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Learn & Track Progress
              </h2>
              <p className={`text-base md:text-lg px-4 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                Five ways to prepare for the citizenship test
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
              {/* Practice Card */}
              <Link href="/practice" className="group">
                <Card className={`h-full transition-colors ${isDark ? 'bg-white/5 hover:bg-gray-900/20' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'}`}>
                  <CardContent className="p-4 h-full flex flex-col">
                    <h3 className={`text-lg md:text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {t.practice}
                    </h3>
                    <p className={`text-xs md:text-sm mb-3 leading-relaxed flex-grow ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Learn by swiping. {stats.totalQuestions} questions with instant feedback
                    </p>
                    <div className={`bg-transparent font-semibold text-center transition-colors text-xs px-3 py-1 ${isDark ? 'border border-gray-700 text-gray-300 hover:bg-gray-900/20 hover:text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>
                      {t.start}
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Test Card */}
              <Link href="/test" className="group">
                <Card className={`h-full transition-colors ${isDark ? 'bg-white/5 hover:bg-gray-900/20' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'}`}>
                  <CardContent className="p-4 h-full flex flex-col">
                    <h3 className={`text-lg md:text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {t.testMode}
                    </h3>
                    <p className={`text-xs md:text-sm mb-3 leading-relaxed flex-grow ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Simulated test conditions. 33 questions, 60 minutes
                    </p>
                    <div className={`bg-transparent font-semibold text-center transition-colors text-xs px-3 py-1 ${isDark ? 'border border-gray-700 text-gray-300 hover:bg-gray-900/20 hover:text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>
                      {t.start}
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Review Card */}
              <Link href="/review" className="group">
                <Card className={`h-full transition-colors ${isDark ? 'bg-white/5 hover:bg-gray-900/20' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'}`}>
                  <CardContent className="p-4 h-full flex flex-col">
                    <h3 className={`text-lg md:text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {t.review}
                    </h3>
                    <p className={`text-xs md:text-sm mb-3 leading-relaxed flex-grow ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Study mistakes, track progress, improve
                    </p>
                    <div className={`bg-transparent font-semibold text-center transition-colors text-xs px-3 py-1 ${isDark ? 'border border-gray-700 text-gray-300 hover:bg-gray-900/20 hover:text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>
                      Review
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Stats Card */}
              <Link href="/stats" className="group">
                <Card className={`h-full transition-colors ${isDark ? 'bg-white/5 hover:bg-gray-900/20' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'}`}>
                  <CardContent className="p-4 h-full flex flex-col">
                    <h3 className={`text-lg md:text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      📊 Statistics
                    </h3>
                    <p className={`text-xs md:text-sm mb-3 leading-relaxed flex-grow ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Analytics, charts, performance trends
                    </p>
                    <div className={`bg-transparent font-semibold text-center transition-colors text-xs px-3 py-1 ${isDark ? 'border border-gray-700 text-gray-300 hover:bg-gray-900/20 hover:text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>
                      View
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Settings Card */}
              <Link href="/settings" className="group">
                <Card className={`h-full transition-colors ${isDark ? 'bg-white/5 hover:bg-gray-900/20' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'}`}>
                  <CardContent className="p-4 h-full flex flex-col">
                    <h3 className={`text-lg md:text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {t.settings}
                    </h3>
                    <p className={`text-xs md:text-sm mb-3 leading-relaxed flex-grow ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Dark mode, language, stats
                    </p>
                    <div className={`bg-transparent font-semibold text-center transition-colors text-xs px-3 py-1 ${isDark ? 'border border-gray-700 text-gray-300 hover:bg-gray-900/20 hover:text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>
                      Customize
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>

        {/* Progress Section - Only show if user has progress */}
        {stats.questionsAnswered > 0 && (
          <div className={`py-10 md:py-12 px-4 ${isDark ? 'border-t border-gray-700 bg-white/5' : 'border-t border-gray-200 bg-gray-50'}`}>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-semibold mb-6 md:mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Your {t.progress}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6">
                <div className="text-center">
                  <div className={`text-2xl md:text-3xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.xp}</div>
                  <div className={`text-xs md:text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t.xp}</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl md:text-3xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.streak}</div>
                  <div className={`text-xs md:text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t.streak}</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl md:text-3xl font-semibold mb-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}>{stats.correctAnswers}</div>
                  <div className={`text-xs md:text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t.correct}</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl md:text-3xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.completedQuestions}</div>
                  <div className={`text-xs md:text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t.completedQuestions}
                  </div>
                </div>
              </div>

              <div className={`text-base md:text-lg ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                You're {Math.round((stats.correctAnswers / stats.totalQuestions) * 100)}% ready for the test
              </div>
            </div>
          </div>
        )}

        {/* Ad Banner - Before Final CTA */}
        <div className="py-4 px-4">
          <AdBanner slot="9876543210" format="auto" responsive={true} />
        </div>

        {/* Final CTA */}
        <div className={`py-10 md:py-12 px-4 ${isDark ? 'border-t border-gray-700 bg-white/5' : 'border-t border-gray-200 bg-gray-50'}`}>
          <div className="max-w-6xl mx-auto text-center">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 md:mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Ready to Become
              <br />
              A German Citizen?
            </h2>

            <p className={`text-base sm:text-lg md:text-xl mb-6 md:mb-8 leading-relaxed max-w-4xl mx-auto px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Join members who are preparing for the citizenship test with our swipe-based learning.
              <br />
              No boring textbooks. No endless lectures. Just effective practice.
            </p>

            <Link href="/practice">
              <Button className={`px-6 md:px-10 py-2 md:py-3 text-lg md:text-xl font-semibold transition-colors ${isDark ? 'border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white' : 'border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900'}`}>
                {t.start} Now - It's Free
              </Button>
            </Link>

            <div className={`mt-4 md:mt-6 text-base md:text-lg ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
              Join now and get instant access to {stats.totalQuestions} questions
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
