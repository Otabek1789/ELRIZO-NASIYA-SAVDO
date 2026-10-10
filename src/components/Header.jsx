import { useState, useRef, useEffect } from 'react'
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  ShieldCheck,
  Package,
  MapPin,
  Menu,
  X,
} from 'lucide-react'
import { useLang } from '../context/LangContext'
import { useTheme } from '../context/ThemeContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useProducts } from '../context/ProductContext'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { formatMoney } from '../data/products'
import ProductArt from './ProductArt'
import SignInModal from './SignInModal'

export default function Header({
  onOpenCart,
  onOpenFavs,
  onOpenSignIn,
  query,
  setQuery,
}) {
  const { t, lang, setLang } = useLang()
  const { theme, toggleTheme } = useTheme()
  const { cartCount, favs } = useCart()
  const { user, isAdmin, logout } = useAuth()
  const { products } = useProducts()
  const navigate = useNavigate()
  const location = useLocation()

  const [userDropdown, setUserDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [internalSignInOpen, setInternalSignInOpen] = useState(false)
  const searchRef = useRef(null)

  const handleOpenLogin = () => {
    if (onOpenSignIn) {
      onOpenSignIn()
    } else {
      setInternalSignInOpen(true)
    }
  }

  // Live search preview suggestions
  const liveResults = query?.trim()
    ? products
        .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
    : []

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault()
    if (query?.trim()) {
      setSearchFocused(false)
      navigate(`/catalog?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const navLinks = [
    { to: '/', label: t.navHome },
    { to: '/catalog', label: t.navCatalog },
    { to: '/about', label: t.navAbout },
    { to: '/contact', label: t.navContact },
    { to: '/faq', label: t.navFaq },
  ]

  return (
    <header className="sticky top-0 z-40 bg-surface/95 dark:bg-[#16130F]/95 border-b border-line dark:border-[#332C23] backdrop-blur-md">
      {/* Top Banner */}
      <div className="w-full bg-brand-dark dark:bg-[#0F0D0A] text-[#EDE6FF] dark:text-[#C9B8FF] text-[12px] tracking-[0.02em]">
        <div className="max-w-[1240px] mx-auto py-1.5 px-4 sm:px-6 flex items-center justify-between">
          <span className="hidden sm:inline">
            {lang === 'uz'
              ? "🚚 250 000 so'mdan yuqori xaridlarda yetkazib berish bepul"
              : lang === 'ru'
              ? '🚚 Бесплатная доставка при заказе от 250 000 сум'
              : '🚚 Free delivery on orders over 250,000 UZS'}
          </span>
          <div className="flex items-center gap-4 mx-auto sm:mx-0 text-[11.5px]">
            <Link to="/contact" className="hover:underline flex items-center gap-1">
              <MapPin size={12} /> Tashkent, Amir Temur 15
            </Link>
            <span className="opacity-60">|</span>
            <span className="font-semibold">Tel: +998 71 200 00 00</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-[1240px] mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-line dark:border-[#332C23] text-ink-soft"
          aria-label="menu"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 font-display font-bold text-[22px] flex-shrink-0 text-ink dark:text-[#F3EFE7]"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand to-brand-light flex items-center justify-center text-white font-body font-extrabold text-[15px] shadow-sm">
            {t.brand.charAt(0)}
          </div>
          <span>{t.brand}</span>
        </Link>

        {/* Search Bar with Live Suggestions */}
        <div ref={searchRef} className="relative flex-1 max-w-[460px] hidden md:block">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full flex items-center bg-surface-sunken dark:bg-[#0F0D0A] border-[1.5px] border-line dark:border-[#332C23] focus-within:border-brand rounded-xl pl-3.5 pr-1.5 h-10.5 transition-colors"
          >
            <Search size={16} className="text-ink-faint flex-shrink-0" />
            <input
              className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm px-2 text-ink dark:text-[#F3EFE7] placeholder:text-ink-faint min-w-0"
              placeholder={t.searchPh}
              value={query || ''}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => {
                setQuery(e.target.value)
                setSearchFocused(true)
              }}
            />
            <button
              type="submit"
              className="bg-brand hover:brightness-110 text-white rounded-lg h-8 w-8 flex items-center justify-center flex-shrink-0 transition-all"
            >
              <Search size={14} />
            </button>
          </form>

          {/* Live Search Preview Dropdown */}
          {searchFocused && query?.trim() && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="p-2 border-b border-line dark:border-[#332C23] text-[11px] font-bold text-ink-faint uppercase tracking-wider flex justify-between">
                <span>{t.searchLabel}</span>
                <span>{liveResults.length} {t.pcs}</span>
              </div>
              {liveResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-ink-faint">
                  {t.noResults}
                </div>
              ) : (
                <div className="divide-y divide-line dark:divide-[#332C23]">
                  {liveResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSearchFocused(false)
                        navigate(`/product/${item.id}`)
                      }}
                      className="p-2.5 flex items-center gap-3 hover:bg-surface-sunken dark:hover:bg-[#0F0D0A] cursor-pointer transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-surface-sunken dark:bg-[#0F0D0A] flex items-center justify-center flex-shrink-0">
                        <ProductArt cat={item.cat} id={item.id} className="w-3/5 h-3/5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-ink dark:text-[#F3EFE7] truncate">
                          {item.name}
                        </div>
                        <div className="text-[11px] font-bold text-brand">
                          {formatMoney(item.price, lang)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div
                    onClick={handleSearchSubmit}
                    className="p-2.5 text-center text-xs font-bold text-brand bg-brand-soft/40 dark:bg-[#2A2140] hover:underline cursor-pointer"
                  >
                    {t.seeAll} ({products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).length}) →
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Language Switcher */}
          <div className="flex items-center border border-line dark:border-[#332C23] rounded-xl overflow-hidden h-9 bg-surface dark:bg-[#16130F]">
            {['uz', 'ru', 'en'].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 sm:px-2.5 h-full text-[11.5px] font-bold uppercase transition-colors ${
                  lang === l
                    ? 'bg-brand text-white'
                    : 'text-ink-soft hover:text-ink dark:hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            title="Theme"
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-line dark:border-[#332C23] bg-surface-elevated dark:bg-[#211C17] text-ink-soft hover:border-brand hover:text-brand transition-colors"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={onOpenFavs || (() => navigate('/favorites'))}
            title={t.favorites}
            className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-line dark:border-[#332C23] bg-surface-elevated dark:bg-[#211C17] text-ink-soft hover:border-brand hover:text-brand transition-colors"
          >
            <Heart size={16} />
            {favs.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 shadow-sm">
                {favs.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart || (() => navigate('/cart'))}
            title={t.cart}
            className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-line dark:border-[#332C23] bg-surface-elevated dark:bg-[#211C17] text-ink-soft hover:border-brand hover:text-brand transition-colors"
          >
            <ShoppingCart size={16} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Profile */}
          <div className="relative">
            {user ? (
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-1.5 h-9 px-2.5 rounded-xl border border-brand/50 bg-brand-soft/40 dark:bg-[#2A2140] text-brand-dark dark:text-[#EDE6FF] text-xs font-bold hover:brightness-105 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center text-[10px] uppercase font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline max-w-[90px] truncate">{user.name}</span>
                <ChevronDown size={13} />
              </button>
            ) : (
              <button
                onClick={handleOpenLogin}
                title={t.login}
                className="flex items-center justify-center w-9 h-9 rounded-xl border border-line dark:border-[#332C23] bg-surface-elevated dark:bg-[#211C17] text-ink-soft hover:border-brand hover:text-brand transition-colors"
              >
                <User size={16} />
              </button>
            )}

            {/* Profile Dropdown */}
            {userDropdown && user && (
              <div
                onClick={() => setUserDropdown(false)}
                className="absolute right-0 top-full mt-2 w-52 bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-xl shadow-2xl p-2 z-50 text-xs font-medium text-ink dark:text-[#F3EFE7]"
              >
                <div className="px-3 py-2 border-b border-line dark:border-[#332C23]">
                  <div className="font-bold truncate">{user.name}</div>
                  <div className="text-[11px] text-ink-faint">{user.phone || user.username}</div>
                  {isAdmin && (
                    <span className="inline-block mt-1 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-brand text-white">
                      Admin
                    </span>
                  )}
                </div>

                <Link
                  to="/favorites"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-sunken dark:hover:bg-[#0F0D0A] transition-colors"
                >
                  <Heart size={14} /> {t.favorites}
                </Link>
                <Link
                  to="/cart"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-sunken dark:hover:bg-[#0F0D0A] transition-colors"
                >
                  <ShoppingCart size={14} /> {t.cart}
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-brand font-bold hover:bg-brand-soft/40 dark:hover:bg-[#2A2140] transition-colors"
                  >
                    <ShieldCheck size={14} /> {t.admin}
                  </Link>
                )}

                <div className="border-t border-line dark:border-[#332C23] my-1" />

                <button
                  onClick={() => {
                    logout()
                    setUserDropdown(false)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-bad hover:bg-bad-soft transition-colors font-semibold text-left"
                >
                  <LogOut size={14} /> {t.logout}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Links Bar (Desktop 5 Landing Pages) */}
      <div className="border-t border-line dark:border-[#332C23] bg-surface dark:bg-[#16130F] hidden lg:block">
        <div className="max-w-[1240px] mx-auto px-6 flex items-center justify-between">
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => {
              const active =
                link.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.to)
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2.5 text-[13.5px] font-semibold border-b-2 transition-colors ${
                    active
                      ? 'border-brand text-brand'
                      : 'border-transparent text-ink-soft hover:text-ink dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
          <div className="flex items-center gap-3 text-xs text-ink-soft">
            <Link
              to="/catalog?discount=true"
              className="text-accent font-bold hover:underline flex items-center gap-1"
            >
              🔥 {t.specialOffers}
            </Link>
            <span className="opacity-40">|</span>
            <Link to="/contact" className="hover:underline flex items-center gap-1">
              📍 4 ta Filial
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-line dark:border-[#332C23] bg-surface-elevated dark:bg-[#211C17] px-5 py-4 space-y-2">
          {/* Mobile search bar */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder={t.searchPh}
              value={query || ''}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-line dark:border-[#332C23] bg-surface dark:bg-[#16130F] text-ink dark:text-[#F3EFE7] outline-none"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-brand text-white rounded-xl text-xs font-bold"
            >
              {t.searchPh.split(' ')[0]}
            </button>
          </form>

          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-ink dark:text-[#F3EFE7] hover:bg-surface-sunken dark:hover:bg-[#0F0D0A]"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-2 border-t border-line dark:border-[#332C23]">
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-brand hover:bg-brand-soft/40"
              >
                ⚙️ {t.admin}
              </Link>
            )}
          </div>
        </div>
      )}

      {/* On-page Sign In Modal */}
      <SignInModal
        open={internalSignInOpen}
        onClose={() => setInternalSignInOpen(false)}
      />
    </header>
  )
}