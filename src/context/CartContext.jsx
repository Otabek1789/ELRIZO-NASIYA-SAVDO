import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

const CartContext = createContext(null)
const CART_STORAGE = 'elrizo_cart'
const FAVS_STORAGE = 'elrizo_favs'
const PROMO_STORAGE = 'elrizo_active_promo'

export const PROMO_CODES = {
  UZBEK2026: { code: 'UZBEK2026', discountPct: 15, type: 'percent', label: '15% chegirma' },
  SKIDKA10: { code: 'SKIDKA10', discountPct: 10, type: 'percent', label: '10% chegirma' },
  SUPER20: { code: 'SUPER20', discountPct: 20, type: 'percent', label: '20% chegirma' },
  FREE: { code: 'FREE', discountPct: 0, type: 'free_shipping', label: 'Bepul yetkazib berish' },
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE)
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return []
  })

  const [favs, setFavs] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVS_STORAGE)
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return []
  })

  const [appliedPromo, setAppliedPromo] = useState(() => {
    try {
      const saved = localStorage.getItem(PROMO_STORAGE)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (PROMO_CODES[parsed?.code?.toUpperCase()]) return parsed
      }
    } catch (e) {}
    return null
  })

  const [toast, setToastState] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE, JSON.stringify(cart))
    } catch (e) {}
  }, [cart])

  useEffect(() => {
    try {
      localStorage.setItem(FAVS_STORAGE, JSON.stringify(favs))
    } catch (e) {}
  }, [favs])

  useEffect(() => {
    try {
      if (appliedPromo) {
        localStorage.setItem(PROMO_STORAGE, JSON.stringify(appliedPromo))
      } else {
        localStorage.removeItem(PROMO_STORAGE)
      }
    } catch (e) {}
  }, [appliedPromo])

  const showToast = useCallback((text) => {
    setToastState(text)
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToastState(null), 2400)
  }, [])

  const addToCart = useCallback((product, message, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + quantity } : i))
      }
      return [...prev, { ...product, qty: quantity }]
    })
    if (message) showToast(message)
  }, [showToast])

  const changeQty = useCallback((id, delta) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
        .filter((i) => i.qty > 0)
    )
  }, [])

  const removeFromCart = useCallback((id, message) => {
    setCart((prev) => prev.filter((i) => i.id !== id))
    if (message) showToast(message)
  }, [showToast])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const toggleFav = useCallback((id, messageAdded, messageRemoved) => {
    setFavs((prev) => {
      const exists = prev.includes(id)
      if (exists) {
        if (messageRemoved) showToast(messageRemoved)
        return prev.filter((x) => x !== id)
      } else {
        if (messageAdded) showToast(messageAdded)
        return [...prev, id]
      }
    })
  }, [showToast])

  const clearFavs = useCallback(() => {
    setFavs([])
  }, [])

  const isFav = useCallback((id) => favs.includes(id), [favs])

  const applyPromo = useCallback((code) => {
    if (!code) return { success: false, error: 'empty' }
    const upper = code.trim().toUpperCase()
    const found = PROMO_CODES[upper]
    if (found) {
      setAppliedPromo(found)
      return { success: true, promo: found }
    }
    return { success: false, error: 'invalid' }
  }, [])

  const removePromo = useCallback(() => {
    setAppliedPromo(null)
  }, [])

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart])
  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.qty * i.price, 0), [cart])

  const shippingFee = useMemo(() => {
    if (cart.length === 0) return 0
    if (appliedPromo?.type === 'free_shipping') return 0
    // Free delivery threshold: 250,000 UZS
    if (subtotal >= 250000) return 0
    return 20000
  }, [cart.length, appliedPromo, subtotal])

  const discountAmount = useMemo(() => {
    if (!appliedPromo || cart.length === 0) return 0
    if (appliedPromo.type === 'percent') {
      return Math.round((subtotal * appliedPromo.discountPct) / 100)
    }
    return 0
  }, [appliedPromo, subtotal, cart.length])

  const cartTotal = useMemo(() => {
    if (cart.length === 0) return 0
    return Math.max(0, subtotal - discountAmount + shippingFee)
  }, [cart.length, subtotal, discountAmount, shippingFee])

  const value = {
    cart,
    favs,
    toast,
    showToast,
    addToCart,
    changeQty,
    removeFromCart,
    clearCart,
    toggleFav,
    clearFavs,
    isFav,
    appliedPromo,
    applyPromo,
    removePromo,
    cartCount,
    subtotal,
    shippingFee,
    discountAmount,
    cartTotal,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
