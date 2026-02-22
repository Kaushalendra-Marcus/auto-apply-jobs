'use client'
import { useState } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type ParsedProfile = {
  name: string
  email: string
  phone: string
  skills: string[]
  experience: Array<{ title: string; company: string; startDate: string; endDate: string; description: string }>
  education: Array<{ degree: string; institution: string; year: string }>
}

export default function ResumePage() {
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [parsed, setParsed] = useState<ParsedProfile | null>(null)
  const [edited, setEdited] = useState<ParsedProfile | null>(null)

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0])
    },
  })

  const handleUpload = async () => {
    if (!file || !user) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    const token = await user.getIdToken()
    const res = await fetch('/api/resume/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
    const data = await res.json()
    setParsed(data.profile)
    setEdited(data.profile) // start with parsed data
    setUploading(false)
  }

  const handleSave = async () => {
    if (!edited || !user) return
    try {
      const token = await user.getIdToken()
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(edited),
      })
      if (!res.ok) throw new Error('Failed to save')
      alert('Profile saved successfully!')
    } catch (error) {
      alert('Failed to save profile. Please try again.')
    }
  }

  if (parsed && edited) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Review Your Profile</h1>
        <Tabs defaultValue="edit">
          <TabsList className="mb-4">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Make changes to the parsed information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input value={edited.name} onChange={(e) => setEdited({ ...edited, name: e.target.value })} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={edited.email} onChange={(e) => setEdited({ ...edited, email: e.target.value })} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={edited.phone} onChange={(e) => setEdited({ ...edited, phone: e.target.value })} />
                </div>
                <div>
                  <Label>Skills (comma separated)</Label>
                  <Input
                    value={edited.skills.join(', ')}
                    onChange={(e) => setEdited({ ...edited, skills: e.target.value.split(',').map(s => s.trim()) })}
                  />
                </div>
                <Button onClick={handleSave}>Save Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>Profile Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded">{JSON.stringify(edited, null, 2)}</pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upload Your Resume</h1>
      <Card>
        <CardHeader>
          <CardTitle>Resume Upload</CardTitle>
          <CardDescription>We support PDF and DOCX files</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary transition"
          >
            <input {...getInputProps()} />
            {file ? (
              <p>{file.name}</p>
            ) : (
              <p>Drag & drop your resume here, or click to select</p>
            )}
          </div>
          {file && (
            <Button onClick={handleUpload} disabled={uploading} className="mt-4 w-full">
              {uploading ? 'Processing...' : 'Upload & Parse'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}