import { NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase/admin"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1]
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const decoded = await adminAuth.verifyIdToken(token)
    const user = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } })
    if (!user) return NextResponse.json({ hasResume: false, skills: [] })

    const resume = await prisma.resume.findFirst({ where: { userId: user.id, isMaster: true } })
    const profile = await prisma.profile.findUnique({ where: { userId: user.id } })

    return NextResponse.json({
      hasResume: !!resume,
      skills: profile?.skills || [],
    })
  } catch (error) {
    return NextResponse.json({ hasResume: false, skills: [] })
  }
}