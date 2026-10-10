import { useState } from 'react'
import { Heart, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'
import FavoritesDrawer from '../components/FavoritesDrawer'
import SignInModal from '../components/SignInModal'
import ProductCard from '../components/ProductCard'
import Toast from '../components/Toast'
import { useLang } from '../context/LangContext'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductContext'

export default function FavoritesPage() {
  const { t, lang } = useLang()
  const { favs, clearFavs, toast } = useCart()
  const { products } = useProducts()
  const navigate = useNavigate()

  const [cartOpen, setCartOpen] = useState(false)
  const [favsOpen, setFavsOpen] = useState(false)
  const [signInOpen, setSignInOpen] = useState(false)
  const [query, setQuery] = useState('')

  const favProducts = products.filter((p) => favs.includes(p.id))

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-[#16130F]">
      <Header
        onOpenCart={() => setCartOpen(true)}
        onOpenFavs={() => setFavsOpen(true)}
        onOpenSignIn={() => setSignInOpen(true)}
        query={query}
        setQuery={setQuery}
      />

      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                to="/"
                className="text-xs font-semibold text-ink-soft hover:text-brand flex items-center gap-1"
              >
                <ArrowLeft size={14} /> {t.backToHome}
              </Link>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink dark:text-[#F3EFE7] flex items-center gap-2">
              <Heart className="text-accent" fill="currentColor" size={26} />
              <span>{t.favorites}</span>
              <span className="text-base text-ink-faint font-normal">
                ({favProducts.length})
              </span>
            </h1>
          </div>

          {favProducts.length > 0 && (
            <button
              onClick={clearFavs}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-line dark:border-[#332C23] text-bad hover:bg-bad-soft text-xs font-bold transition-colors"
            >
              <Trash2 size={14} /> {t.clearFavs}
            </button>
          )}
        </div>

        {favProducts.length === 0 ? (
          <div className="text-center py-24 bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl p-8 max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-full bg-accent-soft/40 dark:bg-[#3A2418] text-accent flex items-center justify-center mx-auto mb-4">
              <Heart size={36} />
            </div>
            <h3 className="text-xl font-display font-bold text-ink dark:text-[#F3EFE7] mb-2">
              {t.favEmpty}
            </h3>
            <p className="text-sm text-ink-soft max-w-sm mx-auto mb-6">{t.favEmptyD}</p>
            <button
              onClick={() => navigate('/catalog')}
              className="px-6 py-3 rounded-xl bg-brand text-white font-bold text-sm hover:brightness-110 transition-all shadow-md"
            >
              {t.continueShopping}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>

      <Footer />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <FavoritesDrawer open={favsOpen} onClose={() => setFavsOpen(false)} />
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
      <Toast text={toast} />
    </div>
  )
}
