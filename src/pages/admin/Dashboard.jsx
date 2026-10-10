import { Wallet, Box, Users, TrendingUp, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { useOrders } from '../../context/OrderContext'
import { useProducts } from '../../context/ProductContext'
import { formatMoney } from '../../data/products'

const STATUS_MAP = {
  delivered: ['stDelivered', 'bg-good-soft text-good'],
  processing: ['stProcessing', 'bg-accent-soft text-accent'],
  shipped: ['stShipped', 'bg-brand-soft dark:bg-[#2A2140] text-brand-dark dark:text-[#C9B8FF]'],
  cancelled: ['stCancelled', 'bg-bad-soft text-bad'],
  pending: ['stPending', 'bg-accent-soft text-accent'],
}

export default function Dashboard() {
  const { t, lang } = useLang()
  const { orders } = useOrders()
  const { products } = useProducts()

  const totalRevenue = orders.reduce((s, o) => s + (o.amount || 0), 0)
  const aov = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0

  const kpis = [
    {
      label: t.admRevenue,
      value: formatMoney(totalRevenue, lang),
      delta: '+14.2%',
      up: true,
      icon: Wallet,
      color: '#6C3EF4',
    },
    {
      label: t.admOrdersK,
      value: orders.length.toString(),
      delta: '+8.4%',
      up: true,
      icon: Box,
      color: '#1E8E5A',
    },
    {
      label: 'Mahsulotlar soni',
      value: products.length.toString(),
      delta: '+5.0%',
      up: true,
      icon: Users,
      color: '#E8622C',
    },
    {
      label: t.admAOV,
      value: formatMoney(aov, lang),
      delta: '+2.1%',
      up: true,
      icon: TrendingUp,
      color: '#D33C3C',
    },
  ]

  const weekData = [42, 58, 49, 71, 66, 84, 93]
  const days =
    lang === 'uz'
      ? ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sh', 'Ya']
      : lang === 'ru'
      ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
      : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
  const maxV = Math.max(...weekData)

  const catSplit = [
    { name: t.catElectronics, pct: 32, color: '#6C3EF4' },
    { name: t.catFashion, pct: 24, color: '#E8622C' },
    { name: t.catHome, pct: 18, color: '#1E8E5A' },
    { name: t.catBeauty, pct: 14, color: '#D33C3C' },
    { name: lang === 'uz' ? 'Boshqa' : lang === 'ru' ? 'Другое' : 'Other', pct: 12, color: '#948C7E' },
  ]

  let cumulative = 0
  const gradParts = catSplit
    .map((c) => {
      const start = cumulative
      cumulative += c.pct
      return `${c.color} ${start * 3.6}deg ${cumulative * 3.6}deg`
    })
    .join(', ')

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6.5">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-[14px] p-5 shadow-card"
          >
            <div className="flex items-center justify-between mb-3.5">
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center"
                style={{ background: k.color + '22', color: k.color }}
              >
                <k.icon size={17} />
              </div>
              <span
                className={`text-xs font-bold inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${
                  k.up ? 'text-good bg-good-soft' : 'text-bad bg-bad-soft'
                }`}
              >
                {k.delta}
              </span>
            </div>
            <div className="text-[12.5px] text-ink-faint font-semibold">{k.label}</div>
            <div className="font-display text-[25px] font-semibold my-0.5 text-ink dark:text-[#F3EFE7] truncate">
              {k.value}
            </div>
            <div className="text-[11.5px] text-ink-faint">{t.admVsLast}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4.5 mb-5 items-start">
        <div className="bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl shadow-card overflow-hidden">
          <div className="px-5.5 py-4.5 border-b border-line dark:border-[#332C23]">
            <h3 className="font-display font-bold text-[16px] m-0 text-ink dark:text-[#F3EFE7]">
              {t.admSalesChart}
            </h3>
          </div>
          <div className="px-5.5 py-4.5">
            <div className="flex items-end gap-2.5 h-[190px] pt-2.5">
              {weekData.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div
                    className="w-full rounded-t-[6px] rounded-b-[3px] bg-gradient-to-b from-brand to-brand-dark min-h-[4px]"
                    style={{ height: `${(v / maxV) * 100}%` }}
                    title={v}
                  />
                  <div className="text-[10.5px] text-ink-faint font-bold">{days[i]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl shadow-card overflow-hidden">
          <div className="px-5.5 py-4.5 border-b border-line dark:border-[#332C23]">
            <h3 className="font-display font-bold text-[16px] m-0 text-ink dark:text-[#F3EFE7]">
              {t.admCatSplit}
            </h3>
          </div>
          <div className="flex items-center gap-5 flex-wrap justify-center p-4">
            <div
              className="w-[130px] h-[130px] rounded-full flex-shrink-0 relative"
              style={{ background: `conic-gradient(${gradParts})` }}
            >
              <div className="absolute inset-[18px] rounded-full bg-surface-elevated dark:bg-[#211C17]" />
            </div>
            <div>
              {catSplit.map((c) => (
                <div key={c.name} className="flex items-center gap-2 text-[12.5px] mb-2">
                  <span className="w-[9px] h-[9px] rounded-[3px] flex-shrink-0" style={{ background: c.color }} />
                  <span className="text-ink-soft">{c.name}</span>
                  <b className="ml-auto text-ink dark:text-[#F3EFE7]">{c.pct}%</b>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl shadow-card overflow-hidden">
        <div className="px-5.5 py-4.5 border-b border-line dark:border-[#332C23] flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-display font-bold text-[16px] m-0 text-ink dark:text-[#F3EFE7]">
            {t.admRecentOrders}
          </h3>
          <Link to="/admin/orders" className="text-[13.5px] font-bold text-brand flex items-center gap-1 hover:underline">
            {t.admViewAll} <ChevronRight size={13} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13.5px]">
            <thead>
              <tr>
                {[t.admOrderId, t.admCustomer, t.admDate, t.admAmount, t.admStatus].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5.5 py-2.5 text-[11px] uppercase tracking-[0.06em] text-ink-faint font-extrabold border-b border-line dark:border-[#332C23] whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 6).map((o) => {
                const [labelKey, cls] = STATUS_MAP[o.status] || STATUS_MAP.pending
                return (
                  <tr key={o.id} className="hover:bg-surface-sunken dark:hover:bg-[#0F0D0A] transition-colors">
                    <td className="px-5.5 py-3.5 border-b border-line dark:border-[#332C23] font-bold text-ink dark:text-[#F3EFE7]">
                      {o.id}
                    </td>
                    <td className="px-5.5 py-3.5 border-b border-line dark:border-[#332C23] text-ink dark:text-[#F3EFE7]">
                      {o.customer}
                    </td>
                    <td className="px-5.5 py-3.5 border-b border-line dark:border-[#332C23] text-ink-faint">
                      {o.date}
                    </td>
                    <td className="px-5.5 py-3.5 border-b border-line dark:border-[#332C23] font-bold text-ink dark:text-[#F3EFE7]">
                      {formatMoney(o.amount, lang)}
                    </td>
                    <td className="px-5.5 py-3.5 border-b border-line dark:border-[#332C23]">
                      <span className={`inline-flex items-center text-[11.5px] font-bold px-2.5 py-1 rounded-full ${cls}`}>
                        {t[labelKey] || o.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
