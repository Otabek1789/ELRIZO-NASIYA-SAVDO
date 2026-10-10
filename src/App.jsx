import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Storefront from './pages/Storefront'
import Catalog from './pages/Catalog'
import About from './pages/About'
import Contact from './pages/Contact'
import Faq from './pages/Faq'
import ProductDetail from './pages/ProductDetail'
import CartPage from './pages/CartPage'
import FavoritesPage from './pages/FavoritesPage'
import LoginPage from './pages/LoginPage'

// Admin panel routes
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Products from './pages/admin/Products'
import Orders from './pages/admin/Orders'
import Customers from './pages/admin/Customers'
import Categories from './pages/admin/Categories'
import Reviews from './pages/admin/Reviews'
import Promos from './pages/admin/Promos'
import Settings from './pages/admin/Settings'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* 5 Landing & Customer Pages */}
        <Route path="/" element={<Storefront />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />

        {/* E-Commerce Shop Subpages */}
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Panel Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="categories" element={<Categories />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="promos" element={<Promos />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  )
}
