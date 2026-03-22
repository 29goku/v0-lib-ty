"use client"

import { useState } from "react"
import { useTheme } from "@/lib/theme"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/ThemeToggle"

interface FAQItem {
  question: string
  answer: string | React.ReactNode
  category: "getting-started" | "practice" | "test" | "features"
}

export default function FAQPage() {
  const { isDark } = useTheme()
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const faqs: FAQItem[] = [
    {
      category: "getting-started",
      question: "What is Leben in Deutschland?",
      answer:
        "Leben in Deutschland (Life in Germany) is an official citizenship test required for naturalization in Germany. This app helps you prepare with all 310 official questions from the BAMF (Federal Office for Migration and Refugees) catalog.",
    },
    {
      category: "getting-started",
      question: "How many questions are on the official test?",
      answer:
        "The official citizenship test consists of 33 randomly selected questions from a pool of 310 total questions. You need to answer at least 17 questions correctly (50%) to pass.",
    },
    {
      category: "getting-started",
      question: "How much time do I have for the test?",
      answer: "You have 60 minutes (1 hour) for the entire test. This app simulates the real test experience with the same time limit.",
    },
    {
      category: "practice",
      question: "How do I practice questions?",
      answer: (
        <div className="space-y-2">
          <p>1. Click the <strong>"Practice"</strong> button on the home page</p>
          <p>2. <strong>Select an answer</strong> from options A, B, C, or D</p>
          <p>3. <strong>Swipe or drag</strong> the card to move to the next question:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Swipe <span className="text-green-400">RIGHT</span> for next question</li>
            <li>Swipe <span className="text-red-400">LEFT</span> for previous question</li>
          </ul>
          <p>4. See the <strong>correct answer</strong> highlighted in green after selection</p>
          <p>5. <strong>Flag questions</strong> you want to review later</p>
        </div>
      ),
    },
    {
      category: "practice",
      question: "What do the answer colors mean?",
      answer: (
        <div className="space-y-2">
          <p><strong className="text-blue-400">Blue:</strong> Your selected answer</p>
          <p><strong className="text-green-400">Green:</strong> Correct answer</p>
          <p><strong className="text-red-400">Red:</strong> Your incorrect answer</p>
          <p><strong className="text-gray-400">Gray:</strong> Unselected options</p>
        </div>
      ),
    },
    {
      category: "practice",
      question: "Can I use keyboard shortcuts?",
      answer: (
        <div className="space-y-2">
          <p><strong>Number Keys (1-4):</strong> Select option A, B, C, or D</p>
          <p><strong>Arrow Keys (← →):</strong> Navigate between questions</p>
          <p><strong>A / D keys:</strong> Swipe left/right for previous/next</p>
          <p>These shortcuts work on both practice and test modes!</p>
        </div>
      ),
    },
    {
      category: "practice",
      question: "How do I practice specific states?",
      answer:
        "Each German state (Bundesland) has 3 unique state-specific questions. You can filter questions by state in the practice mode to focus on your region.",
    },
    {
      category: "practice",
      question: "What does the flag icon do?",
      answer:
        "Click the flag icon to mark a question for later review. Flagged questions are saved in your progress and you can review them on the Review page.",
    },
    {
      category: "test",
      question: "How do I take a practice test?",
      answer: (
        <div className="space-y-2">
          <p>1. Click <strong>"Test"</strong> on the home page</p>
          <p>2. <strong>Choose a preset</strong> (Short: 10, Standard: 33, Full: 60 questions)</p>
          <p>3. Or <strong>drag the slider</strong> to customize the number of questions</p>
          <p>4. Click <strong>"Start Test"</strong> to begin</p>
          <p>5. Answer questions with the 60-minute timer running</p>
          <p>6. Your score and results are shown when completed</p>
        </div>
      ),
    },
    {
      category: "test",
      question: "Can I pause and resume the test?",
      answer:
        "Yes! You can pause the test at any time by navigating away from the test page. Your progress is saved automatically and you can continue later.",
    },
    {
      category: "test",
      question: "What score do I need to pass?",
      answer:
        "You need to answer at least 50% of questions correctly. For a 33-question test, that's 17 correct answers. For a 10-question test, that's 5 correct answers.",
    },
    {
      category: "features",
      question: "Does this app work offline?",
      answer:
        "The app works best with an internet connection for full features, but question data is cached for offline functionality.",
    },
    {
      category: "features",
      question: "Is there a dark mode?",
      answer:
        "Yes! Toggle dark mode on any page using the theme switch icon in the top right corner. Your preference is automatically saved.",
    },
    {
      category: "features",
      question: "Can I translate questions to English?",
      answer:
        "Yes! Click the translation icon (📖) on any question card to see an English translation of the question, answers, and explanation.",
    },
    {
      category: "features",
      question: "How do I track my progress?",
      answer:
        "Visit the Settings page to see your overall statistics: questions answered, correct answers, current streak, badges earned, and more. Your progress is saved automatically.",
    },
    {
      category: "features",
      question: "Is this app free?",
      answer:
        "Yes! This is a completely free app to help you prepare for the Leben in Deutschland citizenship test. No subscriptions or hidden costs.",
    },
    {
      category: "features",
      question: "What states are supported?",
      answer: (
        <div className="space-y-2">
          <p>This app covers all <strong>16 German states (Bundesländer)</strong>:</p>
          <p className="text-sm grid grid-cols-2 gap-2 mt-2">
            <span>🔴 Baden-Württemberg</span>
            <span>🔴 Bavaria</span>
            <span>🔴 Berlin</span>
            <span>🔴 Brandenburg</span>
            <span>🔴 Bremen</span>
            <span>🔴 Hamburg</span>
            <span>🔴 Hesse</span>
            <span>🔴 Lower Saxony</span>
            <span>🔴 Mecklenburg-Western Pomerania</span>
            <span>🔴 North Rhine-Westphalia</span>
            <span>🔴 Rhineland-Palatinate</span>
            <span>🔴 Saarland</span>
            <span>🔴 Saxony</span>
            <span>🔴 Saxony-Anhalt</span>
            <span>🔴 Schleswig-Holstein</span>
            <span>🔴 Thuringia</span>
          </p>
          <p className="mt-3">Each state has 3 unique state-specific questions that you can practice. Choose your state to focus on local questions!</p>
        </div>
      ),
    },
    {
      category: "features",
      question: "What test modes are available?",
      answer: (
        <div className="space-y-3">
          <p><strong>Practice Mode:</strong> Answer unlimited questions at your own pace. See instant feedback with explanations. Flag difficult questions for later review.</p>
          <p><strong>Test Mode:</strong> Simulate the official test with timed challenges:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li><strong>Short (10 questions):</strong> Quick practice session (~5 min)</li>
            <li><strong>Standard (33 questions):</strong> Official test format (60 min)</li>
            <li><strong>Full (60 questions):</strong> Comprehensive practice (60 min)</li>
            <li><strong>Custom:</strong> Choose any number of questions from 10-310</li>
          </ul>
          <p className="mt-2">All tests have a 60-minute timer and require 50% correct to pass.</p>
        </div>
      ),
    },
    {
      category: "features",
      question: "What statistics does the app track?",
      answer: (
        <div className="space-y-3">
          <p>Visit the <strong>Settings page</strong> to view comprehensive statistics:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li><strong>Total XP:</strong> Experience points earned from correct answers</li>
            <li><strong>Current Streak:</strong> Consecutive correct answers</li>
            <li><strong>Questions Answered:</strong> Total questions you've attempted</li>
            <li><strong>Correct Answers:</strong> Number of questions answered correctly</li>
            <li><strong>Accuracy %:</strong> Your overall correct answer percentage</li>
            <li><strong>Badges:</strong> Achievements earned as you progress</li>
            <li><strong>Test Attempts:</strong> History of all your test runs with scores</li>
            <li><strong>Time Spent:</strong> Total time invested in preparation</li>
          </ul>
          <p className="mt-2">All statistics are saved locally on your device and synced automatically as you practice.</p>
        </div>
      ),
    },
  ]

  const categories = [
    { id: "all", label: "All" },
    { id: "getting-started", label: "Getting Started" },
    { id: "practice", label: "Practice Mode" },
    { id: "test", label: "Test Mode" },
    { id: "features", label: "Features" },
  ]

  const filteredFaqs =
    selectedCategory === "all"
      ? faqs
      : faqs.filter((faq) => faq.category === selectedCategory)

  return (
    <div className={`min-h-screen ${isDark ? "bg-gradient-to-br from-black via-gray-950 to-black text-white" : "bg-white text-gray-900"}`}>
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md border-b" style={{ borderColor: isDark ? "rgb(31, 41, 55)" : "rgb(229, 231, 235)" }}>
        <div className="w-full px-4 md:px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <Button className={`border px-3 py-1.5 text-sm rounded transition-colors ${isDark ? "border-gray-700 bg-transparent hover:bg-gray-900 text-gray-300 hover:text-white" : "border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900"}`}>
              ← Back
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">❓ FAQ</h1>
          <ThemeToggle />
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-4 md:px-8 py-8 max-w-4xl mx-auto">
        {/* What We Offer Section */}
        <div className={`mb-12 p-6 md:p-8 rounded-lg border ${isDark ? "border-green-700/30 bg-gradient-to-r from-green-900/20 to-emerald-900/20" : "border-green-200 bg-green-50"}`}>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">🎯 What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="text-2xl">🗺️</span> 16 States
              </h3>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                All German Bundesländer with 3 state-specific questions each for localized practice
              </p>
            </div>

            {/* Feature 2 */}
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="text-2xl">📋</span> Multiple Modes
              </h3>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Practice mode for learning, Test mode for simulation (Short/Standard/Full/Custom)
              </p>
            </div>

            {/* Feature 3 */}
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="text-2xl">📊</span> Detailed Stats
              </h3>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Track XP, streaks, accuracy, badges, and test history to monitor progress
              </p>
            </div>

            {/* Feature 4 */}
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="text-2xl">310</span> Questions
              </h3>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                All official BAMF citizenship test questions from the complete question pool
              </p>
            </div>

            {/* Feature 5 */}
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="text-2xl">🌙</span> Dark Mode
              </h3>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Comfortable studying anytime with light and dark theme options
              </p>
            </div>

            {/* Feature 6 */}
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="text-2xl">🎁</span> 100% Free
              </h3>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                No ads, no subscriptions, no hidden costs - completely free forever
              </p>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id)
                setExpandedIndex(0)
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedCategory === cat.id
                  ? isDark
                    ? "bg-blue-500/30 border-blue-500/80 border-2 text-blue-100"
                    : "bg-blue-200 border-blue-600 border-2 text-blue-900"
                  : isDark
                    ? "bg-gray-900/30 border-gray-700 border text-gray-300 hover:bg-gray-800/30"
                    : "bg-gray-100 border-gray-300 border text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-lg overflow-hidden transition-all ${
                isDark ? "border-gray-700 bg-gray-900/20" : "border-gray-200 bg-gray-50"
              }`}
            >
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className={`w-full px-6 py-4 flex items-center justify-between hover:bg-opacity-80 transition-all ${
                  expandedIndex === index
                    ? isDark
                      ? "bg-blue-500/20 border-b border-gray-700"
                      : "bg-blue-100 border-b border-gray-300"
                    : ""
                }`}
              >
                <h3 className="text-left font-semibold text-base md:text-lg">{faq.question}</h3>
                <ChevronDown
                  className={`flex-shrink-0 w-5 h-5 transition-transform ${
                    expandedIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedIndex === index && (
                <div className={`px-6 py-4 border-t ${isDark ? "border-gray-700 bg-gray-900/10" : "border-gray-200 bg-white"}`}>
                  <div className={`text-sm md:text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className={`mt-12 p-6 md:p-8 rounded-lg border ${isDark ? "border-blue-700/30 bg-gradient-to-r from-blue-900/20 to-purple-900/20" : "border-blue-200 bg-blue-50"}`}>
          <h2 className="text-xl md:text-2xl font-bold mb-3">Ready to practice?</h2>
          <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Use the modes below to prepare for your citizenship test:
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/practice">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg">
                🎯 Start Practicing
              </Button>
            </Link>
            <Link href="/test">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 rounded-lg">
                🏁 Take Test
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
