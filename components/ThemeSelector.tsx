"use client"

import { useRef, useEffect, useState } from "react"
import { Moon, Sun, ChevronDown } from "lucide-react"
import { useTheme } from "@/lib/theme"

export default function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { isDark, toggle } = useTheme()
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

  const handleThemeSelect = (dark: boolean) => {
    if (dark !== isDark) {
      toggle()
    }
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
        {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        <span className="font-medium text-sm">{isDark ? "Dark" : "Light"}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute top-full right-0 mt-2 w-48 border rounded-lg z-50 ${
            isDark
              ? "bg-black/95 backdrop-blur-xl border-gray-700"
              : "bg-white/95 backdrop-blur border-gray-200"
          }`}
        >
          {[
            { label: "Light", isDark: false, icon: Sun },
            { label: "Dark", isDark: true, icon: Moon },
          ].map(({ label, isDark: themeMode, icon: Icon }) => (
            <button
              key={label}
              onClick={() => handleThemeSelect(themeMode)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors duration-200 ${
                isDark === themeMode
                  ? isDark
                    ? "bg-gray-900/50 text-white"
                    : "bg-gray-100 text-gray-900"
                  : isDark
                  ? "hover:bg-gray-900/30 text-gray-300"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium text-sm">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
