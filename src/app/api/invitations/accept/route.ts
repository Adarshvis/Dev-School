import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Find invitation by token
    const invitations = await payload.find({
      collection: 'invitations' as any,
      where: {
        token: { equals: token },
      },
      limit: 1,
    })

    if (invitations.docs.length === 0) {
      return NextResponse.json({ error: 'Invalid invitation token' }, { status: 404 })
    }

    const invitation = invitations.docs[0] as any

    // Check if already accepted
    if (invitation.status === 'accepted') {
      return NextResponse.json({ error: 'This invitation has already been accepted' }, { status: 400 })
    }

    // Check if expired
    if (new Date(invitation.expiresAt) < new Date()) {
      // Update status to expired
      await payload.update({
        collection: 'invitations' as any,
        id: invitation.id,
        data: { status: 'expired' } as any,
      })
      return NextResponse.json({ error: 'This invitation has expired' }, { status: 400 })
    }

    // Check if cancelled
    if (invitation.status === 'cancelled') {
      return NextResponse.json({ error: 'This invitation has been cancelled' }, { status: 400 })
    }

    // Return invitation data (without sensitive token)
    return NextResponse.json({
      valid: true,
      email: invitation.email,
      name: invitation.name,
      role: invitation.role,
      expiresAt: invitation.expiresAt,
    })
  } catch (error) {
    console.error('Error validating invitation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password, name } = body

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    if (!password || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Find invitation by token
    const invitations = await payload.find({
      collection: 'invitations' as any,
      where: {
        token: { equals: token },
      },
      limit: 1,
    })

    if (invitations.docs.length === 0) {
      return NextResponse.json({ error: 'Invalid invitation token' }, { status: 404 })
    }

    const invitation = invitations.docs[0] as any

    // Validate invitation status
    if (invitation.status !== 'pending') {
      return NextResponse.json({ 
        error: invitation.status === 'accepted' 
          ? 'This invitation has already been accepted' 
          : invitation.status === 'expired'
            ? 'This invitation has expired'
            : 'This invitation is no longer valid'
      }, { status: 400 })
    }

    // Check if expired
    if (new Date(invitation.expiresAt) < new Date()) {
      await payload.update({
        collection: 'invitations' as any,
        id: invitation.id,
        data: { status: 'expired' } as any,
      })
      return NextResponse.json({ error: 'This invitation has expired' }, { status: 400 })
    }

    // Check if user already exists
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: { equals: invitation.email },
      },
      limit: 1,
    })

    if (existingUsers.docs.length > 0) {
      // Update invitation to accepted (user already exists)
      await payload.update({
        collection: 'invitations' as any,
        id: invitation.id,
        data: {
          status: 'accepted',
          acceptedAt: new Date().toISOString(),
          acceptedUser: existingUsers.docs[0].id,
        } as any,
      })
      
      return NextResponse.json({ 
        error: 'An account with this email already exists. Please login instead.',
        loginUrl: '/admin'
      }, { status: 400 })
    }

    // Create the user
    const newUser = await payload.create({
      collection: 'users',
      data: {
        email: invitation.email,
        password,
        name: name || invitation.name || invitation.email.split('@')[0],
        role: invitation.role,
        allowedCollections: invitation.allowedCollections || ['blog-posts', 'publications'],
      } as any,
    })

    // Update invitation to accepted
    await payload.update({
      collection: 'invitations' as any,
      id: invitation.id,
      data: {
        status: 'accepted',
        acceptedAt: new Date().toISOString(),
        acceptedUser: newUser.id,
      } as any,
    })

    // Send welcome email
    try {
      const { sendEmail } = await import('@/email/sendEmail')
      const { welcomeEmailTemplate, welcomeEmailSubject } = await import('@/email/templates/welcome')
      
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
      
      await sendEmail({
        to: invitation.email,
        subject: welcomeEmailSubject(),
        html: welcomeEmailTemplate({
          userName: name || invitation.name || 'User',
          userEmail: invitation.email,
          role: invitation.role,
          loginUrl: `${baseUrl}/admin`,
        }),
      })
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError)
      // Don't fail the request if welcome email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      email: invitation.email,
      role: invitation.role,
    })
  } catch (error: any) {
    console.error('Error accepting invitation:', error)
    
    // Handle duplicate email error
    if (error?.code === 11000 || error?.message?.includes('duplicate')) {
      return NextResponse.json({ 
        error: 'An account with this email already exists'
      }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
