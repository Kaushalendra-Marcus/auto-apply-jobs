import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization')?.split(' ')[1]
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const decoded = await adminAuth.verifyIdToken(token)
    const firebaseUid = decoded.uid

    // Upsert user – creates if not exists, otherwise returns existing
    const user = await prisma.user.upsert({
      where: { firebaseUid },
      update: {}, // no updates needed
      create: {
        firebaseUid,
        email: decoded.email!,
        name: decoded.name,
      },
    })

    return NextResponse.json({ apiKey: user.apiKey })
  } catch (error) {
    console.error('API key error:', error)
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}