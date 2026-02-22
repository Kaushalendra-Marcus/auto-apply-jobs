import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key")
  if (!apiKey) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { apiKey },
    include: { profile: true },
  })
  if (!user) return NextResponse.json({ error: "Invalid key" }, { status: 401 })

  const masterResume = await prisma.resume.findFirst({
    where: { userId: user.id, isMaster: true },
  })

  return NextResponse.json({
    profile: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      skills: user.profile?.skills || [],
      experience: user.profile?.experience || [],
      education: user.profile?.education || [],
    },
    resumeUrl: masterResume?.originalUrl,
  })
}