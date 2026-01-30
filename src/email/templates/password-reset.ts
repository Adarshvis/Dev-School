/**
 * Password reset email template
 */

import { baseEmailTemplate } from './base'

export interface PasswordResetEmailData {
  userName?: string
  userEmail: string
  resetLink: string
  expiresIn?: string
}

export function passwordResetEmailTemplate(data: PasswordResetEmailData): string {
  const content = `
    <!-- Title -->
    <h1 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #011e2c; text-align: center;">
      Password Reset Request
    </h1>

    <!-- Greeting -->
    <p style="margin: 0 0 20px 0; font-size: 16px; color: #334155; line-height: 1.6;">
      Dear ${data.userName || 'User'},
    </p>

    <!-- Main Message -->
    <p style="margin: 0 0 25px 0; font-size: 16px; color: #334155; line-height: 1.6;">
      We received a request to reset your password for your 
      <strong style="color: #011e2c;">CyPSi Laboratory</strong> account.
    </p>

    <!-- CTA Button -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
      <tr>
        <td align="center">
          <a href="${data.resetLink}" 
             style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #011e2c 0%, #022a3d 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; box-shadow: 0 4px 12px rgba(1, 30, 44, 0.3);">
            Reset Password
          </a>
        </td>
      </tr>
    </table>

    <!-- Expiry Notice -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
      <tr>
        <td align="center" style="padding: 15px; background-color: #fef3c7; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            This link is valid for <strong>${data.expiresIn || '10 minutes'}</strong>. Please do not share it with anyone.
          </p>
        </td>
      </tr>
    </table>

    <!-- Security Notice -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
      <tr>
        <td style="padding: 20px; background-color: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">
          <p style="margin: 0; font-size: 14px; color: #dc2626;">
            <strong>Security Notice:</strong> If you didn't request this password reset, 
            please ignore this email or contact support immediately if you believe your account is compromised.
          </p>
        </td>
      </tr>
    </table>

    <!-- Alternative Link -->
    <p style="margin: 0; font-size: 13px; color: #64748b; text-align: center; line-height: 1.6;">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <a href="${data.resetLink}" style="color: #011e2c; word-break: break-all; font-size: 12px;">
        ${data.resetLink}
      </a>
    </p>
  `

  return baseEmailTemplate(content)
}

export function passwordResetEmailSubject(): string {
  return `Reset Your CyPSi Laboratory Password`
}
