import { NextRequest, NextResponse } from "next/server"
import { scrapeJobs } from "@/lib/scraper/jobs"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q") || ""
  const location = searchParams.get("location") || ""

  try {
    const jobs = await scrapeJobs(query, location)
    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Job fetch failed:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}