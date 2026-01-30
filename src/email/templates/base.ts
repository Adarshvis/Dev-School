/**
 * Base email template wrapper with CyPSi Lab branding
 */

export interface EmailTemplateConfig {
  logoUrl?: string
  primaryColor?: string
  accentColor?: string
  supportEmail?: string
  labName?: string
  year?: number
}

const defaultConfig: EmailTemplateConfig = {
  logoUrl: '/assets/img/logo.webp', // Will be replaced with full URL
  primaryColor: '#011e2c',
  accentColor: '#f59e0b',
  supportEmail: 'cps@uod.ac.in',
  labName: 'CyPSi Laboratory',
  year: new Date().getFullYear(),
}

export function baseEmailTemplate(
  content: string,
  config: Partial<EmailTemplateConfig> = {}
): string {
  const cfg = { ...defaultConfig, ...config }
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${cfg.labName}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header with Logo -->
          <tr>
            <td align="center" style="padding: 30px 40px; background: linear-gradient(135deg, ${cfg.primaryColor} 0%, #022a3d 100%); border-radius: 12px 12px 0 0;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <!-- CyPSi Logo -->
                    <div style="margin-bottom: 10px;">
                      <span style="font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: 1px;">CyPSi</span>
                      <span style="font-size: 32px; font-weight: 700; color: ${cfg.accentColor}; letter-spacing: 1px;">Lab</span>
                    </div>
                    <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px;">
                      Cyber Physical Systems
                    </div>
                    <div style="font-size: 11px; color: #cbd5e1; margin-top: 5px;">
                      University of Delhi, South Campus
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Area -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0;">
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f8fafc; border-radius: 0 0 12px 12px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom: 15px;">
                    <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.6;">
                      If you didn't request this, please ignore this email.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom: 15px;">
                    <p style="margin: 0; font-size: 13px; color: #64748b;">
                      For support, contact us at 
                      <a href="mailto:${cfg.supportEmail}" style="color: ${cfg.primaryColor}; text-decoration: none; font-weight: 600;">
                        ${cfg.supportEmail}
                      </a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                      © ${cfg.year} ${cfg.labName} | All Rights Reserved
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
