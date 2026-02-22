'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SettingsPage() {
  const { user } = useAuth()
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      user.getIdToken().then((token) => {
        fetch('/api/user/api-key', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => res.json())
          .then(data => {
            setApiKey(data.apiKey || '')
            setLoading(false)
          })
          .catch(() => setLoading(false))
      })
    }
  }, [user])

  const regenerateKey = async () => {
    // Call an API to regenerate
    alert('Regenerate not implemented')
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>API Key</CardTitle>
          <CardDescription>
            This key is used by the local bridge server to authenticate with our API.
            Keep it secret.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Input value={apiKey} readOnly className="font-mono" />
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(apiKey)}>
              Copy
            </Button>
          </div>
          <Button variant="destructive" onClick={regenerateKey} className="mt-4">
            Regenerate Key
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}