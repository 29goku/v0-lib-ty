"use client"

import React from "react"
import Link from "next/link"
import { useTheme } from "@/lib/theme"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ThemeToggle from "@/components/ThemeToggle"
import LanguageSelector from "@/components/LanguageSelector"

interface DesktopHeaderProps {
  title?: string
  subtitle?: string
  showBackButton?: boolean
  backHref?: string
  showLanguage?: boolean
  centerContent?: React.ReactNode
  rightContent?: React.ReactNode
}

export default function DesktopHeader({
  title,
  subtitle,
  showBackButton = true,
  backHref = "/",
  showLanguage = true,
  centerContent,
  rightContent,
}: DesktopHeaderProps) {
  const { isDark } = useTheme()

  return (
    <div className="hidden sm:flex items-center justify-between mb-6 md:mb-8 gap-4">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <Link href={backHref}>
            <Button
              className={`border px-4 py-2 md:px-6 md:py-3 rounded-lg transition-all font-semibold text-sm md:text-base ${
                isDark
                  ? "border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white"
                  : "border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900"
              }`}
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Back
            </Button>
          </Link>
        )}
        {title && (
          <div>
            <h1
              className={`text-2xl md:text-3xl lg:text-4xl font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className={`text-sm md:text-base ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>

      {centerContent && <div className="flex-1">{centerContent}</div>}

      <div className="flex items-center gap-2 md:gap-3">
        {rightContent}
        <ThemeToggle />
        {showLanguage && <LanguageSelector />}
      </div>
    </div>
  )
}
