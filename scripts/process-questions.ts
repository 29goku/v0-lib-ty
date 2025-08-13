import fs from "fs"
import path from "path"

interface NewQuestion {
  id: string
  category: string
  question: string
  options: string[]
  answerIndex: number
  explanation: string
}

interface TranslatedQuestion extends NewQuestion {
  translations: Record<string, string>
  optionTranslations: Record<string, string[]>
  explanationTranslations: Record<string, string>
}

async function processQuestions() {
  try {
    // Read the new questions file
    const newQuestionsPath = path.join(process.cwd(), "public/data/new-questions.json")
    const newQuestionsData = fs.readFileSync(newQuestionsPath, "utf-8")
    const newQuestions: NewQuestion[] = JSON.parse(newQuestionsData)

    // Read existing questions to maintain translation structure
    const existingQuestionsPath = path.join(process.cwd(), "public/data/questions.json")
    const existingQuestionsData = fs.readFileSync(existingQuestionsPath, "utf-8")
    const existingQuestions: TranslatedQuestion[] = JSON.parse(existingQuestionsData)

    // Create a map of existing questions by ID for reference
    const existingQuestionsMap = new Map(existingQuestions.map((q) => [q.id, q]))

    // Process new questions and add translation structure
    const processedQuestions: TranslatedQuestion[] = newQuestions.map((newQ) => {
      const existing = existingQuestionsMap.get(newQ.id)

      if (existing) {
        // Update existing question with new content but keep translations
        return {
          ...existing,
          question: newQ.question,
          options: newQ.options,
          answerIndex: newQ.answerIndex,
          explanation: newQ.explanation,
          category: newQ.category,
        }
      } else {
        // Create new question with empty translation structure
        return {
          ...newQ,
          translations: {
            en: "", // Will need to be filled with actual translations
            es: "",
            fr: "",
            it: "",
            tr: "",
            ar: "",
            ru: "",
            zh: "",
            hi: "",
          },
          optionTranslations: {
            en: ["", "", "", ""],
            es: ["", "", "", ""],
            fr: ["", "", "", ""],
            it: ["", "", "", ""],
            tr: ["", "", "", ""],
            ar: ["", "", "", ""],
            ru: ["", "", "", ""],
            zh: ["", "", "", ""],
            hi: ["", "", "", ""],
          },
          explanationTranslations: {
            en: "",
            es: "",
            fr: "",
            it: "",
            tr: "",
            ar: "",
            ru: "",
            zh: "",
            hi: "",
          },
        }
      }
    })

    // Write the processed questions back to the main questions file
    const outputPath = path.join(process.cwd(), "public/data/questions-updated.json")
    fs.writeFileSync(outputPath, JSON.stringify(processedQuestions, null, 2))

    console.log(`Processed ${processedQuestions.length} questions`)
    console.log(`Updated questions saved to: questions-updated.json`)

    // Log statistics
    const newQuestionsCount = processedQuestions.filter((q) => !existingQuestionsMap.has(q.id)).length
    const updatedQuestionsCount = processedQuestions.length - newQuestionsCount

    console.log(`New questions added: ${newQuestionsCount}`)
    console.log(`Existing questions updated: ${updatedQuestionsCount}`)
  } catch (error) {
    console.error("Error processing questions:", error)
  }
}

processQuestions()
