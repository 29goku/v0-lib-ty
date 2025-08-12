"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { useStore } from "@/lib/store"
import { languageNames, languageFlags, type Language } from "@/lib/i18n"

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage } = useStore()
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
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-lg text-white hover:from-purple-600/40 hover:to-pink-600/40 transition-all duration-200"
      >
        <span className="text-lg">{languageFlags[language]}</span>
        <span className="font-medium">{languageNames[language]}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-black/90 backdrop-blur-xl border border-purple-400/30 rounded-lg shadow-2xl shadow-purple-500/25 z-50 max-h-64 overflow-y-auto">
          {Object.entries(languageNames).map(([code, name]) => (
            <button
              key={code}
              onClick={() => handleLanguageSelect(code as Language)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-purple-600/20 transition-colors duration-200 ${
                language === code ? "bg-purple-600/30 text-purple-300" : "text-white"
              }`}
            >
              <span className="text-lg">{languageFlags[code as Language]}</span>
              <span className="font-medium">{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
