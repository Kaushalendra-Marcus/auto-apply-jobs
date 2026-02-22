import { NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase/admin"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1]
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const decoded = await adminAuth.verifyIdToken(token)
    const user = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const { name, email, phone, skills, experience, education } = await req.json()

    await prisma.user.update({
      where: { id: user.id },
      data: { name, phone },
    })

    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: { skills, experience, education },
      create: { userId: user.id, skills, experience, education },
    })

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}