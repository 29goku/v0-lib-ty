"use client"

import { useTheme } from "@/lib/theme"
import { Icon } from "@/components/Icon"

function ThemeToggle() {
  const { isDark, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className="border border-gray-700 bg-transparent hover:bg-gray-900/30 text-gray-300 hover:text-white p-2 rounded transition-colors"
      title={isDark ? "Light mode" : "Dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Icon name="Sun" size="sm" color="text-gray-300" />
      ) : (
        <Icon name="Moon" size="sm" color="text-gray-600" />
      )}
    </button>
  )
}

export default ThemeToggle
