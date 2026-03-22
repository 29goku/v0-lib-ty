"use client"

import { ReactNode } from "react"
import { useTheme } from "@/lib/theme"

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { isDark } = useTheme()

  return (
    <div className={isDark ? "dark" : "light"}>
      {children}
    </div>
  )
}
