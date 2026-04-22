const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const envPath = path.join(process.cwd(), '.env.local');
const envLines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
const env = {};
for (const line of envLines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const idx = trimmed.indexOf('=');
  if (idx < 0) continue;
  const key = trimmed.slice(0, idx);
  const value = trimmed.slice(idx + 1);
  env[key] = value;
}
if (!env.SMTP_HOST || !env.SMTP_PORT || !env.SMTP_USER || !env.SMTP_PASS || !env.SMTP_FROM || !env.RESTORE_M) {
  console.error('Missing SMTP config in .env.local');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: Number(env.SMTP_PORT) === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

(async () => {
  await transporter.verify();
  const info = await transporter.sendMail({
    from: env.SMTP_FROM,
    to: env.RESTORE_M,
    subject: 'SMTP delivery test from MyWallet.Help',
    text: 'This is a test email sent from your configured SMTP settings.',
  });
  console.log('SMTP test succeeded');
  console.log('Message ID:', info.messageId);
})().catch(err => {
  console.error('SMTP test failed');
  console.error(err);
  process.exit(1);
});