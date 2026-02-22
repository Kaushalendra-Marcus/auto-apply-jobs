import { NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase/admin"
import { prisma } from "@/lib/prisma"
import { uploadFileToS3 } from "@/lib/s3"
import { extractTextFromPDF, extractTextFromDocx } from "@/lib/fileParser"
import { parseResumeWithGemini } from "@/lib/ai/parseResume"
import { randomBytes } from "crypto"

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1]
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const decoded = await adminAuth.verifyIdToken(token)
    const firebaseUid = decoded.uid

    let user = await prisma.user.findUnique({ where: { firebaseUid } })
    if (!user) {
      user = await prisma.user.create({
        data: {
          firebaseUid,
          email: decoded.email!,
          name: decoded.name || null,
          apiKey: randomBytes(32).toString("hex"),
        },
      })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const key = `resumes/${user.id}/${Date.now()}-${file.name}`
    const url = await uploadFileToS3(buffer, key, file.type)

    let text = ""
    if (file.type === "application/pdf") {
      text = await extractTextFromPDF(buffer)
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      text = await extractTextFromDocx(buffer)
    } else {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
    }

    const parsed = await parseResumeWithGemini(text)

    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        originalUrl: url,
        parsedData: parsed,
        isMaster: true,
      },
    })

    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        skills: parsed.skills || [],
        experience: parsed.experience || [],
        education: parsed.education || [],
      },
      create: {
        userId: user.id,
        skills: parsed.skills || [],
        experience: parsed.experience || [],
        education: parsed.education || [],
      },
    })

    return NextResponse.json({ resume, profile: parsed })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}