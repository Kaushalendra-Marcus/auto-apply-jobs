import { callGemini } from "./gemini"

export async function parseResumeWithGemini(text: string) {
  const prompt = `
You are an expert resume parser. Extract the following information from the resume text and return a JSON object with exactly these fields:
- name: full name of the candidate
- email: email address
- phone: phone number (if available)
- skills: array of strings (technical and soft skills)
- experience: array of objects, each with { title, company, startDate, endDate, description }
- education: array of objects, each with { degree, institution, year }

Resume text:
${text}
  `
  const response = await callGemini(prompt, "application/json")
  return JSON.parse(response)
}