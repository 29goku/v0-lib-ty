/**
 * Icon System for Better UX
 * Uses Lucide React icons instead of emojis where possible
 * Provides consistent, professional appearance
 */

export const ICON_SIZES = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
  "2xl": "w-10 h-10",
  "3xl": "w-12 h-12",
  "4xl": "w-16 h-16",
} as const

export const ICON_COLORS = {
  // Status colors
  success: "text-green-400",
  error: "text-red-400",
  warning: "text-yellow-400",
  info: "text-blue-400",
  neutral: "text-gray-400",

  // Action colors
  primary: "text-purple-400",
  secondary: "text-cyan-400",
  accent: "text-pink-400",

  // State colors
  correct: "text-green-400",
  incorrect: "text-red-400",
  flagged: "text-yellow-400",
  pending: "text-gray-400",
  disabled: "text-gray-600",
} as const

/**
 * Icon mapping for different actions and states
 * Maps semantic meaning to Lucide icon names
 */
export const ICON_MAP = {
  // Navigation
  back: "ArrowLeft",
  forward: "ArrowRight",
  home: "Home",
  menu: "Menu",
  close: "X",
  settings: "Settings",

  // Actions
  flag: "Flag",
  unflag: "FlagOff",
  save: "Save",
  delete: "Trash2",
  edit: "Edit",
  copy: "Copy",
  share: "Share2",
  download: "Download",

  // Question related
  question: "HelpCircle",
  answer: "CheckCircle",
  explanation: "BookOpen",
  hint: "Lightbulb",
  skip: "SkipForward",

  // Language & Translation
  translate: "Languages",
  language: "Globe",
  speak: "Volume2",
  mute: "VolumeX",

  // Progress & Status
  correct: "Check",
  incorrect: "X",
  partial: "Minus",
  pending: "Clock",
  success: "CheckCircle2",
  failed: "XCircle",

  // Badges & Achievements
  badge: "Award",
  trophy: "Trophy",
  star: "Star",
  flame: "Flame",
  zap: "Zap",

  // Data
  chart: "BarChart3",
  stats: "Activity",
  score: "Target",
  time: "Clock",

  // Info
  info: "Info",
  warning: "AlertCircle",
  error: "AlertTriangle",
  success: "CheckCircle",

  // Categories
  category: "Tag",
  filter: "Filter",
  sort: "ArrowUpDown",

  // User
  user: "User",
  logout: "LogOut",
  login: "LogIn",
  profile: "UserCircle",

  // Test specific
  test: "Clipboard",
  practice: "Zap",
  review: "Eye",
  state: "MapPin",
} as const

/**
 * Icon components with common patterns
 */
export const ICON_COMPONENTS = {
  correct: {
    icon: "Check",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  incorrect: {
    icon: "X",
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  flagged: {
    icon: "Flag",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  pending: {
    icon: "Clock",
    color: "text-gray-400",
    bg: "bg-gray-500/10",
  },
  loading: {
    icon: "Loader2",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    animate: "animate-spin",
  },
} as const

/**
 * Helper function to get icon props
 */
export function getIconProps(
  name: keyof typeof ICON_MAP,
  size: keyof typeof ICON_SIZES = "md",
  color: keyof typeof ICON_COLORS = "neutral"
) {
  return {
    icon: ICON_MAP[name],
    size: ICON_SIZES[size],
    color: ICON_COLORS[color],
  }
}

/**
 * Badges with icons for different states
 */
export const ICON_BADGES = {
  correct: {
    icon: "Check",
    label: "Richtig",
    color: "text-green-400",
    bg: "bg-green-500/20 border-green-500/30",
  },
  incorrect: {
    icon: "X",
    label: "Falsch",
    color: "text-red-400",
    bg: "bg-red-500/20 border-red-500/30",
  },
  flagged: {
    icon: "Flag",
    label: "Markiert",
    color: "text-yellow-400",
    bg: "bg-yellow-500/20 border-yellow-500/30",
  },
  new: {
    icon: "Sparkles",
    label: "Neu",
    color: "text-blue-400",
    bg: "bg-blue-500/20 border-blue-500/30",
  },
  practice: {
    icon: "Zap",
    label: "Üben",
    color: "text-purple-400",
    bg: "bg-purple-500/20 border-purple-500/30",
  },
  test: {
    icon: "Target",
    label: "Test",
    color: "text-orange-400",
    bg: "bg-orange-500/20 border-orange-500/30",
  },
  state: {
    icon: "MapPin",
    label: "Bundesland",
    color: "text-cyan-400",
    bg: "bg-cyan-500/20 border-cyan-500/30",
  },
} as const

/**
 * Button icon presets
 */
export const BUTTON_ICONS = {
  primary: {
    icon: "ArrowRight",
    position: "right", // or 'left'
  },
  secondary: {
    icon: "ArrowLeft",
    position: "left",
  },
  success: {
    icon: "Check",
    position: "right",
  },
  delete: {
    icon: "Trash2",
    position: "right",
  },
  download: {
    icon: "Download",
    position: "right",
  },
  share: {
    icon: "Share2",
    position: "right",
  },
} as const

export default {
  ICON_SIZES,
  ICON_COLORS,
  ICON_MAP,
  ICON_COMPONENTS,
  ICON_BADGES,
  BUTTON_ICONS,
  getIconProps,
}
