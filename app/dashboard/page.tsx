'use client'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function DashboardHome() {
  const { user } = useAuth()
  const [resumeUploaded, setResumeUploaded] = useState(false)
  const [appCount, setAppCount] = useState(0)
  const [apiKey, setApiKey] = useState('')
  const [skills, setSkills] = useState<string[]>([])

  useEffect(() => {
    if (!user) return
    user.getIdToken().then(token => {
      const headers = { Authorization: `Bearer ${token}` }

      fetch('/api/user/api-key', { headers })
        .then(r => r.json())
        .then(d => setApiKey(d.apiKey || ''))

      fetch('/api/user/applications', { headers })
        .then(r => r.json())
        .then(d => setAppCount(Array.isArray(d) ? d.length : 0))

      fetch('/api/automation/profile', { headers: { 'x-api-key': '' } })
        .catch(() => {})

      // Check resume via api-key route which returns profile
      user.getIdToken().then(t => {
        fetch('/api/user/status', { headers: { Authorization: `Bearer ${t}` } })
          .then(r => r.json())
          .then(d => {
            setResumeUploaded(d.hasResume || false)
            setSkills(d.skills || [])
          })
          .catch(() => {})
      })
    })
  }, [user])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.displayName || 'User'}</h1>
      {skills.length > 0 && (
        <p className="text-muted-foreground mb-6">Your skills: {skills.slice(0, 5).join(', ')}{skills.length > 5 ? '...' : ''}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader><CardTitle>Resume Status</CardTitle></CardHeader>
          <CardContent>
            <p className={`text-2xl font-semibold ${resumeUploaded ? 'text-green-600' : 'text-orange-500'}`}>
              {resumeUploaded ? 'Uploaded ✓' : 'Not uploaded'}
            </p>
            {!resumeUploaded && (
              <Link href="/dashboard/resume">
                <Button size="sm" className="mt-3">Upload Resume</Button>
              </Link>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Applications</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{appCount}</p>
            <p className="text-sm text-muted-foreground mt-2">Applied jobs</p>
            <Link href="/dashboard/applications">
              <Button size="sm" variant="outline" className="mt-3">View All</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>API Key</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm font-mono truncate">{apiKey ? '••••••••' + apiKey.slice(-4) : 'Loading...'}</p>
            <p className="text-sm text-muted-foreground mt-2">Used for local bridge server</p>
            <Link href="/dashboard/settings">
              <Button size="sm" variant="outline" className="mt-3">View Key</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {resumeUploaded && skills.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Quick Job Search</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3">Based on your skills, search for relevant jobs</p>
            <Link href={`/dashboard/jobs?q=${encodeURIComponent(skills.slice(0, 3).join(' '))}`}>
              <Button>Find Jobs for My Skills</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}