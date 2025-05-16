import { GoogleGenerativeAI } from "@google/generative-ai"

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable")
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function generateContent(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Error generating content with Gemini:", error)
    throw new Error("Failed to generate content")
  }
}

export async function improveWriting(content: string) {
  const prompt = `Please improve the following writing while maintaining the original meaning and tone:

${content}

Provide the improved version only, without any explanations or additional comments.`

  return generateContent(prompt)
}

export async function suggestChapterIdeas(context: string) {
  const prompt = `Based on the following context, suggest 5 potential chapter ideas:

${context}

Format the response as a numbered list, with each idea being concise and focused.`

  return generateContent(prompt)
}

export async function analyzeStyle(content: string) {
  const prompt = `Analyze the writing style of the following content and provide key characteristics:

${content}

Focus on tone, voice, complexity, and notable patterns.`

  return generateContent(prompt)
}
