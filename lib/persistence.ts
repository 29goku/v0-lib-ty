export interface ProgressData {
  userProgress: any
  exportDate: string
}

export const saveProgressToFile = (data: ProgressData): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `leben-in-deutschland-progress-${new Date().toISOString().split("T")[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const loadProgressFromFile = (file: File): Promise<ProgressData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        resolve(data)
      } catch (error) {
        reject(new Error("Invalid file format"))
      }
    }
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsText(file)
  })
}

export const validateProgressData = (data: any): boolean => {
  return (
    data &&
    typeof data === "object" &&
    data.userProgress &&
    typeof data.userProgress.xp === "number" &&
    typeof data.userProgress.streak === "number" &&
    Array.isArray(data.userProgress.badges) &&
    Array.isArray(data.userProgress.flaggedQuestions) &&
    Array.isArray(data.userProgress.completedQuestions)
  )
}

// Debounced localStorage save
let saveTimeout: NodeJS.Timeout | null = null

export const debouncedSave = (key: string, data: any, delay = 1000): void => {
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }

  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error("Failed to save to localStorage:", error)
    }
  }, delay)
}

export const loadFromLocalStorage = (key: string): any | null => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Failed to load from localStorage:", error)
    return null
  }
}
