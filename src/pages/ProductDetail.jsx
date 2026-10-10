import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Heart, ShoppingCart, Truck, ShieldCheck, RotateCcw, Share2 } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'
import FavoritesDrawer from '../components/FavoritesDrawer'
import SignInModal from '../components/SignInModal'
import Toast from '../components/Toast'
import ProductArt from '../components/ProductArt'
import ProductCard from '../components/ProductCard'
import { useState } from 'react'
import { useLang } from '../context/LangContext'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductContext'
import { formatMoney } from '../data/products'
import { CAT_KEY } from '../data/translations'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, lang } = useLang()
  const { cart, addToCart, favs, toggleFav, toast, showToast } = useCart()
  const { products } = useProducts()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [favsOpen, setFavsOpen] = useState(false)
  const [signInOpen, setSignInOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [qty, setQty] = useState(1)

  const product = products.find((p) => p.id === Number(id))

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center py-24 bg-surface dark:bg-[#16130F]">
        <p className="text-ink dark:text-[#F3EFE7] mb-4 text-lg font-semibold">
          {lang === 'uz' ? 'Mahsulot topilmadi' : lang === 'ru' ? 'Товар не найден' : 'Product not found'}
        </p>
        <button
          onClick={() => navigate('/catalog')}
          className="px-6 py-2.5 rounded-xl bg-brand text-white font-bold text-sm"
        >
          {t.continueShopping}
        </button>
      </div>
    )
  }

  const inCart = cart.some((i) => i.id === product.id)
  const isFav = favs.includes(product.id)
  const discountPct = product.old ? Math.round((1 - product.price / product.old) * 100) : null
  const related = products.filter((p) => p.cat === product.cat && p.id !== product.id).slice(0, 5)

  const handleBuyNow = () => {
    addToCart(product, t.addedToast, qty)
    navigate('/cart')
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-[#16130F]">
      <Header
        onOpenCart={() => setDrawerOpen(true)}
        onOpenFavs={() => setFavsOpen(true)}
        onOpenSignIn={() => setSignInOpen(true)}
        query={query}
        setQuery={setQuery}
      />

      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft hover:text-brand mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> {lang === 'uz' ? 'Orqaga qaytish' : lang === 'ru' ? 'Назад' : 'Go back'}
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-3xl p-6 sm:p-10 shadow-card">
          {/* Image & Badges */}
          <div className="relative aspect-square rounded-2xl bg-surface-sunken dark:bg-[#0F0D0A] flex items-center justify-center overflow-hidden">
            {discountPct && (
              <span className="absolute top-4 left-4 bg-accent text-white text-xs font-extrabold px-3 py-1 rounded-lg z-10 shadow-sm">
                -{discountPct}%
              </span>
            )}
            <button
              onClick={() => toggleFav(product.id, t.favAdded, t.favRemoved)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/85 dark:bg-[#14110D]/75 backdrop-blur flex items-center justify-center transition-colors z-10 shadow-sm ${
                isFav ? 'text-accent' : 'text-ink-soft'
              }`}
            >
              <Heart size={20} fill={isFav ? 'currentColor' : 'none'} />
            </button>
            <ProductArt cat={product.cat} id={product.id} className="w-3/5 h-3/5" />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <span className="text-xs font-bold text-brand uppercase tracking-wider mb-2">
              {t[CAT_KEY[product.cat]] || product.cat}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink dark:text-[#F3EFE7] mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 text-xs text-ink-soft mb-6 pb-4 border-b border-line dark:border-[#332C23]">
              <span className="flex items-center gap-1 text-[#F2A93B] font-bold">
                <Star size={15} fill="currentColor" /> {product.rating}
              </span>
              <span>· {product.reviews} ta sharh</span>
              <span className="text-good font-semibold">
                · {product.stock > 0 ? `Omborda mavjud (${product.stock} dona)` : 'Tugagan'}
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-extrabold text-brand">
                {formatMoney(product.price, lang)}
              </span>
              {product.old && (
                <span className="text-base text-ink-faint line-through">
                  {formatMoney(product.old, lang)}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-ink-soft leading-relaxed mb-6">
              {product.desc ||
                "Ushbu mahsulot yuqori sifatli materiallardan tayyorlangan bo'lib, xaridordan ijobiy baholarga sazovor bo'lgan. Yetkazib berish butun O'zbekiston bo'ylab 24 soat ichida amalga oshiriladi."}
            </p>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 mt-auto">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-line dark:border-[#332C23] rounded-xl overflow-hidden bg-surface dark:bg-[#16130F] h-11">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-full flex items-center justify-center text-ink hover:bg-surface-sunken dark:hover:bg-[#0F0D0A] font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-ink dark:text-[#F3EFE7]">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-full flex items-center justify-center text-ink hover:bg-surface-sunken dark:hover:bg-[#0F0D0A] font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => addToCart(product, t.addedToast, qty)}
                  className={`flex-1 h-11 rounded-xl border-[1.5px] border-brand font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                    inCart
                      ? 'bg-brand text-white'
                      : 'bg-transparent text-brand hover:bg-brand hover:text-white'
                  }`}
                >
                  <ShoppingCart size={16} />
                  <span>{inCart ? t.inCart : t.addToCart}</span>
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full h-12 rounded-xl bg-accent text-white font-bold text-sm hover:brightness-110 active:scale-[0.99] transition-all shadow-md"
              >
                {t.buyNow}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-line dark:border-[#332C23] text-center text-[11px] text-ink-soft">
              <div className="flex flex-col items-center gap-1">
                <Truck size={16} className="text-brand" />
                <span>24 soatda yetkazish</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck size={16} className="text-brand" />
                <span>100% original sifat</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw size={16} className="text-brand" />
                <span>14 kun kafolat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-bold text-ink dark:text-[#F3EFE7] mb-6">
              O'xshash mahsulotlar
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <FavoritesDrawer open={favsOpen} onClose={() => setFavsOpen(false)} />
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
      <Toast text={toast} />
    </div>
  )
}