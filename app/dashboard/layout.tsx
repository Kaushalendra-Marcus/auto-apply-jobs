'use client'
import { useAuth } from '../contexts/AuthContext' 
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/firebase/client'
import { signOut } from 'firebase/auth'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) return null

  const handleSignOut = async () => {
    await signOut(auth)
    router.push('/')
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border">
        <div className="p-4">
          <h2 className="text-xl font-bold text-primary">AutoApply Pro</h2>
        </div>
        <nav className="mt-8">
          <ul className="space-y-2 px-4">
            <li>
              <Link href="/dashboard" className="block py-2 px-4 rounded hover:bg-muted">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/dashboard/resume" className="block py-2 px-4 rounded hover:bg-muted">
                Resume
              </Link>
            </li>
            <li>
              <Link href="/dashboard/jobs" className="block py-2 px-4 rounded hover:bg-muted">
                Jobs
              </Link>
            </li>
            <li>
              <Link href="/dashboard/applications" className="block py-2 px-4 rounded hover:bg-muted">
                Applications
              </Link>
            </li>
            <li>
              <Link href="/dashboard/settings" className="block py-2 px-4 rounded hover:bg-muted">
                Settings
              </Link>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-4 left-4">
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-muted/20">
        {children}
      </main>
    </div>
  )
}