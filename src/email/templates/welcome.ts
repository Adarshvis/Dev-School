/**
 * Welcome email template - sent after user accepts invitation
 */

import { baseEmailTemplate } from './base'

export interface WelcomeEmailData {
  userName: string
  userEmail: string
  role: string
  loginUrl: string
}

export function welcomeEmailTemplate(data: WelcomeEmailData): string {
  const roleDisplay = {
    admin: 'Administrator',
    editor: 'Editor',
    author: 'Author',
    superadmin: 'Super Administrator',
  }[data.role] || data.role

  const content = `
    <!-- Title -->
    <h1 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #011e2c; text-align: center;">
      Welcome to CyPSi Lab! 🎉
    </h1>

    <!-- Greeting -->
    <p style="margin: 0 0 20px 0; font-size: 16px; color: #334155; line-height: 1.6;">
      Dear ${data.userName},
    </p>

    <!-- Main Message -->
    <p style="margin: 0 0 25px 0; font-size: 16px; color: #334155; line-height: 1.6;">
      Your account has been successfully created! You are now a member of 
      <strong style="color: #011e2c;">CyPSi Laboratory</strong> as an
      <strong style="color: #f59e0b;">${roleDisplay}</strong>.
    </p>

    <!-- Account Details Box -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
      <tr>
        <td style="padding: 20px; background-color: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">
          <p style="margin: 0 0 15px 0; font-size: 14px; font-weight: 600; color: #166534;">
            ✅ Account Details
          </p>
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 5px 0; font-size: 14px; color: #475569; width: 80px;">Email:</td>
              <td style="padding: 5px 0; font-size: 14px; color: #011e2c; font-weight: 500;">${data.userEmail}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-size: 14px; color: #475569;">Role:</td>
              <td style="padding: 5px 0; font-size: 14px; color: #011e2c; font-weight: 500;">${roleDisplay}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Getting Started Section -->
    <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #011e2c;">
      Getting Started:
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
      <tr>
        <td style="padding: 15px 20px; background-color: #f8fafc; border-radius: 8px;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 8px 0; font-size: 14px; color: #475569;">
                <span style="display: inline-block; width: 24px; height: 24px; background-color: #011e2c; color: #fff; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 10px; font-size: 12px;">1</span>
                Log in to the admin panel using your credentials
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-size: 14px; color: #475569;">
                <span style="display: inline-block; width: 24px; height: 24px; background-color: #011e2c; color: #fff; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 10px; font-size: 12px;">2</span>
                Complete your profile information
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-size: 14px; color: #475569;">
                <span style="display: inline-block; width: 24px; height: 24px; background-color: #011e2c; color: #fff; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 10px; font-size: 12px;">3</span>
                Start creating and managing content
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- CTA Button -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
      <tr>
        <td align="center">
          <a href="${data.loginUrl}" 
             style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);">
            Go to Admin Panel
          </a>
        </td>
      </tr>
    </table>

    <!-- Help Section -->
    <p style="margin: 0; font-size: 14px; color: #64748b; text-align: center; line-height: 1.6;">
      Need help getting started? Check out our documentation or contact support.
    </p>
  `

  return baseEmailTemplate(content)
}

export function welcomeEmailSubject(): string {
  return `🎉 Welcome to CyPSi Laboratory - Account Created Successfully`
}
