import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function callGemini(prompt: string, responseMimeType?: "application/json") {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: responseMimeType ? { responseMimeType } : undefined,
  })
  const result = await model.generateContent(prompt)
  return result.response.text()
}