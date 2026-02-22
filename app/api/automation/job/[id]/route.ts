import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma" 

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const apiKey = req.headers.get("x-api-key")
  if (!apiKey) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { apiKey } })
  if (!user) return NextResponse.json({ error: "Invalid key" }, { status: 401 })

  const job = await prisma.job.findUnique({ where: { id: params.id } })
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 })

  return NextResponse.json(job)
}