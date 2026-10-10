import { useState, useEffect } from 'react'
import { X, Mail, KeyRound, ShieldCheck } from 'lucide-react'
import { useLang } from '../context/LangContext'
import { useAuth, ADMIN_EMAIL, ADMIN_PASSWORD } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './SignInModal.css'

export default function SignInModal({ open, onClose }) {
  const { lang, t } = useLang()
  const {
    requestLoginCode,
    verifyCodeAndLogin,
    cancelVerification,
  } = useAuth()
  const { showToast } = useCart()

  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [step, setStep] = useState('credentials') // 'credentials' | 'verify'

  // Input states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Reset when modal opens/closes
  useEffect(() => {
    if (open) {
      setStep('credentials')
      setError('')
      setVerificationCode('')
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      cancelVerification()
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open, cancelVerification])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  // Step 1: Submit credentials to receive verification code to email
  const handleRequestCode = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await requestLoginCode(email, password)
    setLoading(false)

    if (res.success) {
      setStep('verify')
      setVerificationCode('')
      showToast(`📧 Tasdiqlash kodi ${email} emailingizga yuborildi!`, 5000)
    } else {
      setError(res.error)
    }
  }

  // Step 2: Submit 6-digit verification code to complete login
  const handleVerifyCode = (e) => {
    e.preventDefault()
    setError('')

    const res = verifyCodeAndLogin(verificationCode)
    if (res.success) {
      if (res.user.role === 'admin') {
        showToast("👑 Xush kelibsiz, Admin! Admin panel faollashdi.")
      } else {
        showToast("🛍 Xush kelibsiz! Tizimga muvaffaqiyatli kirdingiz.")
      }
      onClose()
    } else {
      setError(res.error)
    }
  }

  // Quick fill demo buttons
  const handlePreFillAdmin = () => {
    setEmail(ADMIN_EMAIL)
    setPassword(ADMIN_PASSWORD)
    setError('')
  }

  const handlePreFillCustomer = () => {
    setEmail('mijoz@gmail.com')
    setPassword('mijoz123')
    setError('')
  }

  return (
    <div className={`auth-overlay ${mode === 'signup' ? 'auth-mode-signup' : ''}`}>
      <button className="auth-close" onClick={onClose} aria-label="close">
        <X size={20} />
      </button>

      <div className="auth-forms-container">
        <div className="auth-signin-signup">
          {/* Sign In Form */}
          <form
            className="auth-form auth-sign-in-form"
            onSubmit={step === 'credentials' ? handleRequestCode : handleVerifyCode}
          >
            {step === 'credentials' ? (
              <>
                <h2 className="auth-title">Kirish</h2>

                {error && (
                  <div
                    style={{
                      color: '#e02424',
                      fontSize: '13px',
                      fontWeight: 700,
                      marginBottom: '10px',
                      textAlign: 'center',
                      background: '#ffebeb',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      width: '100%',
                      maxWidth: '380px',
                    }}
                  >
                    {error}
                  </div>
                )}

                <div className="auth-input-field">
                  <i className="fa-solid fa-envelope"></i>
                  <input
                    type="email"
                    required
                    placeholder="Emailingizni kiriting"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="auth-input-field">
                  <i className="fa-solid fa-lock"></i>
                  <input
                    type="password"
                    required
                    placeholder="Parolingizni kiriting"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <input
                  type="submit"
                  value={loading ? 'Yuborilmoqda...' : 'KIRISH'}
                  className="auth-btn auth-solid"
                  disabled={loading}
                />

                {/* Quick Auto-Fill Buttons */}
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '10px',
                    width: '100%',
                    maxWidth: '380px',
                    justifyContent: 'center',
                  }}
                >
                  <button
                    type="button"
                    onClick={handlePreFillAdmin}
                    style={{
                      padding: '7px 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #6C3EF4',
                      background: email === ADMIN_EMAIL ? '#6C3EF4' : '#F0EBFF',
                      color: email === ADMIN_EMAIL ? '#ffffff' : '#4A2BAE',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    👑 Admin (otabek1789)
                  </button>
                  <button
                    type="button"
                    onClick={handlePreFillCustomer}
                    style={{
                      padding: '7px 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #ccc',
                      background: '#f8f8f8',
                      color: '#333',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    🛍 Boshqa email (Mijoz)
                  </button>
                </div>

                <p className="auth-social-text">yoki ijtimoiy tarmoqlar orqali kiring</p>
                <div className="auth-social-media">
                  <a href="#" className="auth-social-icon" onClick={(e) => e.preventDefault()}>
                    <i className="fa-brands fa-facebook-f"></i>
                  </a>
                  <a href="#" className="auth-social-icon" onClick={(e) => e.preventDefault()}>
                    <i className="fa-brands fa-twitter"></i>
                  </a>
                  <a href="#" className="auth-social-icon" onClick={(e) => e.preventDefault()}>
                    <i className="fa-brands fa-google"></i>
                  </a>
                  <a href="#" className="auth-social-icon" onClick={(e) => e.preventDefault()}>
                    <i className="fa-brands fa-linkedin-in"></i>
                  </a>
                </div>
              </>
            ) : (
              /* Step 2: Verification Code Entry (Code NOT shown here on screen!) */
              <>
                <h2 className="auth-title" style={{ fontSize: '24px' }}>
                  Tasdiqlash kodi
                </h2>

                <div
                  style={{
                    background: '#F0EBFF',
                    border: '1px solid #D6C7FF',
                    borderRadius: '12px',
                    padding: '13px 18px',
                    width: '100%',
                    maxWidth: '380px',
                    textAlign: 'center',
                    marginBottom: '14px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '13.5px',
                      color: '#331B8A',
                      margin: 0,
                      lineHeight: '1.45',
                      fontWeight: '700',
                    }}
                  >
                    📧 Tasdiqlash kodi emailingizga yuborildi!
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#6C3EF4',
                      margin: '5px 0 0 0',
                      lineHeight: '1.4',
                    }}
                  >
                    <b>{email}</b> pochtangizni tekshiring va kelgan 6 xonali kodni kiriting.
                  </p>
                </div>

                {error && (
                  <div
                    style={{
                      color: '#e02424',
                      fontSize: '13px',
                      fontWeight: 700,
                      marginBottom: '10px',
                      textAlign: 'center',
                      background: '#ffebeb',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      width: '100%',
                      maxWidth: '380px',
                    }}
                  >
                    {error}
                  </div>
                )}

                <div className="auth-input-field">
                  <i className="fa-solid fa-key"></i>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="6 xonali kodni kiriting"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    autoFocus
                    style={{ letterSpacing: '4px', fontSize: '17px', fontWeight: 'bold' }}
                  />
                </div>

                <input
                  type="submit"
                  value="TASDIQLASH"
                  className="auth-btn auth-solid"
                />

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    maxWidth: '380px',
                    marginTop: '12px',
                    fontSize: '12.5px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setStep('credentials')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6c3ef4',
                      cursor: 'pointer',
                      fontWeight: '600',
                    }}
                  >
                    ← Boshqa email
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await requestLoginCode(email, password)
                      showToast('📧 Kod emailingizga qayta yuborildi!')
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#444',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Kodni qayta yuborish
                  </button>
                </div>
              </>
            )}
          </form>

          {/* Sign Up Form */}
          <form
            className="auth-form auth-sign-up-form"
            onSubmit={(e) => {
              e.preventDefault()
              setMode('signin')
              setStep('credentials')
            }}
          >
            <h2 className="auth-title">Ro'yxatdan o'tish</h2>
            <div className="auth-input-field">
              <i className="fa-solid fa-user"></i>
              <input type="text" placeholder="Ismingiz" required />
            </div>
            <div className="auth-input-field">
              <i className="fa-solid fa-envelope"></i>
              <input type="email" placeholder="Emailingiz" required />
            </div>
            <div className="auth-input-field">
              <i className="fa-solid fa-lock"></i>
              <input type="password" placeholder="Parol" required />
            </div>
            <input type="submit" value="Ro'yxatdan o'tish" className="auth-btn" />
            <p className="auth-social-text">yoki ijtimoiy tarmoqlar orqali ro'yxatdan o'ting</p>
            <div className="auth-social-media">
              <a href="#" className="auth-social-icon" onClick={(e) => e.preventDefault()}>
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className="auth-social-icon" onClick={(e) => e.preventDefault()}>
                <i className="fa-brands fa-twitter"></i>
              </a>
              <a href="#" className="auth-social-icon" onClick={(e) => e.preventDefault()}>
                <i className="fa-brands fa-google"></i>
              </a>
              <a href="#" className="auth-social-icon" onClick={(e) => e.preventDefault()}>
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Sliding Side Panels */}
      <div className="auth-panels-container">
        <div className="auth-panel auth-left-panel">
          <div className="auth-content">
            <h3>Yangimisiz?</h3>
            <p>Ro'yxatdan o'ting va xaridlaringizni kuzatib boring, sevimlilar ro'yxatini saqlang.</p>
            <button
              type="button"
              className="auth-btn auth-transparent"
              onClick={() => {
                setError('')
                setMode('signup')
              }}
            >
              Ro'yxatdan o'tish
            </button>
          </div>
          <img src="/log.svg" className="auth-image" alt="" />
        </div>

        <div className="auth-panel auth-right-panel">
          <div className="auth-content">
            <h3>Hisobingiz bormi?</h3>
            <p>Kirish orqali buyurtmalaringizni va sevimli mahsulotlaringizni ko'ring.</p>
            <button
              type="button"
              className="auth-btn auth-transparent"
              onClick={() => {
                setError('')
                setMode('signin')
                setStep('credentials')
              }}
            >
              Kirish
            </button>
          </div>
          <img src="/register.svg" className="auth-image" alt="" />
        </div>
      </div>
    </div>
  )
}