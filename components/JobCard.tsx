'use client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/app/contexts/AuthContext'
import { useState } from 'react'

interface JobCardProps {
  job: {
    id: string
    title: string
    company: string
    location: string
    description: string
    url?: string
  }
}

export function JobCard({ job }: JobCardProps) {
  const { user } = useAuth()
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  const handleApply = async () => {
    if (!user) return
    setApplying(true)
    try {
      const token = await user.getIdToken()
      const apiKeyRes = await fetch('/api/user/api-key', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const { apiKey } = await apiKeyRes.json()

      const res = await fetch('http://localhost:3001/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          apiKey,
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
          url: job.url || '',
        }),
      })

      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setApplied(true)
      alert(`✅ ${data.message || 'Application logged!'}`)
    } catch (error) {
      alert('Could not connect to local bridge server. Make sure it is running on port 3001.')
    } finally {
      setApplying(false)
    }
  }

  return (
    <Card className={applied ? 'border-green-400' : ''}>
      <CardHeader>
        <CardTitle className="text-base">{job.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm">{job.description}</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        {job.url && (
          <a href={job.url} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" className="w-full" size="sm">View Job</Button>
          </a>
        )}
        <Button
          onClick={handleApply}
          disabled={applying || applied}
          className="flex-1"
          size="sm"
          variant={applied ? 'outline' : 'default'}
        >
          {applied ? '✓ Applied' : applying ? 'Logging...' : 'Track Application'}
        </Button>
      </CardFooter>
    </Card>
  )
}