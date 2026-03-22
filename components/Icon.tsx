/**
 * Reusable Icon Component
 * Uses Lucide React icons with consistent styling
 */

import React from "react"
import * as Icons from "lucide-react"

interface IconProps {
  name: keyof typeof Icons
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl"
  color?: string
  className?: string
  animate?: boolean
  onClick?: () => void
  title?: string
}

const SIZES = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
  "2xl": "w-10 h-10",
  "3xl": "w-12 h-12",
  "4xl": "w-16 h-16",
}

export const Icon = React.forwardRef<HTMLDivElement, IconProps>(
  ({
    name,
    size = "md",
    color = "text-gray-400",
    className = "",
    animate = false,
    onClick,
    title,
  }, ref) => {
    // Get the icon component
    const IconComponent = Icons[name as keyof typeof Icons] as React.ComponentType<any>

    if (!IconComponent) {
      return <div ref={ref} title="Icon not found" className="text-gray-600">?</div>
    }

    return (
      <div
        ref={ref}
        onClick={onClick}
        title={title}
        className={`inline-flex items-center justify-center ${
          onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
        } ${className}`}
      >
        <IconComponent
          className={`${SIZES[size]} ${color} ${
            animate ? "animate-spin" : ""
          }`}
        />
      </div>
    )
  }
)

Icon.displayName = "Icon"

/**
 * Icon with label
 */
export const IconLabel = ({
  icon,
  label,
  size = "md",
  color = "text-gray-400",
  layout = "row",
}: {
  icon: keyof typeof Icons
  label: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  color?: string
  layout?: "row" | "column"
}) => {
  return (
    <div className={`flex items-center gap-2 ${layout === "column" ? "flex-col" : ""}`}>
      <Icon name={icon} size={size} color={color} />
      <span className="text-sm">{label}</span>
    </div>
  )
}

/**
 * Animated loading icon
 */
export const LoadingIcon = ({
  size = "md",
  color = "text-blue-400",
}: {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  color?: string
}) => (
  <Icon name="Loader2" size={size} color={color} animate />
)

/**
 * Status icon with background
 */
export const StatusIcon = ({
  status,
  size = "md",
}: {
  status: "correct" | "incorrect" | "flagged" | "pending" | "loading"
  size?: "xs" | "sm" | "md" | "lg" | "xl"
}) => {
  const statusConfig = {
    correct: { icon: "Check", color: "text-green-400", bg: "bg-green-500/10" },
    incorrect: { icon: "X", color: "text-red-400", bg: "bg-red-500/10" },
    flagged: { icon: "Flag", color: "text-yellow-400", bg: "bg-yellow-500/10" },
    pending: { icon: "Clock", color: "text-gray-400", bg: "bg-gray-500/10" },
    loading: { icon: "Loader2", color: "text-blue-400", bg: "bg-blue-500/10", animate: true },
  }

  const config = statusConfig[status]

  return (
    <div className={`rounded-full p-2 ${config.bg}`}>
      <Icon
        name={config.icon as keyof typeof Icons}
        size={size}
        color={config.color}
        animate={config.animate}
      />
    </div>
  )
}

/**
 * Action icon button
 */
export const IconButton = React.forwardRef<
  HTMLButtonElement,
  {
    icon: keyof typeof Icons
    label?: string
    onClick: () => void
    size?: "sm" | "md" | "lg"
    variant?: "primary" | "secondary" | "ghost" | "danger"
    disabled?: boolean
  }
>(
  ({
    icon,
    label,
    onClick,
    size = "md",
    variant = "ghost",
    disabled = false,
  }, ref) => {
    const sizeClasses = {
      sm: "p-1.5",
      md: "p-2",
      lg: "p-2.5",
    }

    const variantClasses = {
      primary: "bg-purple-500/20 hover:bg-purple-500/30 text-purple-400",
      secondary: "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400",
      ghost: "hover:bg-gray-500/20 text-gray-400",
      danger: "bg-red-500/20 hover:bg-red-500/30 text-red-400",
    }

    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        title={label}
        className={`
          rounded-lg transition-all
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <Icon name={icon} size={size === "sm" ? "sm" : size === "lg" ? "lg" : "md"} />
      </button>
    )
  }
)

IconButton.displayName = "IconButton"

/**
 * Badge with icon
 */
export const IconBadge = ({
  icon,
  label,
  color = "blue",
}: {
  icon: keyof typeof Icons
  label: string
  color?: "blue" | "green" | "red" | "yellow" | "purple" | "cyan"
}) => {
  const colorClasses = {
    blue: "bg-blue-500/20 border-blue-500/30 text-blue-400",
    green: "bg-green-500/20 border-green-500/30 text-green-400",
    red: "bg-red-500/20 border-red-500/30 text-red-400",
    yellow: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400",
    purple: "bg-purple-500/20 border-purple-500/30 text-purple-400",
    cyan: "bg-cyan-500/20 border-cyan-500/30 text-cyan-400",
  }

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1
        border rounded-full text-xs font-medium
        ${colorClasses[color]}
      `}
    >
      <Icon name={icon} size="xs" />
      {label}
    </div>
  )
}

export default Icon
