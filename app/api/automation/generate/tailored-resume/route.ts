import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma" 
import { callGemini } from "@/lib/ai/gemini"

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key")
  if (!apiKey) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { apiKey } })
  if (!user) return NextResponse.json({ error: "Invalid key" }, { status: 401 })

  const { jobDescription, profile } = await req.json()

  const prompt = `
Given the following job description and candidate profile, rewrite the candidate's experience and skills to create a tailored resume that highlights the most relevant qualifications for this job. Return only the resume text in a clean, professional format.

Job Description:
${jobDescription}

Candidate Profile:
Name: ${profile.name}
Email: ${profile.email}
Skills: ${profile.skills?.join(', ')}
Experience: ${JSON.stringify(profile.experience)}
Education: ${JSON.stringify(profile.education)}

Tailored Resume:
  `

  const tailored = await callGemini(prompt)
  return NextResponse.json({ tailoredResumeText: tailored })
}