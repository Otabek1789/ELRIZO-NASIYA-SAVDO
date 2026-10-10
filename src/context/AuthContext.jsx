import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { sendTelegramMessage } from '../services/telegram'
import { sendEmailVerificationCode } from '../services/email'

const AuthContext = createContext(null)
const STORAGE_KEY = 'elrizo_user'
const USERS_STORAGE_KEY = 'elrizo_registered_users'

export const ADMIN_EMAIL = 'otabek1789@gmail.com'
export const ADMIN_PASSWORD = '7540084@OJr'

const INITIAL_USERS = [
  {
    id: 1,
    name: 'Otabek (Admin)',
    email: ADMIN_EMAIL,
    username: 'otabek1789',
    phone: '+998900000001',
    password: ADMIN_PASSWORD,
    role: 'admin',
  },
  {
    id: 2,
    name: 'Mijoz',
    email: 'mijoz@gmail.com',
    username: 'mijoz',
    phone: '+998901234567',
    password: 'user123',
    role: 'customer',
  },
]

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        const hasAdmin = parsed.some((u) => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase())
        if (!hasAdmin) return [...parsed, INITIAL_USERS[0]]
        return parsed.map((u) =>
          u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
            ? { ...u, password: ADMIN_PASSWORD, role: 'admin' }
            : u
        )
      }
    } catch (e) {}
    return INITIAL_USERS
  })

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return null
  })

  // Pending verification state for email code authentication
  const [pendingAuth, setPendingAuth] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
    } catch (e) {}
  }, [users])

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (e) {}
  }, [currentUser])

  /**
   * Step 1: Request email verification code with Email and Password
   * Sends real email and dispatches to Telegram
   */
  const requestLoginCode = useCallback(
    async (emailInput, passwordInput) => {
      const cleanEmail = emailInput?.trim().toLowerCase() || ''
      const cleanPass = passwordInput?.trim() || ''

      if (!cleanEmail) {
        return { success: false, error: 'Email manzilini kiriting' }
      }
      if (!cleanPass) {
        return { success: false, error: 'Parolni kiriting' }
      }

      const isAdminAttempt = cleanEmail === ADMIN_EMAIL.toLowerCase()

      // Check admin password
      if (isAdminAttempt) {
        if (cleanPass !== ADMIN_PASSWORD) {
          return { success: false, error: 'Admin paroli noto\'g\'ri!' }
        }
      } else {
        // For other users, if user already exists, verify password
        const existing = users.find((u) => u.email?.toLowerCase() === cleanEmail)
        if (existing && existing.password !== cleanPass) {
          return { success: false, error: 'Parol noto\'g\'ri!' }
        }
      }

      // Generate random 6-digit confirmation code
      const code = Math.floor(100000 + Math.random() * 900000).toString()

      const role = isAdminAttempt ? 'admin' : 'customer'
      const pendingData = {
        email: cleanEmail,
        password: cleanPass,
        code,
        role,
        timestamp: Date.now(),
      }

      setPendingAuth(pendingData)

      // Save to localStorage for debugging/offline reference
      try {
        localStorage.setItem('elrizo_last_code', code)
      } catch (e) {}
      console.log(`[Elrizo Security] 📧 Tasdiqlash kodi ${cleanEmail} manziliga yuborildi:`, code)

      // 1. Send Real Email to user's inbox
      let emailRes = null
      try {
        emailRes = await sendEmailVerificationCode(cleanEmail, code)
      } catch (err) {
        console.warn('Email dispatch failed:', err)
      }

      return {
        success: true,
        email: cleanEmail,
        role,
        emailRes,
      }
    },
    [users]
  )

  /**
   * Step 2: Verify the 6-digit code and complete login
   */
  const verifyCodeAndLogin = useCallback(
    (inputCode) => {
      if (!pendingAuth) {
        return { success: false, error: 'Avval email va parolni kiriting' }
      }

      const cleanCode = inputCode?.trim()
      if (cleanCode !== pendingAuth.code) {
        return { success: false, error: 'Kiritilgan tasdiqlash kodi noto\'g\'ri!' }
      }

      const cleanEmail = pendingAuth.email
      const isAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase()

      let matchedUser = users.find((u) => u.email?.toLowerCase() === cleanEmail)
      if (!matchedUser) {
        matchedUser = {
          id: Date.now(),
          name: cleanEmail.split('@')[0],
          email: cleanEmail,
          password: pendingAuth.password,
          role: isAdmin ? 'admin' : 'customer',
        }
        setUsers((prev) => [...prev, matchedUser])
      } else {
        matchedUser = {
          ...matchedUser,
          role: isAdmin ? 'admin' : 'customer',
        }
      }

      const sessionUser = {
        id: matchedUser.id,
        name: isAdmin ? 'Otabek (Admin)' : matchedUser.name || cleanEmail.split('@')[0],
        email: cleanEmail,
        role: isAdmin ? 'admin' : 'customer',
      }

      setCurrentUser(sessionUser)
      setPendingAuth(null)

      return { success: true, user: sessionUser }
    },
    [pendingAuth, users]
  )

  const cancelVerification = useCallback(() => {
    setPendingAuth(null)
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
    setPendingAuth(null)
  }, [])

  const value = {
    user: currentUser,
    isAdmin:
      currentUser?.role === 'admin' &&
      currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase(),
    isLoggedIn: !!currentUser,
    pendingAuth,
    requestLoginCode,
    verifyCodeAndLogin,
    cancelVerification,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
