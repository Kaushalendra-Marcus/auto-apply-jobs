'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Application = {
  id: string
  jobId: string
  status: string
  appliedAt: string
  job?: {
    title: string
    company: string
  }
}

const statusColors: Record<string, string> = {
  applied: 'bg-blue-100 text-blue-800',
  interview: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  followup: 'bg-yellow-100 text-yellow-800',
}

export default function ApplicationsPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    user.getIdToken().then(token => {
      fetch('/api/user/applications', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          setApplications(Array.isArray(data) ? data : [])
          setLoading(false)
        })
        .catch(() => setLoading(false))
    })
  }, [user])

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Applications</h1>
      {applications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <p className="text-xl mb-2">No applications yet</p>
            <p className="text-sm">Apply to jobs from the Jobs page to track them here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map(app => (
            <Card key={app.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">{app.job?.title || 'Unknown Job'}</CardTitle>
                  <p className="text-sm text-muted-foreground">{app.job?.company || app.jobId}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status] || 'bg-gray-100'}`}>
                  {app.status}
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Applied {new Date(app.appliedAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}