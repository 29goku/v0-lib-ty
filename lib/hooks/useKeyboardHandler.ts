import { useEffect } from "react"
import { KEYBOARD_SHORTCUTS } from "../swipe-card-constants"
import { getOptionIndexFromKeyboard, isTypingInInput } from "../swipe-card-utils"
import type { Question } from "../store"

interface UseKeyboardHandlerProps {
  question: Question
  showAnswer: boolean
  onSwipe: (direction: "left" | "right") => void
  onAnswerSelect: (index: number) => void
}

export const useKeyboardHandler = ({
  question,
  showAnswer,
  onSwipe,
  onAnswerSelect
}: UseKeyboardHandlerProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if typing into inputs, textareas or contenteditable elements
      const target = event.target as HTMLElement | null
      if (isTypingInInput(target)) return

      // Navigation: Arrow keys or A/D
      if (KEYBOARD_SHORTCUTS.navigation.right.includes(event.key)) {
        event.preventDefault()
        onSwipe('right')
        return
      }
      if (KEYBOARD_SHORTCUTS.navigation.left.includes(event.key)) {
        event.preventDefault()
        onSwipe('left')
        return
      }

      // Answer selection
      const optionIndex = getOptionIndexFromKeyboard(event)

      if (optionIndex !== null && !showAnswer) {
        if (question && optionIndex < (Array.isArray(question.options) ? question.options.length : 0)) {
          event.preventDefault()
          onAnswerSelect(optionIndex)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [question?.id, question?.options, showAnswer, onSwipe, onAnswerSelect])
}
