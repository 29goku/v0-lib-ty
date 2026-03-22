"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/lib/theme"

interface GamificationFeedbackProps {
  isCorrect: boolean | undefined
  xpGained?: number
  streakCount?: number
  accuracy?: number
}

export default function GamificationFeedback({
  isCorrect,
  xpGained = 10,
  streakCount = 0,
  accuracy = 0,
}: GamificationFeedbackProps) {
  const { isDark } = useTheme()

  if (isCorrect === undefined) return null

  const correctMessages = [
    { emoji: "🎉", text: "Fantastic!", subtext: "Keep this streak alive!" },
    { emoji: "⭐", text: "Perfect!", subtext: "You're on fire!" },
    { emoji: "🚀", text: "Excellent!", subtext: "Level up your knowledge!" },
    { emoji: "💯", text: "Flawless!", subtext: "That's how you do it!" },
    { emoji: "🏆", text: "Champion!", subtext: "You're crushing it!" },
  ]

  const wrongMessages = [
    { emoji: "📚", text: "Learning moment!", subtext: "Every mistake makes you stronger" },
    { emoji: "🔄", text: "Try again!", subtext: "You'll get it next time" },
    { emoji: "💪", text: "Keep grinding!", subtext: "Mistakes are progress" },
    { emoji: "🎯", text: "Close call!", subtext: "Review and retry later" },
    { emoji: "⚡", text: "Next one!", subtext: "Don't give up now" },
  ]

  const messages = isCorrect ? correctMessages : wrongMessages
  const randomMessage = messages[Math.floor(Math.random() * messages.length)]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
      className={`mt-6 p-4 md:p-6 rounded-lg border-2 text-center ${
        isCorrect
          ? isDark
            ? "border-green-500/50 bg-gradient-to-br from-green-500/15 to-emerald-500/15"
            : "border-green-400 bg-gradient-to-br from-green-100 to-emerald-100"
          : isDark
            ? "border-orange-500/50 bg-gradient-to-br from-orange-500/15 to-yellow-500/15"
            : "border-orange-400 bg-gradient-to-br from-orange-100 to-yellow-100"
      }`}
    >
      {/* Main Message */}
      <div className="mb-3">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl mb-2"
        >
          {randomMessage.emoji}
        </motion.div>
        <h3
          className={`text-xl md:text-2xl font-bold mb-1 ${
            isCorrect
              ? isDark
                ? "text-green-300"
                : "text-green-700"
              : isDark
                ? "text-orange-300"
                : "text-orange-700"
          }`}
        >
          {randomMessage.text}
        </h3>
        <p
          className={`text-sm md:text-base ${
            isCorrect
              ? isDark
                ? "text-green-200/80"
                : "text-green-600"
              : isDark
                ? "text-orange-200/80"
                : "text-orange-600"
          }`}
        >
          {randomMessage.subtext}
        </p>
      </div>

      {/* Stats Row */}
      {isCorrect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`flex justify-around text-sm font-semibold pt-3 border-t ${
            isDark ? "border-green-500/30" : "border-green-300"
          }`}
        >
          <div className="mt-3">
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`text-lg md:text-xl font-bold ${isDark ? "text-green-300" : "text-green-600"}`}
            >
              +{xpGained} XP
            </motion.div>
          </div>
          {streakCount > 0 && (
            <div className="mt-3">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className={`text-lg md:text-xl font-bold ${isDark ? "text-blue-300" : "text-blue-600"}`}
              >
                🔥 {streakCount}
              </motion.div>
            </div>
          )}
          <div className="mt-3">
            <div
              className={`text-lg md:text-xl font-bold ${isDark ? "text-purple-300" : "text-purple-600"}`}
            >
              {accuracy}% 📊
            </div>
          </div>
        </motion.div>
      )}

      {!isCorrect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-xs md:text-sm pt-3 border-t ${isDark ? "border-orange-500/30 text-orange-200" : "border-orange-300 text-orange-600"}`}
        >
          Accuracy: {accuracy}% | Keep practicing to improve!
        </motion.div>
      )}
    </motion.div>
  )
}
