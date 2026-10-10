import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutGrid, Box, ListOrdered, Users, Tag, MessageSquare, Percent, Settings, LogOut } from 'lucide-react'
import { useLang } from '../../context/LangContext'

export default function AdminSidebar({ mobileOpen, setMobileOpen }) {
  const { t } = useLang()
  const navigate = useNavigate()

  const nav = [
    { to: '/admin', end: true, label: t.admDash, icon: LayoutGrid },
    { to: '/admin/products', label: t.admProducts, icon: Box },
    { to: '/admin/orders', label: t.admOrders, icon: ListOrdered },
    { to: '/admin/customers', label: t.admCustomers, icon: Users },
    { to: '/admin/categories', label: t.admCategories, icon: Tag },
    { to: '/admin/reviews', label: t.admReviews, icon: MessageSquare },
    { to: '/admin/promos', label: t.admPromos, icon: Percent },
    { to: '/admin/settings', label: t.admSettings, icon: Settings },
  ]

  const itemClass = ({ isActive }) =>
    `flex items-center gap-[11px] px-3 py-2.5 rounded-[10px] text-[13.5px] font-semibold mb-0.5 transition-colors ${
      isActive
        ? 'bg-brand-soft dark:bg-[#2A2140] text-brand-dark dark:text-white'
        : 'text-ink-soft hover:bg-surface-sunken dark:hover:bg-[#0F0D0A] hover:text-ink dark:hover:text-[#F3EFE7]'
    }`

  return (
    <aside
      className={`w-[248px] flex-shrink-0 bg-surface-elevated dark:bg-[#211C17] border-r border-line dark:border-[#332C23] flex flex-col fixed lg:sticky top-0 h-screen z-[80] transition-transform duration-200 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="px-5 py-[22px] flex items-center gap-2.5 border-b border-line dark:border-[#332C23]">
        <div className="w-[30px] h-[30px] rounded-[9px] bg-gradient-to-br from-brand to-brand-light flex items-center justify-center text-white font-extrabold text-[15px]">
          E
        </div>
        <div>
          <div className="font-display font-bold text-[16px] text-ink dark:text-[#F3EFE7]">Elrizo</div>
          <div className="text-[10.5px] text-ink-faint font-extrabold tracking-[0.05em]">ADMIN</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-3.5 overflow-y-auto">
        <div className="text-[10.5px] uppercase tracking-[0.09em] text-ink-faint font-extrabold px-2.5 pt-3.5 pb-2">
          {t.admOverview}
        </div>
        {nav.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} className={itemClass} onClick={() => setMobileOpen(false)}>
            <n.icon size={17} /> {n.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-3.5 border-t border-line dark:border-[#332C23]">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-[11px] px-3 py-2.5 rounded-[10px] text-[13.5px] font-semibold text-ink-soft hover:bg-surface-sunken dark:hover:bg-[#0F0D0A] hover:text-ink dark:hover:text-[#F3EFE7] cursor-pointer transition-colors"
        >
          <LogOut size={17} /> {t.admGoBack}
        </div>
      </div>
    </aside>
  )
}
