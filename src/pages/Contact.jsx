import { useState } from 'react'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Navigation,
  ExternalLink,
  MessageCircle,
  CheckCircle2,
  Building2,
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'
import FavoritesDrawer from '../components/FavoritesDrawer'
import SignInModal from '../components/SignInModal'
import Toast from '../components/Toast'
import { useLang } from '../context/LangContext'
import { useCart } from '../context/CartContext'
import { sendContactTelegramNotification } from '../services/telegram'

export const STORE_BRANCHES = [
  {
    id: 'central',
    name: 'Markaziy filial (Toshkent)',
    city: 'Toshkent sh.',
    address: 'Amir Temur shoh ko\'chasi, 15-uy',
    landmark: 'Oloy bozori yonida, "Amir Temur" metro bekati',
    phone: '+998 71 200 00 00',
    hours: '09:00 – 22:00 (Dam olish kunlarisiz)',
    lat: 41.311081,
    lng: 69.279737,
    googleUrl: 'https://maps.google.com/?q=41.311081,69.279737',
    yandexUrl: 'https://yandex.com/maps/?pt=69.279737,41.311081&z=16&l=map',
    embedUrl:
      'https://www.openstreetmap.org/export/embed.html?bbox=69.265%2C41.300%2C69.295%2C41.320&layer=mapnik&marker=41.311081%2C69.279737',
  },
  {
    id: 'chilonzor',
    name: 'Chilonzor filiali',
    city: 'Toshkent sh.',
    address: 'Bunyodkor shoh ko\'chasi, 42-uy',
    landmark: '"Mirzo Ulug\'bek" metro bekati ro\'parasida',
    phone: '+998 71 200 00 01',
    hours: '09:00 – 21:00 (Har kuni)',
    lat: 41.285816,
    lng: 69.204369,
    googleUrl: 'https://maps.google.com/?q=41.285816,69.204369',
    yandexUrl: 'https://yandex.com/maps/?pt=69.204369,41.285816&z=16&l=map',
    embedUrl:
      'https://www.openstreetmap.org/export/embed.html?bbox=69.190%2C41.275%2C69.220%2C41.295&layer=mapnik&marker=41.285816%2C69.204369',
  },
  {
    id: 'yunusobod',
    name: 'Yunusobod filiali',
    city: 'Toshkent sh.',
    address: 'Ahmad Donish ko\'chasi, 7-uy',
    landmark: 'Megaplanet savdo majmuasi yaqinida',
    phone: '+998 71 200 00 02',
    hours: '09:00 – 22:00 (Har kuni)',
    lat: 41.365448,
    lng: 69.288591,
    googleUrl: 'https://maps.google.com/?q=41.365448,69.288591',
    yandexUrl: 'https://yandex.com/maps/?pt=69.288591,41.365448&z=16&l=map',
    embedUrl:
      'https://www.openstreetmap.org/export/embed.html?bbox=69.275%2C41.355%2C69.300%2C41.375&layer=mapnik&marker=41.365448%2C69.288591',
  },
  {
    id: 'samarkand',
    name: 'Samarqand filiali',
    city: 'Samarqand sh.',
    address: 'Registon ko\'chasi, 28-uy',
    landmark: 'Registon maydoni yaqinida',
    phone: '+998 66 230 00 00',
    hours: '09:00 – 20:00 (Har kuni)',
    lat: 39.654816,
    lng: 66.975815,
    googleUrl: 'https://maps.google.com/?q=39.654816,66.975815',
    yandexUrl: 'https://yandex.com/maps/?pt=66.975815,39.654816&z=16&l=map',
    embedUrl:
      'https://www.openstreetmap.org/export/embed.html?bbox=66.960%2C39.645%2C66.990%2C39.665&layer=mapnik&marker=39.654816%2C66.975815',
  },
]

export default function Contact() {
  const { t } = useLang()
  const { toast, showToast } = useCart()

  const [cartOpen, setCartOpen] = useState(false)
  const [favsOpen, setFavsOpen] = useState(false)
  const [signInOpen, setSignInOpen] = useState(false)
  const [query, setQuery] = useState('')

  // Active Map Branch selection
  const [activeBranch, setActiveBranch] = useState(STORE_BRANCHES[0])

  // Contact Form state
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [subject, setSubject] = useState('Umumiy savol')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sentSuccess, setSentSuccess] = useState(false)

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!name.trim() || !contact.trim() || !message.trim()) {
      showToast("Barcha maydonlarni to'ldiring")
      return
    }

    setSending(true)
    try {
      // Requirement 7: Send message directly to Telegram Bot API
      await sendContactTelegramNotification({
        name,
        contact,
        subject: `${subject} (${activeBranch.name})`,
        message,
      })

      setSentSuccess(true)
      showToast(t.messageSentSuccess)
      setName('')
      setContact('')
      setMessage('')
    } catch (err) {
      console.error(err)
      showToast('Xabar yuborishda xatolik yuz berdi')
    } finally {
      setSending(false)
    }
  }

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
        {/* Header Title */}
        <div className="mb-8">
          <span className="text-xs font-bold text-brand uppercase tracking-wider">
            {t.navContact}
          </span>
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-ink dark:text-[#F3EFE7] mt-1 mb-2">
            {t.storeLocationsTitle}
          </h1>
          <p className="text-sm text-ink-soft max-w-2xl">{t.storeLocationsSub}</p>
        </div>

        {/* Store Locator & Interactive Map (Req 17) */}
        <section className="mb-12 bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-3xl overflow-hidden shadow-card">
          {/* Branch Switcher Tabs */}
          <div className="p-4 border-b border-line dark:border-[#332C23] flex items-center gap-2 overflow-x-auto bg-surface-sunken/40 dark:bg-[#0F0D0A]/40">
            {STORE_BRANCHES.map((b) => (
              <button
                key={b.id}
                onClick={() => setActiveBranch(b)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                  activeBranch.id === b.id
                    ? 'bg-brand text-white shadow-md'
                    : 'bg-surface dark:bg-[#16130F] border border-line dark:border-[#332C23] text-ink-soft hover:text-ink'
                }`}
              >
                <Building2 size={15} />
                <span>{b.name}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Interactive OpenStreetMap Viewer */}
            <div className="lg:col-span-8 min-h-[380px] sm:min-h-[440px] relative bg-surface-sunken dark:bg-[#0F0D0A]">
              <iframe
                title="Store Location Map"
                src={activeBranch.embedUrl}
                className="w-full h-full min-h-[380px] sm:min-h-[440px] border-0"
                loading="lazy"
              />
              <div className="absolute bottom-3 left-3 bg-surface-elevated/90 dark:bg-[#211C17]/90 backdrop-blur px-3 py-1.5 rounded-lg border border-line dark:border-[#332C23] text-[11px] font-semibold text-ink dark:text-[#F3EFE7] shadow-sm flex items-center gap-1.5">
                <MapPin size={13} className="text-accent" />
                <span>
                  {activeBranch.name} • {activeBranch.lat.toFixed(4)}, {activeBranch.lng.toFixed(4)}
                </span>
              </div>
            </div>

            {/* Branch Details Card */}
            <div className="lg:col-span-4 p-6 sm:p-7 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-line dark:border-[#332C23] bg-surface-elevated dark:bg-[#211C17]">
              <div>
                <div className="inline-block px-2.5 py-1 rounded-md bg-brand-soft dark:bg-[#2A2140] text-brand-dark dark:text-[#C9B8FF] text-[11px] font-extrabold uppercase mb-3">
                  {activeBranch.city}
                </div>
                <h3 className="font-display text-xl font-bold text-ink dark:text-[#F3EFE7] mb-4">
                  {activeBranch.name}
                </h3>

                <div className="space-y-3.5 text-xs text-ink dark:text-[#F3EFE7]">
                  <div className="flex items-start gap-2.5">
                    <MapPin size={16} className="text-brand flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">{activeBranch.address}</div>
                      <div className="text-[11px] text-ink-faint mt-0.5">
                        Mo'ljal: {activeBranch.landmark}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Clock size={16} className="text-brand flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">{t.workingHours}</div>
                      <div className="text-[11px] text-ink-soft mt-0.5">
                        {activeBranch.hours}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Phone size={16} className="text-brand flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">{t.contactPhone}</div>
                      <a
                        href={`tel:${activeBranch.phone}`}
                        className="text-[11px] text-brand hover:underline font-semibold mt-0.5 block"
                      >
                        {activeBranch.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MessageCircle size={16} className="text-brand flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">{t.telegramChannel}</div>
                      <a
                        href="https://t.me/elrizo_shop"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-brand hover:underline font-semibold mt-0.5 block"
                      >
                        @elrizo_shop
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Route Links */}
              <div className="mt-6 pt-5 border-t border-line dark:border-[#332C23] space-y-2">
                <a
                  href={activeBranch.googleUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl border border-line dark:border-[#332C23] hover:border-brand bg-surface dark:bg-[#16130F] text-xs font-bold text-ink dark:text-[#F3EFE7] flex items-center justify-center gap-2 transition-colors"
                >
                  <ExternalLink size={14} />
                  <span>{t.openInGoogle}</span>
                </a>
                <a
                  href={activeBranch.yandexUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl border border-line dark:border-[#332C23] hover:border-brand bg-surface dark:bg-[#16130F] text-xs font-bold text-ink dark:text-[#F3EFE7] flex items-center justify-center gap-2 transition-colors"
                >
                  <Navigation size={14} className="text-accent" />
                  <span>{t.openInYandex}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form with Telegram Bot Dispatch (Req 7) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <h2 className="font-display text-2xl font-bold text-ink dark:text-[#F3EFE7]">
              {t.contactUs}
            </h2>
            <p className="text-sm text-ink-soft leading-relaxed">{t.contactUsSub}</p>

            <div className="bg-brand-soft/40 dark:bg-[#2A2140] border border-brand/30 rounded-2xl p-5 text-xs text-brand-dark dark:text-[#C9B8FF] space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-sm">
                <Send size={16} />
                <span>Telegram Bot Integratsiyasi Faol</span>
              </div>
              <p className="leading-relaxed">
                Yuborilgan har bir xabar administrator Telegram guruhiga darhol yetib boradi va 15 daqiqa ichida javob qaytariladi.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-3xl p-6 sm:p-8 shadow-card">
            {sentSuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-good-soft/30 border border-good/30 text-good text-xs font-bold flex items-center gap-2.5">
                <CheckCircle2 size={18} />
                <span>{t.messageSentSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink-soft mb-1.5">
                    {t.yourName} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sardor Aliyev"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-line dark:border-[#332C23] bg-surface dark:bg-[#16130F] text-xs outline-none focus:border-brand text-ink dark:text-[#F3EFE7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-soft mb-1.5">
                    {t.yourContact} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+998 90 123 45 67 yoki @telegram"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-line dark:border-[#332C23] bg-surface dark:bg-[#16130F] text-xs outline-none focus:border-brand text-ink dark:text-[#F3EFE7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-soft mb-1.5">{t.subject}</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-line dark:border-[#332C23] bg-surface dark:bg-[#16130F] text-xs font-semibold outline-none focus:border-brand text-ink dark:text-[#F3EFE7] cursor-pointer"
                >
                  <option>Umumiy savol</option>
                  <option>Mahsulot haqida ma'lumot</option>
                  <option>Yetkazib berish holati</option>
                  <option>Hamkorlik va ulgurji savdo</option>
                  <option>Boshqa taklif yoki shikoyat</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-soft mb-1.5">
                  {t.yourMessage} *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Xabaringizni batafsil yozing..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-line dark:border-[#332C23] bg-surface dark:bg-[#16130F] text-xs outline-none focus:border-brand text-ink dark:text-[#F3EFE7] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3.5 rounded-xl bg-brand hover:brightness-110 active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-70"
              >
                <Send size={15} />
                <span>{sending ? 'Yuborilmoqda...' : t.sendMessage}</span>
              </button>
            </form>
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
