"use client"

import React, { useState } from "react"
import { ChevronDown, X } from "lucide-react"
import { useTheme } from "@/lib/theme"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MultiSelectOption {
  id: string
  label: string
  emoji?: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  selectedValues: string[]
  onSelectionChange: (values: string[]) => void
  placeholder: string
  label: string
  icon?: React.ReactNode
  maxDisplayItems?: number
  className?: string
}

export function MultiSelect({
  options,
  selectedValues,
  onSelectionChange,
  placeholder,
  label,
  icon,
  maxDisplayItems = 2,
  className = "",
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { isDark } = useTheme()

  const handleToggleOption = (optionId: string, event?: React.MouseEvent) => {
    // Prevent dropdown from closing
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    if (selectedValues.includes(optionId)) {
      onSelectionChange(selectedValues.filter(id => id !== optionId))
    } else {
      onSelectionChange([...selectedValues, optionId])
    }
  }

  const handleClearAll = (event?: React.MouseEvent) => {
    // Prevent dropdown from closing
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    onSelectionChange([])
  }

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder
    }

    if (selectedValues.length <= maxDisplayItems) {
      return selectedValues
        .map(id => options.find(opt => opt.id === id)?.label)
        .filter(Boolean)
        .join(", ")
    }

    return `${selectedValues.length} selected`
  }

  const getSelectedOptions = () => {
    return selectedValues
      .map(id => options.find(opt => opt.id === id))
      .filter(Boolean) as MultiSelectOption[]
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`w-full justify-between bg-transparent border transition-colors ${isDark ? 'border-gray-700 text-gray-300 hover:bg-gray-900/20 hover:text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <div className="flex items-center gap-2">
              {icon}
              <span className="truncate">{getDisplayText()}</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={`w-80 max-h-96 overflow-y-auto border ${isDark ? 'bg-black border-gray-700' : 'bg-white border-gray-200'}`}
          align="start"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenuLabel className={`font-semibold flex items-center justify-between ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {label}
            {selectedValues.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleClearAll(e)}
                className={`h-6 px-2 text-xs ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Clear All
              </Button>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className={isDark ? 'bg-gray-800' : 'bg-gray-200'} />

          {options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.id}
              checked={selectedValues.includes(option.id)}
              onCheckedChange={() => handleToggleOption(option.id)}
              onSelect={(e) => {
                e.preventDefault()
                handleToggleOption(option.id)
              }}
              className={isDark ? 'text-gray-300 hover:bg-gray-900/20 focus:bg-gray-900/30' : 'text-gray-700 hover:bg-gray-100 focus:bg-gray-100'}
            >
              <div className="flex items-center gap-2">
                {option.emoji && <span>{option.emoji}</span>}
                <span>{option.label}</span>
              </div>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Selected items display */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {getSelectedOptions().map((option) => (
            <div
              key={option.id}
              className={`inline-flex items-center gap-1 px-2 py-1 border rounded text-sm ${isDark ? 'bg-gray-900/30 border-gray-700 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-700'}`}
            >
              {option.emoji && <span>{option.emoji}</span>}
              <span>{option.label}</span>
              <button
                onClick={() => handleToggleOption(option.id)}
                className={`ml-1 rounded-full p-0.5 transition-colors ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-200/50'}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
