import { NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase/admin"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1]
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const decoded = await adminAuth.verifyIdToken(token)

    let user = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } })
    if (!user) {
      user = await prisma.user.create({
        data: {
          firebaseUid: decoded.uid,
          email: decoded.email!,
          name: decoded.name || null,
          apiKey: randomBytes(32).toString("hex"),
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}