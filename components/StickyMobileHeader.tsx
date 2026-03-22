"use client"

import React from "react"
import { useTheme } from "@/lib/theme"
import ThemeToggle from "@/components/ThemeToggle"
import LanguageSelector from "@/components/LanguageSelector"

interface StickyMobileHeaderProps {
  title?: string
  showLanguage?: boolean
  children?: React.ReactNode
  className?: string
}

export default function StickyMobileHeader({
  title,
  showLanguage = true,
  children,
  className = "",
}: StickyMobileHeaderProps) {
  const { isDark } = useTheme()

  return (
    <>
      {/* Sticky Header on Mobile */}
      <div className={`fixed top-0 left-0 right-0 sm:hidden z-50 ${isDark ? 'bg-black/80 backdrop-blur-sm border-b border-gray-800' : 'bg-white/80 backdrop-blur-sm border-b border-gray-200'}`}>
        <div className="flex justify-between items-center px-4 py-3">
          {title ? (
            <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h1>
          ) : (
            <div></div>
          )}
          <div className="flex gap-2">
            {children}
            <ThemeToggle />
            {showLanguage && <LanguageSelector />}
          </div>
        </div>
      </div>
      {/* Add padding to account for fixed mobile header */}
      <div className="sm:hidden h-14"></div>
    </>
  )
}
