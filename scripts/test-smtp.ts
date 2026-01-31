/**
 * Test SMTP connection and email sending
 * Run with: node --loader tsx scripts/test-smtp.ts
 */

import { sendEmail } from '../src/email/sendEmail'

async function testSMTP() {
  console.log('🧪 Testing SMTP Configuration...\n')
  
  console.log('Configuration:')
  console.log('- Host:', process.env.SMTP_HOST)
  console.log('- Port:', process.env.SMTP_PORT)
  console.log('- Username:', process.env.SMTP_USERNAME)
  console.log('- From:', process.env.SMTP_SENDER_EMAIL)
  console.log()

  const testEmail = process.env.SMTP_SENDER_EMAIL || 'test@example.com'
  
  console.log(`📧 Sending test email to: ${testEmail}\n`)

  try {
    const result = await sendEmail({
      to: testEmail,
      subject: 'SMTP Test Email - CyPSi Lab',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #011e2c;">SMTP Configuration Test</h2>
          <p>This is a test email from the CyPSi Laboratory CMS.</p>
          <p>If you receive this email, your SMTP configuration is working correctly! ✅</p>
          <hr style="border: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Sent at: ${new Date().toLocaleString()}<br>
            Server: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}
          </p>
        </div>
      `,
    })

    if (result.success) {
      console.log('✅ SUCCESS! Email sent successfully')
      console.log('Message ID:', result.messageId)
    } else {
      console.log('❌ FAILED to send email')
      console.log('Error:', result.error)
    }
  } catch (error) {
    console.error('❌ ERROR:', error)
    
    if (error instanceof Error) {
      console.error('\nError Details:')
      console.error('- Message:', error.message)
      console.error('- Code:', (error as any).code)
      console.error('- Command:', (error as any).command)
      
      // Provide troubleshooting tips
      console.log('\n💡 Troubleshooting Tips:')
      
      if ((error as any).code === 'ETIMEDOUT' || (error as any).code === 'ECONNREFUSED') {
        console.log('- Port may be blocked. Try:')
        console.log('  - Port 587 (STARTTLS) - recommended')
        console.log('  - Port 465 (SSL)')
        console.log('  - Port 2525 (alternative)')
      }
      
      if (error.message.includes('Greeting never received')) {
        console.log('- SMTP server not responding. Check:')
        console.log('  - Correct SMTP host address')
        console.log('  - Firewall/network settings')
        console.log('  - Try a different port')
      }
      
      if (error.message.includes('authentication') || error.message.includes('login')) {
        console.log('- Check credentials:')
        console.log('  - SMTP_USERNAME is correct')
        console.log('  - SMTP_PASSWORD is correct')
        console.log('  - Account has SMTP access enabled')
      }
    }
  }
}

testSMTP()
