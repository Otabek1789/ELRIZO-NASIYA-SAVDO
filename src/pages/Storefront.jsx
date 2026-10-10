import { useMemo, useState } from 'react'
import { ChevronRight, ArrowRight, MapPin, Sparkles, Star, Quote } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import CategoryNav from '../components/CategoryNav'
import Hero from '../components/Hero'
import MiniBanners from '../components/MiniBanners'
import ProductCard from '../components/ProductCard'
import CartDrawer from '../components/CartDrawer'
import FavoritesDrawer from '../components/FavoritesDrawer'
import Footer from '../components/Footer'
import Toast from '../components/Toast'
import SignInModal from '../components/SignInModal'
import { useLang } from '../context/LangContext'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductContext'
import { STORE_BRANCHES } from './Contact'

export default function Storefront() {
  const [signInOpen, setSignInOpen] = useState(false)
  const { t, lang } = useLang()
  const { toast } = useCart()
  const { products } = useProducts()
  const navigate = useNavigate()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [favsOpen, setFavsOpen] = useState(false)
  const [activeCat, setActiveCat] = useState('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    let list = products
    if (activeCat !== 'all') list = list.filter((p) => p.cat === activeCat)
    if (query.trim()) list = list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    return list
  }, [products, activeCat, query])

  const isFiltering = query.trim().length > 0 || activeCat !== 'all'
  const deals = products.filter((p) => p.old && p.old > p.price).slice(0, 5)
  const popular = products.slice(0, 10)
  const newArrivals = products.filter((p) => p.isNew).slice(0, 5)

  const testimonials = [
    {
      name: "Dilnoza Yusupova",
      city: "Toshkent",
      rating: 5,
      comment: "Buyurtma berganimdan so'ng 3 soat ichida kuryer yetkazib berdi! Telegram bot orqali bildirishnoma kelgani juda qulay bo'ldi. Sifat a'lo darajada!",
    },
    {
      name: "Javlon Karimov",
      city: "Samarqand",
      rating: 5,
      comment: "Promokod orqali 15% chegirma oldim va to'lovni Payme orqali bir zumda qildim. Sayt dizayni juda chiroyli va qulay ishlangan.",
    },
    {
      name: "Madina Tosheva",
      city: "Buxoro",
      rating: 5,
      comment: "Do'konga borib o'tirmasdan kerakli narsalarni bir joydan topdim. Mahsulot rasmda qanday bo'lsa aynan shunday keldi.",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-[#16130F]">
      <Header
        onOpenCart={() => setDrawerOpen(true)}
        onOpenFavs={() => setFavsOpen(true)}
        onOpenSignIn={() => setSignInOpen(true)}
        query={query}
        setQuery={setQuery}
      />

      <CategoryNav activeCat={activeCat} setActiveCat={setActiveCat} />

      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6">
        {!isFiltering && <Hero />}

        {isFiltering ? (
          <section className="py-10">
            <div className="flex items-baseline justify-between mb-5 flex-wrap gap-2">
              <h2 className="font-display text-[25px] font-semibold m-0 text-ink dark:text-[#F3EFE7]">
                {t.popular} ({filtered.length})
              </h2>
              <button
                onClick={() => {
                  setActiveCat('all')
                  setQuery('')
                }}
                className="text-xs font-bold text-bad hover:underline"
              >
                {t.resetFilters}
              </button>
            </div>
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-ink-faint">
                {t.noResults}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            {/* Deals Section */}
            {deals.length > 0 && (
              <section className="py-10">
                <div className="flex items-baseline justify-between mb-5 flex-wrap gap-2">
                  <h2 className="font-display text-[25px] font-semibold m-0 flex items-center gap-2.5 text-ink dark:text-[#F3EFE7]">
                    {t.dealsTitle}
                    <span className="font-body text-[11px] font-extrabold tracking-[0.06em] uppercase bg-accent-soft dark:bg-[#3A2418] text-accent px-2.5 py-1 rounded-full">
                      {t.dealsTag}
                    </span>
                  </h2>
                  <Link
                    to="/catalog?discount=true"
                    className="text-[13.5px] font-bold text-brand flex items-center gap-1 hover:underline"
                  >
                    {t.seeAll} <ChevronRight size={14} />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {deals.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            )}

            <MiniBanners />

            {/* Popular Products */}
            <section className="py-10">
              <div className="flex items-baseline justify-between mb-5 flex-wrap gap-2">
                <h2 className="font-display text-[25px] font-semibold m-0 text-ink dark:text-[#F3EFE7]">
                  {t.popular}
                </h2>
                <Link
                  to="/catalog"
                  className="text-[13.5px] font-bold text-brand flex items-center gap-1 hover:underline"
                >
                  {t.seeAll} <ChevronRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {popular.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>

            {/* Interactive Store Map Preview Banner (Req 17) */}
            <section className="py-8">
              <div className="bg-gradient-to-r from-surface-elevated to-surface-sunken dark:from-[#211C17] dark:to-[#0F0D0A] border border-line dark:border-[#332C23] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-card">
                <div className="space-y-2 max-w-lg">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-soft dark:bg-[#2A2140] text-brand-dark dark:text-[#C9B8FF] text-xs font-bold">
                    <MapPin size={13} />
                    <span>4 ta Rasmiy Filialimiz</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-ink dark:text-[#F3EFE7]">
                    Do'konlarimiz xaritada va sizga yaqin manzilda
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                    Toshkent va Samarqand shaharlaridagi zamonaviy do'konlarimizga tashrif buyuring yoki onlayn buyurtma bering. Google va Yandex xaritalar orqali marshrut oling!
                  </p>
                </div>
                <Link
                  to="/contact"
                  className="px-6 py-3.5 rounded-xl bg-brand text-white font-bold text-xs sm:text-sm hover:brightness-110 transition-all flex items-center gap-2 whitespace-nowrap shadow-md"
                >
                  <span>Xaritani ko'rish</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </section>

            {/* Testimonials */}
            <section className="py-10">
              <div className="text-center max-w-xl mx-auto mb-8">
                <span className="text-xs font-bold text-brand uppercase tracking-wider">
                  Mijozlarimiz fikri
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink dark:text-[#F3EFE7] mt-1">
                  120 000+ Mamnun Xaridorlar
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((test, i) => (
                  <div
                    key={i}
                    className="bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl p-6 shadow-card flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1 text-[#F2A93B] mb-3">
                        {[...Array(test.rating)].map((_, idx) => (
                          <Star key={idx} size={14} fill="currentColor" />
                        ))}
                      </div>
                      <p className="text-xs text-ink-soft leading-relaxed mb-4 italic">
                        "{test.comment}"
                      </p>
                    </div>
                    <div className="pt-3 border-t border-line dark:border-[#332C23] flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand text-white font-bold flex items-center justify-center text-xs">
                        {test.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-ink dark:text-[#F3EFE7]">
                          {test.name}
                        </div>
                        <div className="text-[11px] text-ink-faint">{test.city}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
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