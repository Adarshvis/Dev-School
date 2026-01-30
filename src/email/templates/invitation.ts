/**
 * Invitation email template
 */

import { baseEmailTemplate } from './base'

export interface InvitationEmailData {
  recipientName?: string
  recipientEmail: string
  role: string
  inviteLink: string
  invitedBy?: string
  expiresIn?: string
}

export function invitationEmailTemplate(data: InvitationEmailData): string {
  const roleDisplay = {
    admin: 'Administrator',
    editor: 'Editor',
    author: 'Author',
    superadmin: 'Super Administrator',
  }[data.role] || data.role

  const content = `
    <!-- Title -->
    <h1 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #011e2c; text-align: center;">
      You're Invited!
    </h1>

    <!-- Greeting -->
    <p style="margin: 0 0 20px 0; font-size: 16px; color: #334155; line-height: 1.6;">
      Dear ${data.recipientName || 'User'},
    </p>

    <!-- Main Message -->
    <p style="margin: 0 0 25px 0; font-size: 16px; color: #334155; line-height: 1.6;">
      You have been invited to join <strong style="color: #011e2c;">CyPSi Laboratory</strong> as an
      <strong style="color: #f59e0b;">${roleDisplay}</strong>.
    </p>

    <!-- Role Description Box -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
      <tr>
        <td style="padding: 20px; background-color: #f0f9ff; border-radius: 8px; border-left: 4px solid #011e2c;">
          <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 600; color: #011e2c;">
            As a ${roleDisplay}, you will be able to:
          </p>
          <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.8;">
            ${data.role === 'author' ? `
              <li>Create and edit your own blog posts</li>
              <li>Manage your own publications</li>
              <li>Update your profile information</li>
            ` : data.role === 'editor' ? `
              <li>Edit all content across the platform</li>
              <li>Manage blog posts and publications</li>
              <li>Review and publish content</li>
            ` : `
              <li>Full access to all content management</li>
              <li>Manage users and permissions</li>
              <li>Configure site settings</li>
            `}
          </ul>
        </td>
      </tr>
    </table>

    <!-- CTA Button -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
      <tr>
        <td align="center">
          <a href="${data.inviteLink}" 
             style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #011e2c 0%, #022a3d 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; box-shadow: 0 4px 12px rgba(1, 30, 44, 0.3);">
            Accept Invitation
          </a>
        </td>
      </tr>
    </table>

    <!-- Expiry Notice -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
      <tr>
        <td align="center" style="padding: 15px; background-color: #fef3c7; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            This invitation expires in <strong>${data.expiresIn || '7 days'}</strong>
          </p>
        </td>
      </tr>
    </table>

    <!-- Alternative Link -->
    <p style="margin: 0; font-size: 13px; color: #64748b; text-align: center; line-height: 1.6;">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <a href="${data.inviteLink}" style="color: #011e2c; word-break: break-all; font-size: 12px;">
        ${data.inviteLink}
      </a>
    </p>
  `

  return baseEmailTemplate(content)
}

export function invitationEmailSubject(role: string): string {
  return `You're invited to join CyPSi Laboratory as ${role === 'author' ? 'an Author' : role === 'editor' ? 'an Editor' : 'an Administrator'}`
}
