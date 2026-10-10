// Real Email Verification Service via Gmail SMTP
export async function sendEmailVerificationCode(email, code) {
  try {
    const appPassword = localStorage.getItem('elrizo_gmail_app_password') || ''

    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        code,
        appPassword,
      }),
    })

    const data = await res.json()
    console.log('[Email Dispatch Result]:', data)
    return data
  } catch (err) {
    console.warn('[Email Dispatch Failed]:', err)
    return { success: false, error: err.message }
  }
}
