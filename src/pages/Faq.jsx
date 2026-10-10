import { useState } from 'react'
import {
  ChevronDown,
  Truck,
  Package,
  CreditCard,
  RotateCcw,
  ShieldCheck,
  HelpCircle,
  Clock,
  Sparkles,
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'
import FavoritesDrawer from '../components/FavoritesDrawer'
import SignInModal from '../components/SignInModal'
import Toast from '../components/Toast'
import { useLang } from '../context/LangContext'
import { useCart } from '../context/CartContext'

export default function Faq() {
  const { t, lang } = useLang()
  const { toast } = useCart()

  const [cartOpen, setCartOpen] = useState(false)
  const [favsOpen, setFavsOpen] = useState(false)
  const [signInOpen, setSignInOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [openIndex, setOpenIndex] = useState(0)

  const steps = [
    { num: 1, title: t.step1Title, desc: t.step1Desc, icon: Package },
    { num: 2, title: t.step2Title, desc: t.step2Desc, icon: ShieldCheck },
    { num: 3, title: t.step3Title, desc: t.step3Desc, icon: Truck },
    { num: 4, title: t.step4Title, desc: t.step4Desc, icon: CreditCard },
  ]

  const faqs = [
    {
      q: "Yetkazib berish qancha vaqt oladi va narxi qancha?",
      a: "Toshkent shahri bo'ylab yetkazib berish 24 soat ichida eshikkacha amalga oshiriladi. Viloyatlarga yetkazish 1-2 ish kunini tashkil qiladi. 250 000 so'mdan ortiq xaridlarda yetkazib berish mutlaqo bepul! 250 000 so'mdan kam bo'lganda esa atigi 20 000 so'm.",
    },
    {
      q: "Qanday to'lov usullari mavjud?",
      a: "Siz o'zingizga qulay bo'lgan har qanday usulda to'lashingiz mumkin: Click Evolution, Payme, Uzum Pay orqali onlayn, yoki mahsulotni kuryerdan qabul qilib olganda naqd pul va bank kartasi orqali to'lash imkoniyati mavjud.",
    },
    {
      q: "Promokoddan qanday foydalanish mumkin?",
      a: "Savatga mahsulot qo'shgandan so'ng, savat oynasida yoki buyurtmani rasmiylashtirish sahifasida 'Promokod' maydoniga maxsus kodni (masalan: UZBEK2026, SKIDKA10, SUPER20) yozib 'Qo'llash' tugmasini bosing. Chegirma avtomatik hisoblanadi.",
    },
    {
      q: "Mahsulot yoqmasa yoki nuqsonli bo'lsa qaytarsa bo'ladimi?",
      a: "Albatta! O'zbekiston Respublikasi iste'molchilar huquqlarini himoya qilish to'g'risidagi qonuniga asosan, mahsulot o'z holatida saqlangan bo'lsa, 14 kun ichida hech qanday ortiqcha savollarsiz almashtirib berish yoki pulingizni to'liq qaytarib berish kafolatlanadi.",
    },
    {
      q: "Telegram bot orqali buyurtmani qanday kuzatish mumkin?",
      a: "Saytimizda buyurtma rasmiylashtirganingizdan so'ng, buyurtma ma'lumotlari zudlik bilan bizning rasmiy Telegram botimizga yuboriladi va operatorimiz sizga telefon yoki Telegram orqali xabar beradi.",
    },
    {
      q: "Do'konlaringizdan mahsulotni o'zim borib olsam bo'ladimi?",
      a: "Ha, bizning Toshkent va Samarqand shaharlarida 4 ta zamonaviy filialimiz mavjud. Buyurtma berish paytida 'Do'kondan o'zi olib ketish' variantini tanlab, o'zingizga qulay filialdan bepul olib ketishingiz mumkin.",
    },
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

      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-8">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-brand uppercase tracking-wider">
            {t.navFaq}
          </span>
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-ink dark:text-[#F3EFE7] mt-1 mb-3">
            {t.faqTitle}
          </h1>
          <p className="text-sm text-ink-soft">{t.faqSubtitle}</p>
        </div>

        {/* 4 Delivery Process Steps */}
        <section className="mb-14">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-ink dark:text-[#F3EFE7] text-center mb-8">
            {t.deliveryStepsTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((st) => (
              <div
                key={st.num}
                className="bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl p-6 shadow-card relative hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-soft dark:bg-[#2A2140] text-brand flex items-center justify-center mb-4">
                  <st.icon size={22} />
                </div>
                <div className="font-display font-bold text-base text-ink dark:text-[#F3EFE7] mb-2">
                  {st.title}
                </div>
                <p className="text-xs text-ink-soft leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="max-w-3xl mx-auto mb-14">
          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx
              return (
                <div
                  key={idx}
                  className="bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl overflow-hidden shadow-card transition-colors"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-display font-semibold text-sm sm:text-base text-ink dark:text-[#F3EFE7]"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle size={18} className="text-brand flex-shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-ink-soft transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-brand' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-ink-soft leading-relaxed border-t border-line/50 dark:border-[#332C23]/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Payment Systems Badges */}
        <section className="bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-3xl p-8 shadow-card text-center mb-10">
          <h3 className="font-display font-bold text-lg text-ink dark:text-[#F3EFE7] mb-2">
            Xavfsiz va Qulay To'lov Tizimlari
          </h3>
          <p className="text-xs text-ink-soft max-w-md mx-auto mb-6">
            Barcha to'lovlar 100% xavfsiz shifrlangan kanal orqali amalga oshiriladi
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {['Payme', 'Click Evolution', 'Uzum Bank', 'HUMO', 'Uzcard', 'Naqd pul'].map((p) => (
              <div
                key={p}
                className="px-4 py-2.5 rounded-xl border border-line dark:border-[#332C23] bg-surface dark:bg-[#16130F] text-xs font-bold text-ink dark:text-[#F3EFE7] shadow-sm"
              >
                {p}
              </div>
            ))}
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
