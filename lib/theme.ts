import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  isDark: boolean
  toggle: () => void
  setDark: (dark: boolean) => void
}

export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: true,
      toggle: () => set((state) => ({ isDark: !state.isDark })),
      setDark: (dark) => set({ isDark: dark }),
    }),
    {
      name: 'theme-storage',
    }
  )
)

// Theme colors
export const themeColors = {
  dark: {
    bg: 'bg-black',
    bgSecondary: 'bg-gray-950',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    textTertiary: 'text-gray-500',
    border: 'border-gray-800',
    borderLight: 'border-gray-700',
    card: 'bg-white/5',
    hover: 'hover:bg-gray-900/30',
  },
  light: {
    bg: 'bg-white',
    bgSecondary: 'bg-gray-50',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    textTertiary: 'text-gray-500',
    border: 'border-gray-200',
    borderLight: 'border-gray-300',
    card: 'bg-gray-50',
    hover: 'hover:bg-gray-100',
  },
}

export type Theme = 'dark' | 'light'

export const getTheme = (isDark: boolean): typeof themeColors.dark => {
  return isDark ? themeColors.dark : themeColors.light
}
