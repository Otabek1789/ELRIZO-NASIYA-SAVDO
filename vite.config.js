import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import nodemailer from 'nodemailer'

function emailPlugin() {
  return {
    name: 'email-api',
    configureServer(server) {
      server.middlewares.use('/api/send-email', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          return res.end(JSON.stringify({ error: 'Method not allowed' }))
        }

        let body = ''
        req.on('data', (chunk) => {
          body += chunk
        })
        req.on('end', async () => {
          try {
            const { to, code, appPassword } = JSON.parse(body || '{}')

            const pass = appPassword || process.env.GMAIL_APP_PASSWORD || ''

            if (!pass) {
              res.setHeader('Content-Type', 'application/json')
              return res.end(
                JSON.stringify({
                  success: false,
                  needsAppPassword: true,
                  error: "Google 'Ilova paroli' (App Password) kiritilmagan",
                })
              )
            }

            const cleanPass = pass.replace(/\s+/g, '')
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'otabek1789@gmail.com',
                pass: cleanPass,
              },
            })

            const info = await transporter.sendMail({
              from: '"Otabek" <otabek1789@gmail.com>',
              to: to || 'otabek1789@gmail.com',
              subject: `Elrizo Tasdiqlash Kodi: ${code}`,
              html: `
                <div style="font-family: Arial, sans-serif; padding: 24px; background: #f8f6fe; border-radius: 16px; max-width: 500px; margin: 0 auto; border: 1px solid #e2d9fc;">
                  <h2 style="color: #6c3ef4; margin-top: 0; font-size: 22px;">Elrizo Internet Do'koni</h2>
                  <p style="font-size: 14px; color: #333; line-height: 1.5;">
                    Sizning hisobingizga kirish uchun 6 xonali tasdiqlash kodingiz:
                  </p>
                  <div style="background: #ffffff; border: 2px dashed #6c3ef4; border-radius: 12px; padding: 16px; text-align: center; font-size: 34px; font-weight: bold; letter-spacing: 8px; color: #6c3ef4; margin: 20px 0;">
                    ${code}
                  </div>
                  <p style="font-size: 12px; color: #888; line-height: 1.4;">
                    Ushbu kodni hech kimga bermang. Agar siz tizimga kirishni so'ramagan bo'lsangiz, ushbu xatni e'tiborsiz qoldiring.
                  </p>
                </div>
              `,
            })

            console.log(`[Gmail Direct] Email yuborildi: ${info.messageId}`)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, messageId: info.messageId }))
          } catch (err) {
            console.error('[Gmail Direct Xatosi]:', err.message)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: false, error: err.message }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), emailPlugin()],
})