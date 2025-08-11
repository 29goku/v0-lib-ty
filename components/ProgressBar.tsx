"use client"

import { Progress } from "@/components/ui/progress"

interface ProgressBarProps {
  current: number
  total: number
  label?: string
  showNumbers?: boolean
}

export default function ProgressBar({ current, total, label = "Progress", showNumbers = true }: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        {showNumbers && (
          <span className="text-sm text-gray-500">
            {current} / {total}
          </span>
        )}
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="text-xs text-gray-500 text-right">{percentage.toFixed(1)}%</div>
    </div>
  )
}
