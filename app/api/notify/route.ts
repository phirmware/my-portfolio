/**
 * /api/notify — Portfolio visit email summary
 *
 * Called by the client after 4 minutes of inactivity post last question.
 * Sends Chibu an email with all questions the visitor asked.
 *
 * Required env vars:
 *   NOTIFY_EMAIL_USER  — Gmail address to send from
 *   NOTIFY_EMAIL_PASS  — Gmail App Password (not your account password)
 *   NOTIFY_EMAIL_TO    — Address to receive the notification (can be the same)
 */

import nodemailer from 'nodemailer'

export const runtime = 'nodejs'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST ?? 'mail.privateemail.com',
  port: parseInt(process.env.EMAIL_PORT ?? '587'),
  secure: false, // STARTTLS on port 587
  auth: {
    user: process.env.NOTIFY_EMAIL_USER,
    pass: process.env.NOTIFY_EMAIL_PASS,
  },
})

export async function POST(req: Request) {
  try {
    const { questions } = await req.json()

    if (!Array.isArray(questions) || questions.length === 0) {
      return new Response(JSON.stringify({ error: 'No questions provided' }), { status: 400 })
    }

    const sanitised = questions
      .filter((q): q is string => typeof q === 'string' && q.trim().length > 0)
      .slice(0, 20) // safety cap

    if (sanitised.length === 0) {
      return new Response(JSON.stringify({ error: 'No valid questions' }), { status: 400 })
    }

    const timestamp = new Date().toUTCString()
    const questionList = sanitised
      .map((q, i) => `<tr>
        <td style="padding:10px 12px;color:#94a3b8;font-size:13px;vertical-align:top;white-space:nowrap;">${i + 1}.</td>
        <td style="padding:10px 12px;color:#e2e8f0;font-size:14px;line-height:1.6;">${q}</td>
      </tr>`)
      .join('')

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#080b14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:580px;margin:40px auto;padding:0 20px;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0e7490,#7c3aed);border-radius:12px 12px 0 0;padding:28px 32px;">
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.6);letter-spacing:2px;text-transform:uppercase;">Portfolio Notification</p>
      <h1 style="margin:8px 0 0;font-size:22px;color:#ffffff;font-weight:700;">
        Someone explored your portfolio 👀
      </h1>
    </div>

    <!-- Body -->
    <div style="background:#0f1629;border:1px solid rgba(255,255,255,0.06);border-top:none;border-radius:0 0 12px 12px;padding:28px 32px;">

      <p style="margin:0 0 20px;font-size:14px;color:#94a3b8;line-height:1.6;">
        A visitor asked <strong style="color:#22d3ee;">${sanitised.length} question${sanitised.length > 1 ? 's' : ''}</strong> to your AI assistant.
        Here's what they wanted to know:
      </p>

      <!-- Questions table -->
      <div style="background:#080b14;border:1px solid rgba(255,255,255,0.06);border-radius:8px;overflow:hidden;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          ${questionList}
        </table>
      </div>

      <!-- Footer meta -->
      <p style="margin:0;font-size:12px;color:#475569;">
        🕐 ${timestamp}
      </p>

    </div>

    <p style="text-align:center;font-size:11px;color:#334155;margin-top:20px;">
      chibuzorojukwu.dev · AI portfolio assistant
    </p>
  </div>
</body>
</html>`

    await transporter.sendMail({
      from: `"Chibu Portfolio" <${process.env.NOTIFY_EMAIL_USER}>`,
      to: process.env.NOTIFY_EMAIL_TO ?? 'chibuzorojukwu@gmail.com',
      subject: `📬 Portfolio visitor asked ${sanitised.length} question${sanitised.length > 1 ? 's' : ''}`,
      html,
    })

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (err) {
    console.error('[/api/notify] Error:', err)
    return new Response(JSON.stringify({ error: 'Failed to send notification' }), { status: 500 })
  }
}
