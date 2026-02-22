// lib/scraper/jobs.ts - multi-source aggregator
export async function scrapeJobs(query: string, location: string) {
  const results = await Promise.allSettled([
    fetchRemotive(query),
    fetchArbeitnow(query),
    fetchTheMuse(query),
  ])

  const jobs = results
    .filter(r => r.status === 'fulfilled')
    .flatMap((r: any) => r.value)

  return jobs
}

async function fetchRemotive(query: string) {
  const res = await fetch(
    `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}&limit=10`
  )
  const data = await res.json()
  return data.jobs.map((j: any) => ({
    id: `remotive-${j.id}`,
    title: j.title,
    company: j.company_name,
    location: j.candidate_required_location || 'Remote',
    description: j.description?.replace(/<[^>]*>/g, '').slice(0, 500) || '',
    url: j.url,
    source: 'Remotive',
  }))
}

async function fetchArbeitnow(query: string) {
  const res = await fetch(
    `https://www.arbeitnow.com/api/job-board-api?search=${encodeURIComponent(query)}`
  )
  const data = await res.json()
  return (data.data || []).slice(0, 10).map((j: any) => ({
    id: `arbeitnow-${j.slug}`,
    title: j.title,
    company: j.company_name,
    location: j.location || 'Remote',
    description: j.description?.replace(/<[^>]*>/g, '').slice(0, 500) || '',
    url: j.url,
    source: 'Arbeitnow',
  }))
}

async function fetchTheMuse(query: string) {
  const res = await fetch(
    `https://www.themuse.com/api/public/jobs?descending=true&page=1&query=${encodeURIComponent(query)}`
  )
  const data = await res.json()
  return (data.results || []).slice(0, 10).map((j: any) => ({
    id: `muse-${j.id}`,
    title: j.name,
    company: j.company?.name || 'Unknown',
    location: j.locations?.[0]?.name || 'Remote',
    description: j.contents?.replace(/<[^>]*>/g, '').slice(0, 500) || '',
    url: j.refs?.landing_page || '',
    source: 'The Muse',
  }))
}