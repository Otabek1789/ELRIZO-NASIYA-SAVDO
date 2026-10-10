// Real Email Dispatch Service for Verification Codes

export async function sendEmailVerificationCode(email, code) {
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        _subject: `Elrizo Tasdiqlash Kodi: ${code}`,
        _template: 'box',
        _captcha: 'false',
        Email: email,
        Tasdiqlash_Kodi: code,
        Xabar: `Sizning Elrizo internet do'koniga kirish uchun 6 xonali tasdiqlash kodingiz: ${code}. Xavfsizlik yuzasidan ushbu kodni hech kimga bermang!`,
      }),
    })

    const data = await res.json()
    console.log('[Email Service] Kod emailingizga yuborildi:', data)
    return { success: true, data }
  } catch (err) {
    console.warn('[Email Service] Tarmoq xatosi:', err)
    return { success: false, error: err.message }
  }
}
