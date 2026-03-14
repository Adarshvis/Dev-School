import type { CollectionConfig } from 'payload'
import crypto from 'crypto'
import { sendEmail } from '../email/sendEmail'
import { invitationEmailTemplate, invitationEmailSubject } from '../email/templates/invitation'
import { welcomeEmailTemplate, welcomeEmailSubject } from '../email/templates/welcome'

// Generate a secure random token
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Get expiry date (7 days from now)
function getExpiryDate(): string {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  return date.toISOString()
}

export const Invitations: CollectionConfig = {
  slug: 'invitations',
  labels: {
    singular: 'Invitation',
    plural: 'Invitations',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'allowedCollections', 'status', 'createdAt', 'expiresAt'],
    group: 'Admin',
    description: 'Send email invitations to new users. Fill in details and click Save to send the invite.',
  },
  access: {
    // Only admins and superadmins can manage invitations
    create: ({ req }) => {
      if (!req || !req.user) return false
      const role = (req.user as any).role
      return role === 'superadmin' || role === 'admin'
    },
    read: ({ req }) => {
      if (!req || !req.user) return false
      const role = (req.user as any).role
      return role === 'superadmin' || role === 'admin'
    },
    update: ({ req }) => {
      if (!req || !req.user) return false
      const role = (req.user as any).role
      return role === 'superadmin' || role === 'admin'
    },
    delete: ({ req }) => {
      if (!req || !req.user) return false
      const role = (req.user as any).role
      return role === 'superadmin' || role === 'admin'
    },
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      admin: {
        description: 'Email address of the person you want to invite',
      },
    },
    {
      name: 'name',
      type: 'text',
      admin: {
        description: 'Name of the person (optional, used in email greeting)',
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'author',
      options: [
        {
          label: 'Author (Can only edit own content)',
          value: 'author',
        },
        {
          label: 'Editor (Can edit all content)',
          value: 'editor',
        },
        {
          label: 'Admin (Full access)',
          value: 'admin',
        },
      ],
      admin: {
        description: 'Role to assign when user accepts invitation',
      },
    },
    {
      name: 'allowedCollections',
      type: 'select',
      hasMany: true,
      defaultValue: ['blog-posts', 'publications'],
      options: [
        { label: 'Blog Posts', value: 'blog-posts' },
        { label: 'Publications', value: 'publications' },
        { label: 'News', value: 'news' },
        { label: 'Research Domains', value: 'research-domains' },
        { label: 'Instructors/People', value: 'instructors' },
        { label: 'Courses Page', value: 'courses-page' },
        { label: 'About Page', value: 'about-page' },
        { label: 'Home Page', value: 'home-page' },
        { label: 'Contact Page', value: 'contact-page' },
      ],
      admin: {
        description: 'Select which content the user can edit (for Authors)',
        condition: (data) => data?.role === 'author',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Accepted',
          value: 'accepted',
        },
        {
          label: 'Expired',
          value: 'expired',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
      admin: {
        position: 'sidebar',
        description: 'Current status of the invitation',
      },
    },
    {
      name: 'token',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        description: 'Secure token for invitation link (auto-generated)',
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => value || generateToken(),
        ],
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
      admin: {
        readOnly: true,
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Invitation expiry date (7 days from creation)',
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => value || getExpiryDate(),
        ],
      },
    },
    {
      name: 'invitedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        description: 'User who sent the invitation',
        position: 'sidebar',
      },
    },
    {
      name: 'acceptedAt',
      type: 'date',
      admin: {
        readOnly: true,
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'When the invitation was accepted',
        position: 'sidebar',
        condition: (data) => data?.status === 'accepted',
      },
    },
    {
      name: 'acceptedUser',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        description: 'User account created from this invitation',
        position: 'sidebar',
        condition: (data) => data?.status === 'accepted',
      },
    },
    {
      name: 'emailSent',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        readOnly: true,
        description: 'Whether the invitation email was sent successfully',
        position: 'sidebar',
      },
    },
    {
      name: 'resendCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Number of times invitation was resent',
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      // Set the invitedBy field to current user
      async ({ data, req, operation }) => {
        if (operation === 'create' && req.user) {
          data.invitedBy = req.user.id
        }
        return data
      },
    ],
    afterChange: [
      // Send invitation email after creation
      async ({ doc, operation, req }) => {
        // Only send email on create and if status is pending
        if (operation === 'create' && doc.status === 'pending') {
          try {
            const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 
                           process.env.PAYLOAD_PUBLIC_SERVER_URL || 
                           'http://localhost:3000'
            
            const inviteLink = `${baseUrl}/accept-invite?token=${doc.token}`
            
            // Get inviter name
            let inviterName = 'CyPSi Lab Admin'
            if (doc.invitedBy) {
              try {
                const inviter = await req.payload.findByID({
                  collection: 'users',
                  id: typeof doc.invitedBy === 'string' ? doc.invitedBy : doc.invitedBy.id,
                })
                inviterName = (inviter as any)?.name || (inviter as any)?.email || inviterName
              } catch (e) {
                // Use default name
              }
            }

            const emailHtml = invitationEmailTemplate({
              recipientName: doc.name || undefined,
              recipientEmail: doc.email,
              role: doc.role,
              inviteLink,
              invitedBy: inviterName,
              expiresIn: '7 days',
            })

            const result = await sendEmail({
              to: doc.email,
              subject: invitationEmailSubject(doc.role),
              html: emailHtml,
            })

            if (result.success) {
              console.log(`✓ Invitation email sent to ${doc.email}`)
              // Try to update emailSent status, but don't fail if it doesn't work
              try {
                await req.payload.update({
                  collection: 'invitations' as any,
                  id: doc.id,
                  data: {
                    emailSent: true,
                  } as any,
                })
              } catch (updateError) {
                console.log('Note: Could not update emailSent status immediately, will be set on next save')
              }
            } else {
              console.error(`✗ Failed to send invitation email to ${doc.email}:`, result.error)
            }
          } catch (error) {
            console.error('Error sending invitation email:', error)
            // Log the full error for debugging
            if (error instanceof Error) {
              console.error('Error details:', {
                message: error.message,
                stack: error.stack,
              })
            }
          }
        }
        
        return doc
      },
    ],
  },
  endpoints: [
    // Resend invitation endpoint
    {
      path: '/:id/resend',
      method: 'post',
      handler: async (req) => {
        try {
          const id = req.routeParams?.id
          if (!id) {
            return Response.json({ error: 'Invitation ID required' }, { status: 400 })
          }

          // Get the invitation
          const invitation = await req.payload.findByID({
            collection: 'invitations' as any,
            id: id as string,
          }) as any

          if (!invitation) {
            return Response.json({ error: 'Invitation not found' }, { status: 404 })
          }

          if (invitation.status !== 'pending') {
            return Response.json({ error: 'Can only resend pending invitations' }, { status: 400 })
          }

          // Generate new token and extend expiry
          const newToken = generateToken()
          const newExpiry = getExpiryDate()

          const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
          const inviteLink = `${baseUrl}/accept-invite?token=${newToken}`

          const emailHtml = invitationEmailTemplate({
            recipientName: invitation.name || undefined,
            recipientEmail: invitation.email,
            role: invitation.role,
            inviteLink,
            expiresIn: '7 days',
          })

          const result = await sendEmail({
            to: invitation.email,
            subject: invitationEmailSubject(invitation.role),
            html: emailHtml,
          })

          if (result.success) {
            // Update invitation with new token and expiry
            await req.payload.update({
              collection: 'invitations' as any,
              id: id as string,
              data: {
                token: newToken,
                expiresAt: newExpiry,
                emailSent: true,
                resendCount: (invitation.resendCount || 0) + 1,
              } as any,
            })

            return Response.json({ success: true, message: 'Invitation resent successfully' })
          } else {
            return Response.json({ error: 'Failed to send email', details: result.error }, { status: 500 })
          }
        } catch (error) {
          console.error('Error resending invitation:', error)
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      },
    },
  ],
}
