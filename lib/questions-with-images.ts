// Import the questions with images data
import questionsData from '@/public/data/questions-with-images.json'

export interface QuestionWithImage {
  question_number: number
  question: string
  image: string
  options: string[]
  answer: string
}

// Get all questions with images
export const getAllQuestionsWithImages = (): QuestionWithImage[] => {
  return questionsData as QuestionWithImage[]
}

// Get a specific question by number
export const getQuestionByNumber = (questionNumber: number): QuestionWithImage | undefined => {
  return getAllQuestionsWithImages().find(q => q.question_number === questionNumber)
}

// Get all questions with images for a specific state
export const getStateQuestions = (stateCode: string): QuestionWithImage[] => {
  // State questions are in ranges:
  // Baden-Württemberg: 301-310
  // Bayern: 311-320
  // Berlin: 321-330
  // Brandenburg: 331-340
  // Bremen: 341-350
  // Hamburg: 351-360
  // Hessen: 361-370
  // Mecklenburg-Vorpommern: 371-380
  // Niedersachsen: 381-390
  // Nordrhein-Westfalen: 391-400
  // Rheinland-Pfalz: 401-410
  // Saarland: 411-420
  // Sachsen: 421-430
  // Sachsen-Anhalt: 431-440
  // Schleswig-Holstein: 441-450
  // Thüringen: 451-460

  const stateRanges: Record<string, [number, number]> = {
    'bw': [301, 310],
    'by': [311, 320],
    'be': [321, 330],
    'bb': [331, 340],
    'hb': [341, 350],
    'hh': [351, 360],
    'he': [361, 370],
    'mv': [371, 380],
    'ni': [381, 390],
    'nw': [391, 400],
    'rp': [401, 410],
    'sl': [411, 420],
    'sn': [421, 430],
    'st': [431, 440],
    'sh': [441, 450],
    'th': [451, 460],
  }

  const range = stateRanges[stateCode.toLowerCase()]
  if (!range) return []

  const [start, end] = range
  return getAllQuestionsWithImages().filter(q => q.question_number >= start && q.question_number <= end)
}

// Get the answer index for a question
export const getAnswerIndex = (question: QuestionWithImage): number => {
  const index = question.options.indexOf(question.answer)
  return index >= 0 ? index : 0
}

// Verify all images exist
export const verifyImages = (): { total: number; missing: string[] } => {
  const missing: string[] = []
  const questions = getAllQuestionsWithImages()

  questions.forEach(q => {
    // In a real app, you'd check if the file exists
    // For now, just collect the image paths
    if (!q.image) {
      missing.push(`Question ${q.question_number}`)
    }
  })

  return {
    total: questions.length,
    missing,
  }
}
