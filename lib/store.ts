import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Language } from "./i18n"

export interface Question {
  id: string
  category: string
  question: string
  image?: string // Add optional image field
  options: string[]
  answerIndex: number
  explanation: string
}

export interface UserProgress {
  xp: number
  streak: number
  maxStreak: number
  questionsAnswered: number
  correctAnswers: number
  flaggedQuestions: string[]
  completedQuestions: string[]
  badges: string[]
  lastStudyDate: string
}

export interface AppState {
  questions: Question[]
  stateQuestions: Question[]
  currentQuestionIndex: number
  userProgress: UserProgress
  darkMode: boolean
  language: Language
  selectedCategory: string | null
  selectedState: string | null
  testMode: boolean
  testStartTime: number | null
  testAnswers: { questionId: string; selectedIndex: number; correct: boolean }[]

  // Actions
  setQuestions: (questions: Question[]) => void
  setStateQuestions: (questions: Question[]) => void
  nextQuestion: () => void
  previousQuestion: () => void
  setCurrentQuestionIndex: (index: number) => void
  answerQuestion: (questionId: string, selectedIndex: number, correct: boolean) => void
  flagQuestion: (questionId: string) => void
  unflagQuestion: (questionId: string) => void
  addXP: (amount: number) => void
  updateStreak: (correct: boolean) => void
  toggleDarkMode: () => void
  setLanguage: (language: Language) => void
  setSelectedCategory: (category: string | null) => void
  setSelectedState: (state: string | null) => void
  startTest: () => void
  endTest: () => void
  resetProgress: () => void
  addBadge: (badge: string) => void
  exportProgress: () => string
  importProgress: (data: string) => void
  loadQuestions: () => Promise<Question[]>
}

const initialProgress: UserProgress = {
  xp: 0,
  streak: 0,
  maxStreak: 0,
  questionsAnswered: 0,
  correctAnswers: 0,
  flaggedQuestions: [],
  completedQuestions: [],
  badges: [],
  lastStudyDate: new Date().toISOString().split("T")[0],
}

// Fallback questions in case of loading errors
const fallbackQuestions: Question[] = [
  {
    id: "fallback-1",
    category: "General",
    question: "What is the capital of Germany?",
    options: ["Berlin", "Munich", "Hamburg", "Frankfurt"],
    answerIndex: 0,
    explanation: "Berlin is the capital and largest city of Germany.",
  },
  {
    id: "fallback-2",
    category: "General",
    question: "What is the largest planet in our solar system?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    answerIndex: 2,
    explanation: "Jupiter is the largest planet in our solar system.",
  },
]

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      questions: [],
      stateQuestions: [],
      currentQuestionIndex: 0,
      userProgress: initialProgress,
      darkMode: false,
      language: "en",
      selectedCategory: null,
      selectedState: null,
      testMode: false,
      testStartTime: null,
      testAnswers: [],

      setQuestions: (questions) => set({ questions }),
      setStateQuestions: (questions) => set({ stateQuestions: questions }),

      nextQuestion: () =>
        set((state) => {
          const allQuestions = [...state.questions, ...state.stateQuestions]
          return {
            currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, allQuestions.length - 1),
          }
        }),

      previousQuestion: () =>
        set((state) => ({
          currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
        })),

      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

      answerQuestion: (questionId, selectedIndex, correct) =>
        set((state) => {
          const newProgress = { ...state.userProgress }
          newProgress.questionsAnswered += 1
          if (correct) {
            newProgress.correctAnswers += 1
          }

          if (!newProgress.completedQuestions.includes(questionId)) {
            newProgress.completedQuestions.push(questionId)
          }

          newProgress.lastStudyDate = new Date().toISOString().split("T")[0]

          const newTestAnswers = state.testMode
            ? [...state.testAnswers, { questionId, selectedIndex, correct }]
            : state.testAnswers

          return {
            userProgress: newProgress,
            testAnswers: newTestAnswers,
          }
        }),

      flagQuestion: (questionId) =>
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            flaggedQuestions: [...state.userProgress.flaggedQuestions, questionId],
          },
        })),

      unflagQuestion: (questionId) =>
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            flaggedQuestions: state.userProgress.flaggedQuestions.filter((id) => id !== questionId),
          },
        })),

      addXP: (amount) =>
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            xp: state.userProgress.xp + amount,
          },
        })),

      updateStreak: (correct) =>
        set((state) => {
          const newProgress = { ...state.userProgress }
          if (correct) {
            newProgress.streak += 1
            newProgress.maxStreak = Math.max(newProgress.maxStreak, newProgress.streak)
          } else {
            newProgress.streak = 0
          }
          return { userProgress: newProgress }
        }),

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      setLanguage: (language) => set({ language }),

      setSelectedCategory: (category) => set({ selectedCategory: category }),

      setSelectedState: (state) => set({ selectedState: state }),

      startTest: () =>
        set({
          testMode: true,
          testStartTime: Date.now(),
          testAnswers: [],
        }),

      endTest: () =>
        set({
          testMode: false,
          testStartTime: null,
        }),

      resetProgress: () => set({ userProgress: initialProgress }),

      addBadge: (badge) =>
        set((state) => {
          if (!state.userProgress.badges.includes(badge)) {
            return {
              userProgress: {
                ...state.userProgress,
                badges: [...state.userProgress.badges, badge],
              },
            }
          }
          return state
        }),

      exportProgress: () => {
        const state = get()
        return JSON.stringify(
          {
            userProgress: state.userProgress,
            language: state.language,
            darkMode: state.darkMode,
            selectedState: state.selectedState,
            exportDate: new Date().toISOString(),
          },
          null,
          2,
        )
      },

      importProgress: (data) => {
        try {
          const parsed = JSON.parse(data)
          if (parsed.userProgress) {
            set({
              userProgress: parsed.userProgress,
              language: parsed.language || "en",
              darkMode: parsed.darkMode || false,
              selectedState: parsed.selectedState || null,
            })
          }
        } catch (error) {
          console.error("Failed to import progress:", error)
        }
      },

      loadQuestions: async () => {
        console.log("🔥 Loading questions from JSON...")
        try {
          const response = await fetch("/data/questions.json")
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const questions = await response.json()
          console.log("🚀 Successfully loaded", questions.length, "questions!")
          set({ questions })
          return questions
        } catch (error) {
          console.log("Failed to load questions:", error)
          // Try loading state questions as fallback
          try {
            const stateResponse = await fetch("/data/state-questions.json")
            if (!stateResponse.ok) {
              throw new Error(`HTTP error! status: ${stateResponse.status}`)
            }
            const stateData = await stateResponse.json()
            // Flatten all state questions into a single array
            const allQuestions = Object.values(stateData).flat()
            console.log("🚀 Successfully loaded", allQuestions.length, "state questions!")
            set({ questions: allQuestions })
            return allQuestions
          } catch (stateError) {
            console.log("Failed to load state questions:", stateError)
            // Use fallback questions
            console.log("💪 Using fallback questions")
            set({ questions: fallbackQuestions })
            return fallbackQuestions
          }
        }
      },
    }),
    {
      name: "leben-in-deutschland-storage",
      partialize: (state) => ({
        userProgress: state.userProgress,
        darkMode: state.darkMode,
        language: state.language,
        selectedState: state.selectedState,
      }),
    },
  ),
)
