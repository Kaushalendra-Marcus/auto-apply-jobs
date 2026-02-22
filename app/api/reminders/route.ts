import { NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase/admin"
import { prisma } from "@/lib/prisma"
import { emailQueue } from "@/lib/queue"

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1]
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const decoded = await adminAuth.verifyIdToken(token)
    const user = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const { jobId, type, scheduledAt } = await req.json()

    const reminder = await prisma.reminder.create({
      data: {
        userId: user.id,
        jobId,
        type,
        scheduledAt: new Date(scheduledAt),
      },
    })

    const delay = new Date(scheduledAt).getTime() - Date.now()
    await emailQueue.add(
      'send-reminder',
      {
        to: user.email,
        subject: `Reminder: ${type} for job`,
        body: `Don't forget to ${type} for the job.`,
      },
      { delay: delay > 0 ? delay : 0 }
    )

    return NextResponse.json(reminder)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}