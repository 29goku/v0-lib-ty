"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Globe } from "lucide-react"
import { useStore } from "@/lib/store"
import { useTheme } from "@/lib/theme"
import { languageNames, languageFlags, type Language } from "@/lib/i18n"

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage } = useStore()
  const { isDark } = useTheme()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 border rounded transition-all ${
          isDark
            ? "border-gray-700 bg-transparent hover:bg-gray-900/30 text-gray-300 hover:text-white"
            : "border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900"
        }`}
      >
        <Globe className="w-4 h-4" />
        <span className="text-lg">{languageFlags[language]}</span>
        <span className="font-medium text-sm">{languageNames[language]}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 w-48 border rounded-lg z-50 max-h-64 overflow-y-auto ${
          isDark
            ? "bg-black/95 backdrop-blur-xl border-gray-700"
            : "bg-white/95 backdrop-blur border-gray-200"
        }`}>
          {Object.entries(languageNames).map(([code, name]) => (
            <button
              key={code}
              onClick={() => handleLanguageSelect(code as Language)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors duration-200 ${
                language === code
                  ? isDark
                    ? "bg-gray-900/50 text-white"
                    : "bg-gray-100 text-gray-900"
                  : isDark
                  ? "hover:bg-gray-900/30 text-gray-300"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <span className="text-lg">{languageFlags[code as Language]}</span>
              <span className="font-medium text-sm">{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
