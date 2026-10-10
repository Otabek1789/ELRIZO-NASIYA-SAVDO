import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { ORDERS } from '../data/products'
import { sendOrderTelegramNotification } from '../services/telegram'

const OrderContext = createContext(null)
const STORAGE_KEY = 'elrizo_orders'

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (e) {}
    return ORDERS
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
    } catch (e) {}
  }, [orders])

  const createOrder = useCallback(
    async (orderData) => {
      const newOrder = {
        id: `BZ-${Math.floor(10000 + Math.random() * 90000)}`,
        customer: orderData.customer || 'Mijoz',
        phone: orderData.phone || '+998 90 000 00 00',
        address: orderData.address || '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(),
        amount: orderData.total || 0,
        subtotal: orderData.subtotal || orderData.total || 0,
        discount: orderData.discount || 0,
        promoCode: orderData.promoCode || null,
        paymentMethod: orderData.paymentMethod || 'Naqd pul',
        deliveryType: orderData.deliveryType || 'Kuryer',
        notes: orderData.notes || '',
        items: orderData.items || [],
        status: 'pending',
      }

      // 1. Save to state and localStorage
      setOrders((prev) => [newOrder, ...prev])

      // 2. Dispatch to Telegram Bot (Requirement 7)
      try {
        await sendOrderTelegramNotification(newOrder)
      } catch (err) {
        console.warn('Telegram notification dispatch error:', err)
      }

      return newOrder
    },
    []
  )

  const updateOrderStatus = useCallback((id, status) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    )
  }, [])

  const deleteOrder = useCallback((id) => {
    setOrders((prev) => prev.filter((o) => o.id !== id))
  }, [])

  const value = {
    orders,
    createOrder,
    updateOrderStatus,
    deleteOrder,
  }

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export function useOrders() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrders must be used within OrderProvider')
  return ctx
}
