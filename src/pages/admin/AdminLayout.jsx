import { useState } from 'react'
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AdminTopbar from '../../components/admin/AdminTopbar'
import { useLang } from '../../context/LangContext'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const { t } = useLang()
  const { isAdmin, user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const titles = {
    '/admin': t.admOverview,
    '/admin/products': t.admProductsTitle,
    '/admin/orders': t.admOrdersTitle,
    '/admin/customers': t.admCustomersTitle,
    '/admin/categories': t.admCategoriesTitle,
    '/admin/reviews': t.admReviewsTitle,
    '/admin/promos': t.admPromosTitle,
    '/admin/settings': t.admSettingsTitle,
  }

  // Protection: ONLY otabek1789@gmail.com can view Admin Panel
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-surface dark:bg-[#16130F] text-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-bad-soft text-bad flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={32} />
          </div>
          <h2 className="font-display text-2xl font-bold mb-2 text-ink dark:text-[#F3EFE7]">
            Admin panelga kirish cheklangan
          </h2>
          <p className="text-xs text-ink-soft mb-6 leading-relaxed">
            Admin panel faqatgina <b>otabek1789@gmail.com</b> hisobi orqali kirilgandagina ko'rinadi va ishlaydi.
            {user && (
              <span className="block mt-2 text-ink-faint">
                Hozirgi hisobingiz: <b>{user.email}</b> (Mijoz)
              </span>
            )}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-3 rounded-xl bg-brand text-white text-xs font-bold hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
            >
              <ArrowLeft size={14} />
              <span>Bosh sahifaga qaytish</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-surface dark:bg-[#16130F]">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/45 z-[75] lg:hidden"
        />
      )}
      <div className="flex-1 min-w-0">
        <AdminTopbar title={titles[location.pathname] || t.admOverview} onMenuClick={() => setMobileOpen(true)} />
        <div className="px-5 lg:px-[30px] pt-6 pb-16">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
