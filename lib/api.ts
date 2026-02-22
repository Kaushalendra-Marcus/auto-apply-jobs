export async function searchJobs(query: string, location: string) {
  const res = await fetch(`/api/jobs/search?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}`)
  if (!res.ok) throw new Error('Failed to fetch jobs')
  return res.json()
}