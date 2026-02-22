import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key")
  if (!apiKey) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { apiKey } })
  if (!user) return NextResponse.json({ error: "Invalid key" }, { status: 401 })

  const { jobId, status, title, company, location, description, url } = await req.json()

  // Upsert job so foreign key constraint is satisfied
  await prisma.job.upsert({
    where: { externalId: String(jobId) },
    update: {},
    create: {
      externalId: String(jobId),
      title: title || 'Unknown Title',
      company: company || 'Unknown Company',
      location: location || 'Remote',
      description: description || '',
      url: url || '',
      source: 'remotive',
    },
  })

  const job = await prisma.job.findUnique({ where: { externalId: String(jobId) } })
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 })

  const application = await prisma.application.create({
    data: {
      userId: user.id,
      jobId: job.id,
      status: status || 'applied',
    },
  })

  return NextResponse.json(application)
}