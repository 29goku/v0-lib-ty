import fs from "fs"
import path from "path"

interface Question {
  id: string
  category: string
  question: string
  options: string[]
  answerIndex: number
  explanation: string
}

// Sample questions for seeding - this would be expanded to 310 questions
const sampleQuestions: Question[] = [
  {
    id: "q001",
    category: "Politics",
    question: "What is the capital of Germany?",
    options: ["Berlin", "Munich", "Frankfurt", "Hamburg"],
    answerIndex: 0,
    explanation: "Berlin has been the federal capital of Germany since reunification in 1990.",
  },
  {
    id: "q002",
    category: "History",
    question: "When was the Berlin Wall built?",
    options: ["1959", "1961", "1963", "1965"],
    answerIndex: 1,
    explanation: "The Berlin Wall was built on August 13, 1961, to separate East and West Berlin.",
  },
  // Add more questions here to reach 310 total
]

const generateQuestions = (): Question[] => {
  const categories = ["Politics", "History", "Law", "Culture", "Geography"]
  const questions: Question[] = []

  // Generate 310 questions
  for (let i = 1; i <= 310; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const questionId = `q${i.toString().padStart(3, "0")}`

    questions.push({
      id: questionId,
      category,
      question: `Sample question ${i} about ${category.toLowerCase()}?`,
      options: [
        `Option A for question ${i}`,
        `Option B for question ${i}`,
        `Option C for question ${i}`,
        `Option D for question ${i}`,
      ],
      answerIndex: Math.floor(Math.random() * 4),
      explanation: `This is the explanation for question ${i} in the ${category} category.`,
    })
  }

  return questions
}

const seedQuestions = () => {
  const questions = generateQuestions()
  const dataDir = path.join(process.cwd(), "public", "data")
  const filePath = path.join(dataDir, "questions.json")

  // Create data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  // Write questions to file
  fs.writeFileSync(filePath, JSON.stringify(questions, null, 2))

  console.log(`✅ Successfully seeded ${questions.length} questions to ${filePath}`)
}

// Run the seed function
if (require.main === module) {
  seedQuestions()
}

export { seedQuestions, generateQuestions }
