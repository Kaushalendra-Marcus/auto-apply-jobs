import { NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase/admin"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1]
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const decoded = await adminAuth.verifyIdToken(token)
    const user = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const applications = await prisma.application.findMany({
      where: { userId: user.id },
      include: { job: true },
      orderBy: { appliedAt: 'desc' },
    })

    return NextResponse.json(applications.map(app => ({
      id: app.id,
      status: app.status,
      appliedAt: app.appliedAt,
      job: {
        title: app.job.title,
        company: app.job.company,
        location: app.job.location,
        url: app.job.url,
      }
    })))
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}