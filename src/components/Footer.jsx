import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Phone, Mail, Send, Heart, ShoppingBag } from 'lucide-react'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'

export default function Footer() {
  const { t } = useLang()
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  return (
    <footer className="bg-surface-sunken dark:bg-[#0F0D0A] border-t border-line dark:border-[#332C23] mt-16 pt-12 pb-8 text-ink dark:text-[#F3EFE7]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-[22px] mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand to-brand-light flex items-center justify-center text-white font-body font-extrabold text-[15px] shadow-sm">
                {t.brand.charAt(0)}
              </div>
              <span>{t.brand}</span>
            </Link>
            <p className="text-xs text-ink-soft leading-relaxed max-w-sm mb-4">
              {t.footAboutD}
            </p>
            <div className="space-y-1.5 text-xs text-ink-soft">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-brand flex-shrink-0" />
                <span>Toshkent shahar, Amir Temur 15</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-brand flex-shrink-0" />
                <span>+998 71 200 00 00</span>
              </div>
            </div>
          </div>

          {/* Nav Links: 5 Landing Pages */}
          <div>
            <h4 className="text-[11.5px] uppercase tracking-wider text-ink-faint mb-3.5 font-extrabold">
              {t.footCompany}
            </h4>
            <ul className="m-0 p-0 list-none space-y-2 text-xs">
              <li>
                <Link to="/" className="text-ink-soft hover:text-brand transition-colors">
                  {t.navHome}
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-ink-soft hover:text-brand transition-colors">
                  {t.navCatalog}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-ink-soft hover:text-brand transition-colors">
                  {t.navAbout}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-ink-soft hover:text-brand transition-colors">
                  {t.navContact}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-ink-soft hover:text-brand transition-colors">
                  {t.navFaq}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Help */}
          <div>
            <h4 className="text-[11.5px] uppercase tracking-wider text-ink-faint mb-3.5 font-extrabold">
              {t.footHelp}
            </h4>
            <ul className="m-0 p-0 list-none space-y-2 text-xs">
              <li>
                <Link to="/faq" className="text-ink-soft hover:text-brand transition-colors">
                  Yetkazib berish shartlari
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-ink-soft hover:text-brand transition-colors">
                  To'lov usullari (Payme, Click)
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-ink-soft hover:text-brand transition-colors">
                  Qaytarish va kafolat
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-ink-soft hover:text-brand transition-colors">
                  {t.favorites}
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-ink-soft hover:text-brand transition-colors">
                  {t.cart} va Promokodlar
                </Link>
              </li>
            </ul>
          </div>

          {/* Partners & Admin */}
          <div>
            <h4 className="text-[11.5px] uppercase tracking-wider text-ink-faint mb-3.5 font-extrabold">
              {t.footSeller}
            </h4>
            <ul className="m-0 p-0 list-none space-y-2 text-xs">
              <li>
                <Link to="/contact" className="text-ink-soft hover:text-brand transition-colors">
                  Hamkorlik va takliflar
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-ink-soft hover:text-brand transition-colors">
                  Telegram Bot xabarlari
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-soft dark:bg-[#2A2140] text-brand-dark dark:text-[#C9B8FF] font-bold hover:brightness-110 transition-all mt-1"
                  >
                    ⚙️ {t.admin}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-line dark:border-[#332C23] flex justify-between items-center flex-wrap gap-3 text-xs text-ink-faint">
          <span>© 2026 {t.brand} Marketplace. {t.rights}</span>
          <span>Toshkent, O'zbekiston • Vercel Ready</span>
        </div>
      </div>
    </footer>
  )
}
