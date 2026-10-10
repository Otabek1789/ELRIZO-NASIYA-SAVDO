import { useState } from 'react'
import {
  Users,
  Award,
  Clock,
  ShieldCheck,
  CheckCircle,
  Truck,
  Sparkles,
  ArrowRight,
  HeartHandshake,
  Send,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'
import FavoritesDrawer from '../components/FavoritesDrawer'
import SignInModal from '../components/SignInModal'
import Toast from '../components/Toast'
import { useLang } from '../context/LangContext'
import { useCart } from '../context/CartContext'

export default function About() {
  const { t, lang } = useLang()
  const { toast } = useCart()

  const [cartOpen, setCartOpen] = useState(false)
  const [favsOpen, setFavsOpen] = useState(false)
  const [signInOpen, setSignInOpen] = useState(false)
  const [query, setQuery] = useState('')

  const stats = [
    { value: t.statClients, label: t.statClientsLabel, icon: Users, color: '#6C3EF4' },
    { value: t.statProducts, label: t.statProductsLabel, icon: Award, color: '#E8622C' },
    { value: t.statDelivery, label: t.statDeliveryLabel, icon: Clock, color: '#1E8E5A' },
    { value: t.statRating, label: t.statRatingLabel, icon: ShieldCheck, color: '#D33C3C' },
  ]

  const values = [
    { title: t.valQuality, desc: t.valQualityD, icon: Award },
    { title: t.valSpeed, desc: t.valSpeedD, icon: Truck },
    { title: t.valCustomer, desc: t.valCustomerD, icon: HeartHandshake },
    { title: t.valInnovation, desc: t.valInnovationD, icon: Sparkles },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-[#16130F]">
      <Header
        onOpenCart={() => setCartOpen(true)}
        onOpenFavs={() => setFavsOpen(true)}
        onOpenSignIn={() => setSignInOpen(true)}
        query={query}
        setQuery={setQuery}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-br from-brand-dark via-[#4A2BAE] to-brand text-white text-center px-4 sm:px-6">
          <div className="max-w-[800px] mx-auto relative z-10">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 text-[#E2D6FF] text-xs font-extrabold uppercase tracking-widest mb-4 backdrop-blur">
              {t.brand} Marketplace
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight mb-5">
              {t.aboutHeroTitle}
            </h1>
            <p className="text-base sm:text-lg text-[#EDE6FF] leading-relaxed max-w-2xl mx-auto mb-8">
              {t.aboutHeroSub}
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 bg-white text-brand-dark px-6 py-3 rounded-xl font-bold text-sm hover:brightness-105 transition-all shadow-lg"
              >
                <span>{t.heroExplore}</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all"
              >
                <span>{t.navContact}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Key Statistics */}
        <section className="py-12 px-4 sm:px-6 max-w-[1240px] mx-auto -mt-8 relative z-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl p-6 shadow-card text-center"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: s.color + '15', color: s.color }}
                >
                  <s.icon size={24} />
                </div>
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-ink dark:text-[#F3EFE7] mb-1">
                  {s.value}
                </div>
                <div className="text-xs text-ink-soft font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-12 px-4 sm:px-6 max-w-[1000px] mx-auto">
          <div className="bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-3xl p-8 sm:p-12 shadow-card text-center sm:text-left flex flex-col sm:flex-row items-center gap-8">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-brand to-brand-light flex items-center justify-center text-white flex-shrink-0 shadow-lg">
              <Sparkles size={48} />
            </div>
            <div>
              <span className="text-xs font-bold text-brand uppercase tracking-wider">
                {t.footCompany}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink dark:text-[#F3EFE7] mt-1 mb-3">
                {t.ourMissionTitle}
              </h2>
              <p className="text-sm sm:text-base text-ink-soft leading-relaxed">
                {t.ourMissionText}
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-12 px-4 sm:px-6 max-w-[1240px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink dark:text-[#F3EFE7]">
              {t.valuesTitle}
            </h2>
            <p className="text-xs sm:text-sm text-ink-soft mt-1">
              Har bir xaridingiz xavfsiz va ishonchli bo'lishi biz uchun muhim
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl p-6 shadow-card hover:-translate-y-1 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-soft dark:bg-[#2A2140] text-brand flex items-center justify-center mb-4">
                  <v.icon size={22} />
                </div>
                <h3 className="font-display font-bold text-base text-ink dark:text-[#F3EFE7] mb-2">
                  {v.title}
                </h3>
                <p className="text-xs text-ink-soft leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="py-12 px-4 sm:px-6 max-w-[1240px] mx-auto mb-10">
          <div className="bg-gradient-to-r from-brand to-brand-dark rounded-3xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h3 className="font-display text-2xl font-bold mb-2">
                Hozir xarid qilishni boshlaysizmi?
              </h3>
              <p className="text-sm text-[#EDE6FF] max-w-lg">
                Birinchi xaridingiz uchun <code>UZBEK2026</code> promokodidan foydalanib 15% chegirmaga ega bo'ling!
              </p>
            </div>
            <Link
              to="/catalog"
              className="bg-white text-brand-dark px-6 py-3.5 rounded-xl font-bold text-sm hover:brightness-105 transition-all whitespace-nowrap shadow-md"
            >
              {t.heroCta}
            </Link>
          </div>
        </section>
      </main>

      <Footer />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <FavoritesDrawer open={favsOpen} onClose={() => setFavsOpen(false)} />
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
      <Toast text={toast} />
    </div>
  )
}
