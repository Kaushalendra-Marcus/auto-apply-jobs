'use client'
import { useState, useEffect, Suspense } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { JobCard } from '@/components/JobCard'
import { searchJobs } from '@/lib/api'

type Job = {
  id: string
  title: string
  company: string
  location: string
  description: string
}

function JobsContent() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [location, setLocation] = useState(searchParams.get('location') || 'remote')
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  // Auto-search if query comes from URL (dashboard quick search)
  useEffect(() => {
    const urlQuery = searchParams.get('q')
    if (urlQuery) {
      setQuery(urlQuery)
      handleSearch(urlQuery, 'remote')
    }
  }, [])

  const handleSearch = async (q = query, l = location) => {
    setLoading(true)
    setSearched(true)
    try {
      const data = await searchJobs(q, l)
      setJobs(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Find Jobs</h1>
      <div className="flex gap-4 mb-8">
        <Input
          placeholder="Job title, keywords, skills"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Input
          placeholder="Location (or 'remote')"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="max-w-[200px]"
        />
        <Button onClick={() => handleSearch()} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {!searched && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">Search for jobs by title, skills, or keywords</p>
          <p className="text-sm mt-2">Try "React developer", "Python", "Full Stack"</p>
        </div>
      )}

      {searched && !loading && jobs.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No jobs found</p>
          <p className="text-sm mt-2">Try different keywords or check your connection</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  )
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
      <JobsContent />
    </Suspense>
  )
}