import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { ALL_PRODUCTS, CATS } from '../data/products'

const ProductContext = createContext(null)
const STORAGE_KEY = 'elrizo_products'

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (e) {
      console.warn('Failed to load products from localStorage', e)
    }
    return ALL_PRODUCTS
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    } catch (e) {
      console.warn('Failed to save products to localStorage', e)
    }
  }, [products])

  const addProduct = useCallback((newProd) => {
    setProducts((prev) => {
      const nextId = prev.length > 0 ? Math.max(...prev.map((p) => p.id)) + 1 : 1
      const item = {
        id: nextId,
        name: newProd.name || "Nomsiz mahsulot",
        cat: newProd.cat || CATS[0],
        price: Number(newProd.price) || 0,
        old: newProd.old ? Number(newProd.old) : null,
        rating: newProd.rating || "5.0",
        reviews: newProd.reviews || 0,
        stock: Number(newProd.stock) || 0,
        sold: 0,
        isNew: true,
        desc: newProd.desc || "",
      }
      return [item, ...prev]
    })
  }, [])

  const updateProduct = useCallback((id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            ...updatedFields,
            price: Number(updatedFields.price !== undefined ? updatedFields.price : p.price),
            old: updatedFields.old ? Number(updatedFields.old) : null,
            stock: Number(updatedFields.stock !== undefined ? updatedFields.stock : p.stock),
          }
        }
        return p
      })
    )
  }, [])

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const resetProducts = useCallback(() => {
    setProducts(ALL_PRODUCTS)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ALL_PRODUCTS))
    } catch (e) {}
  }, [])

  const value = {
    products,
    categories: CATS,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
  }

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error('useProducts must be used within ProductProvider')
  return ctx
}
