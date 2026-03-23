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
  incorrectAnswers?: string[] // newly added optional list of incorrect question IDs

  // Enhanced tracking for statistics dashboard
  categoryStats?: { [category: string]: { correct: number; total: number } }
  dailyStats?: { [date: string]: { correct: number; total: number; xp: number } }
  testAttempts?: Array<{
    date: string
    score: number
    totalQuestions: number
    timeSpent: number
    state?: string
  }>
  studySessionCount?: number
}

export interface AppState {
  questions: Question[]
  stateQuestions: Question[]
  testQuestions: Question[] // Separate questions for test mode
  currentQuestionIndex: number
  userProgress: UserProgress
  darkMode: boolean
  language: Language
  selectedCategory: string | null
  selectedState: string | null
  testMode: boolean
  testStartTime: number | null
  testAnswers: { questionId: string; selectedIndex: number; correct: boolean }[]
  lastTestQuestions: Question[] // Store questions from completed test for review
  lastTestAnswers: { questionId: string; selectedIndex: number; correct: boolean }[] // Store answers from completed test for review

  // Actions
  setQuestions: (questions: Question[]) => void
  setStateQuestions: (questions: Question[]) => void
  setTestQuestions: (questions: Question[]) => void
  nextQuestion: () => void
  previousQuestion: () => void
  setCurrentQuestionIndex: (index: number) => void
  answerQuestion: (questionId: string, selectedIndex: number, correct: boolean) => void
  answerQuestionWithCategory: (questionId: string, selectedIndex: number, correct: boolean, category: string) => void
  recordTestAttempt: (score: number, totalQuestions: number, timeSpent: number, state?: string) => void
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
  incorrectAnswers: [],
  categoryStats: {},
  dailyStats: {},
  testAttempts: [],
  studySessionCount: 0,
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
      testQuestions: [],
      currentQuestionIndex: 0,
      userProgress: initialProgress,
      darkMode: false,
      language: "en",
      selectedCategory: null,
      selectedState: null,
      testMode: false,
      testStartTime: null,
      testAnswers: [],
      lastTestQuestions: [],
      lastTestAnswers: [],

      setQuestions: (questions) => set({ questions }),
      setStateQuestions: (questions) => set({ stateQuestions: questions }),
      setTestQuestions: (questions) => set({ testQuestions: questions }),

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
          const isNewQuestion = !newProgress.completedQuestions.includes(questionId)
          const wasIncorrect = newProgress.incorrectAnswers?.includes(questionId)

          // Only increment questionsAnswered if it's a new question, and cap at total questions
          if (isNewQuestion) {
            newProgress.questionsAnswered += 1
          }

          if (correct) {
            // Only increment correctAnswers if this is a new correct answer
            // or if it was previously marked incorrect (correcting a mistake)
            if (isNewQuestion || wasIncorrect) {
              newProgress.correctAnswers += 1
            }
            // If previously marked incorrect, remove from incorrectAnswers
            if (newProgress.incorrectAnswers) {
              newProgress.incorrectAnswers = newProgress.incorrectAnswers.filter((id) => id !== questionId)
            }
          } else {
            // mark as incorrect (avoid duplicates)
            if (!newProgress.incorrectAnswers) newProgress.incorrectAnswers = []
            if (!newProgress.incorrectAnswers.includes(questionId)) newProgress.incorrectAnswers.push(questionId)
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

      answerQuestionWithCategory: (questionId, selectedIndex, correct, category) =>
        set((state) => {
          const newProgress = { ...state.userProgress }
          const isNewQuestion = !newProgress.completedQuestions.includes(questionId)
          const wasIncorrect = newProgress.incorrectAnswers?.includes(questionId)

          // Track category stats
          if (!newProgress.categoryStats) newProgress.categoryStats = {}
          if (!newProgress.categoryStats[category]) {
            newProgress.categoryStats[category] = { correct: 0, total: 0 }
          }
          newProgress.categoryStats[category].total += 1
          if (correct) {
            newProgress.categoryStats[category].correct += 1
          }

          // Track daily stats
          const today = new Date().toISOString().split("T")[0]
          if (!newProgress.dailyStats) newProgress.dailyStats = {}
          if (!newProgress.dailyStats[today]) {
            newProgress.dailyStats[today] = { correct: 0, total: 0, xp: 0 }
          }
          newProgress.dailyStats[today].total += 1
          if (correct) {
            newProgress.dailyStats[today].correct += 1
          }

          // Only increment questionsAnswered if it's a new question, and cap at total questions
          if (isNewQuestion) {
            newProgress.questionsAnswered += 1
          }

          if (correct) {
            // Only increment correctAnswers if this is a new correct answer
            // or if it was previously marked incorrect (correcting a mistake)
            if (isNewQuestion || wasIncorrect) {
              newProgress.correctAnswers += 1
            }
            newProgress.dailyStats[today].xp += 10
            if (newProgress.incorrectAnswers) {
              newProgress.incorrectAnswers = newProgress.incorrectAnswers.filter((id) => id !== questionId)
            }
          } else {
            if (!newProgress.incorrectAnswers) newProgress.incorrectAnswers = []
            if (!newProgress.incorrectAnswers.includes(questionId)) newProgress.incorrectAnswers.push(questionId)
          }

          if (!newProgress.completedQuestions.includes(questionId)) {
            newProgress.completedQuestions.push(questionId)
          }

          newProgress.lastStudyDate = today

          return { userProgress: newProgress }
        }),

      recordTestAttempt: (score, totalQuestions, timeSpent, state) =>
        set((state_) => {
          const newProgress = { ...state_.userProgress }
          if (!newProgress.testAttempts) newProgress.testAttempts = []
          newProgress.testAttempts.push({
            date: new Date().toISOString(),
            score,
            totalQuestions,
            timeSpent,
            state,
          })
          if (!newProgress.studySessionCount) newProgress.studySessionCount = 0
          newProgress.studySessionCount += 1
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
        set((state) => ({
          testMode: false,
          testStartTime: null,
          lastTestQuestions: state.testQuestions,
          lastTestAnswers: state.testAnswers,
          testQuestions: [],
          testAnswers: [],
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
          // Try multiple possible paths for questions.json
          let response = await fetch("/data/questions.json")

          // If not found, try alternate paths
          if (!response.ok) {
            console.warn("Primary path failed, trying alternate paths...")
            response = await fetch("/public/data/questions.json")
          }

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          // cast to Question[] so TypeScript knows the shape
          const questions = (await response.json()) as Question[]
          console.log("🚀 Successfully loaded", questions.length, "questions!")

          if (questions.length === 0) {
            throw new Error("Questions array is empty")
          }

          set({ questions })
          return questions
        } catch (error) {
          console.error("Failed to load questions from questions.json:", error)
          // Try loading state questions as fallback
          try {
            const stateResponse = await fetch("/data/state-questions.json")
            if (!stateResponse.ok) {
              throw new Error(`HTTP error! status: ${stateResponse.status}`)
            }
            const stateData = await stateResponse.json()
            // Flatten all state questions into a single array
            const allQuestions = (Object.values(stateData).flat() as Question[])
            console.warn("⚠️ Loaded", allQuestions.length, "state questions as fallback")
            set({ questions: allQuestions })
            return allQuestions
          } catch (stateError) {
            console.error("Failed to load state questions:", stateError)
            // Use fallback questions
            console.warn("💪 Using built-in fallback questions")
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
        lastTestQuestions: state.lastTestQuestions,
        lastTestAnswers: state.lastTestAnswers,
      }),
    },
  ),
)
