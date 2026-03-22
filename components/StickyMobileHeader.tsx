"use client"

import React from "react"
import Link from "next/link"
import { useTheme } from "@/lib/theme"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ThemeToggle from "@/components/ThemeToggle"
import LanguageSelector from "@/components/LanguageSelector"

interface StickyMobileHeaderProps {
  title?: string
  subtitle?: string
  showLanguage?: boolean
  showBackButton?: boolean
  backHref?: string
  rightContent?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export default function StickyMobileHeader({
  title,
  subtitle,
  showLanguage = true,
  showBackButton = true,
  backHref = "/",
  rightContent,
  children,
  className = "",
}: StickyMobileHeaderProps) {
  const { isDark } = useTheme()

  return (
    <>
      {/* Sticky Header on Mobile */}
      <div className={`fixed top-0 left-0 right-0 sm:hidden z-50 ${isDark ? 'bg-black/80 backdrop-blur-sm border-b border-gray-800' : 'bg-white/80 backdrop-blur-sm border-b border-gray-200'}`}>
        <div className="flex justify-between items-center px-3 py-3 gap-2">
          {showBackButton ? (
            <Link href={backHref}>
              <Button className={`border px-2 py-1.5 text-xs rounded transition-colors ${isDark ? 'border-gray-700 bg-transparent hover:bg-gray-900 text-gray-300 hover:text-white' : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900'}`}>
                <ArrowLeft className="w-3 h-3" />
              </Button>
            </Link>
          ) : (
            <div className="w-10"></div>
          )}

          <div className="flex-1">
            {title ? (
              <div>
                <h1 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {title}
                </h1>
                {subtitle && (
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {subtitle}
                  </p>
                )}
              </div>
            ) : (
              <div></div>
            )}
          </div>

          <div className="flex gap-1 items-center">
            {rightContent}
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
