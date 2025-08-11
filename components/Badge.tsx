"use client"
import { Trophy, Flame, Target, Star, Award, Zap } from "lucide-react"

interface BadgeProps {
  type: string
  earned?: boolean
  size?: "sm" | "md" | "lg"
}

const badgeConfig = {
  "first-correct": {
    icon: Target,
    label: "First Correct",
    description: "Answer your first question correctly",
    color: "bg-blue-500",
  },
  "streak-5": {
    icon: Flame,
    label: "5 Streak",
    description: "Get 5 questions right in a row",
    color: "bg-orange-500",
  },
  "streak-10": {
    icon: Flame,
    label: "10 Streak",
    description: "Get 10 questions right in a row",
    color: "bg-red-500",
  },
  "xp-100": {
    icon: Star,
    label: "100 XP",
    description: "Earn 100 experience points",
    color: "bg-yellow-500",
  },
  "xp-500": {
    icon: Award,
    label: "500 XP",
    description: "Earn 500 experience points",
    color: "bg-purple-500",
  },
  "test-master": {
    icon: Trophy,
    label: "Test Master",
    description: "Pass a practice test",
    color: "bg-green-500",
  },
  "speed-demon": {
    icon: Zap,
    label: "Speed Demon",
    description: "Complete 50 questions in one session",
    color: "bg-cyan-500",
  },
}

export default function Badge({ type, earned = false, size = "md" }: BadgeProps) {
  const config = badgeConfig[type as keyof typeof badgeConfig]

  if (!config) return null

  const Icon = config.icon
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  return (
    <div className={`flex flex-col items-center space-y-2 ${earned ? "" : "opacity-50"}`}>
      <div
        className={`
          ${sizeClasses[size]} 
          ${earned ? config.color : "bg-gray-300"} 
          rounded-full flex items-center justify-center text-white
          ${earned ? "shadow-lg" : ""}
        `}
      >
        <Icon className={`${size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : "w-8 h-8"}`} />
      </div>
      <div className="text-center">
        <div className={`text-xs font-semibold ${earned ? "text-gray-900 dark:text-white" : "text-gray-500"}`}>
          {config.label}
        </div>
        {size !== "sm" && <div className="text-xs text-gray-500 max-w-20 text-center">{config.description}</div>}
      </div>
    </div>
  )
}
