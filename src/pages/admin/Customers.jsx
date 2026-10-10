import { useLang } from '../../context/LangContext'
import { CUSTOMERS, formatMoney } from '../../data/products'

const SEG_MAP = {
  vip: ['segVip', 'bg-accent-soft text-accent'],
  regular: ['segRegular', 'bg-surface-sunken text-ink-soft'],
  new: ['segNew', 'bg-good-soft text-good'],
}

export default function Customers() {
  const { t, lang } = useLang()

  return (
    <div className="bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl shadow-card overflow-hidden">
      <div className="px-5.5 py-4.5 border-b border-line dark:border-[#332C23]">
        <h3 className="font-display font-bold text-[16px] m-0 text-ink dark:text-[#F3EFE7]">{t.admCustomersTitle}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13.5px]">
          <thead>
            <tr>
              {[t.admCol_name, t.admCol_email, t.admCol_orders, t.admCol_spent, t.admCol_joined, t.admCol_segment].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-5.5 py-2.5 text-[11px] uppercase tracking-[0.06em] text-ink-faint font-extrabold border-b border-line dark:border-[#332C23] whitespace-nowrap"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {CUSTOMERS.map((c) => {
              const [labelKey, cls] = SEG_MAP[c.seg]
              const initials = c.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)
              return (
                <tr key={c.name} className="hover:bg-surface-sunken dark:hover:bg-[#0F0D0A] transition-colors">
                  <td className="px-5.5 py-3.5 border-b border-line dark:border-[#332C23]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-[34px] h-[34px] rounded-full bg-brand-soft dark:bg-[#2A2140] text-brand-dark dark:text-white flex items-center justify-center font-extrabold text-[13px] flex-shrink-0">
                        {initials}
                      </div>
                      <span className="font-semibold text-ink dark:text-[#F3EFE7]">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5.5 py-3.5 border-b border-line dark:border-[#332C23] text-ink-soft">
                    {c.email}
                  </td>
                  <td className="px-5.5 py-3.5 border-b border-line dark:border-[#332C23] text-ink dark:text-[#F3EFE7]">
                    {c.orders}
                  </td>
                  <td className="px-5.5 py-3.5 border-b border-line dark:border-[#332C23] font-bold text-ink dark:text-[#F3EFE7]">
                    {formatMoney(c.spent, lang)}
                  </td>
                  <td className="px-5.5 py-3.5 border-b border-line dark:border-[#332C23] text-ink-faint">
                    {c.joined}
                  </td>
                  <td className="px-5.5 py-3.5 border-b border-line dark:border-[#332C23]">
                    <span className={`inline-flex items-center text-[11.5px] font-bold px-2.5 py-1 rounded-full ${cls}`}>
                      {t[labelKey]}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
