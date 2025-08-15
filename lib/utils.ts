// Returns translated question and options for a state question if available
export function getStateQuestionTranslation(
  stateQuestions: Array<any>,
  id: string,
  language: string
) {
  const q = stateQuestions.find((q) => q.id === id)
  if (!q) return null
  const translation = q.translations?.[language]
  // If there's no translation for the requested language, return null so callers
  // can fall back to runtime translation instead of receiving German text.
  if (!translation) return null

  const questionText = translation.question || q.question || null
  const options = translation.options || q.options || []
  const explanation = translation.explanation || q.explanation || ""
  return {
    question: questionText,
    options,
    answerIndex: q.answerIndex,
    state: q.state,
    explanation,
  }
}
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
