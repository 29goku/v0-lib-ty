"use client"

import React, { useState } from "react"
import { ChevronDown, X } from "lucide-react"
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
            className="w-full justify-between bg-black/60 border-2 border-purple-400/50 text-white hover:bg-black/80 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2">
              {icon}
              <span className="truncate">{getDisplayText()}</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-80 max-h-96 overflow-y-auto bg-black/90 border-2 border-purple-400/50 backdrop-blur-xl"
          align="start"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenuLabel className="text-purple-300 font-bold flex items-center justify-between">
            {label}
            {selectedValues.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleClearAll(e)}
                className="h-6 px-2 text-xs text-gray-400 hover:text-white"
              >
                Clear All
              </Button>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-purple-400/30" />

          {options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.id}
              checked={selectedValues.includes(option.id)}
              onCheckedChange={() => handleToggleOption(option.id)}
              onSelect={(e) => {
                e.preventDefault()
                handleToggleOption(option.id)
              }}
              className="text-white hover:bg-purple-500/20 focus:bg-purple-500/30"
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
              className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 border border-purple-400/50 rounded-md text-sm text-purple-200"
            >
              {option.emoji && <span>{option.emoji}</span>}
              <span>{option.label}</span>
              <button
                onClick={() => handleToggleOption(option.id)}
                className="ml-1 hover:bg-purple-500/30 rounded-full p-0.5"
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
