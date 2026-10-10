import { Plus, Edit2, Trash2 } from 'lucide-react'
import ProductArt from '../../components/ProductArt'
import { useLang } from '../../context/LangContext'
import { ALL_PRODUCTS, CATS } from '../../data/products'
import { CAT_KEY } from '../../data/translations'

export default function Categories() {
  const { t } = useLang()
  const counts = {}
  ALL_PRODUCTS.forEach((p) => (counts[p.cat] = (counts[p.cat] || 0) + 1))

  return (
    <div className="bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl shadow-card overflow-hidden">
      <div className="px-5.5 py-4.5 border-b border-line dark:border-[#332C23] flex items-center justify-between gap-3 flex-wrap">
        <h3 className="font-display font-bold text-[16px] m-0 text-ink dark:text-[#F3EFE7]">{t.admCategoriesTitle}</h3>
        <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-[12.5px] font-bold bg-brand text-white hover:brightness-110 transition-all">
          <Plus size={14} /> {t.admAddCategory}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13.5px]">
          <thead>
            <tr>
              {[t.admCol_catName, t.admCol_products, t.admActions].map((h) => (
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
            {CATS.map((c) => (
              <tr key={c} className="hover:bg-surface-sunken dark:hover:bg-[#0F0D0A] transition-colors">
                <td className="px-5.5 py-3.5 border-b border-line dark:border-[#332C23]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-[38px] h-[38px] rounded-lg bg-surface-sunken dark:bg-[#0F0D0A] flex items-center justify-center flex-shrink-0">
                      <ProductArt cat={c} className="w-3/5 h-3/5" />
                    </div>
                    <span className="font-semibold text-ink dark:text-[#F3EFE7]">{t[CAT_KEY[c]]}</span>
                  </div>
                </td>
                <td className="px-5.5 py-3.5 border-b border-line dark:border-[#332C23] text-ink dark:text-[#F3EFE7]">
                  {counts[c]}
                </td>
                <td className="px-5.5 py-3.5 border-b border-line dark:border-[#332C23]">
                  <div className="flex gap-1.5">
                    <button className="w-[30px] h-[30px] rounded-lg border border-line dark:border-[#332C23] flex items-center justify-center text-ink-soft hover:border-brand hover:text-brand transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button className="w-[30px] h-[30px] rounded-lg border border-line dark:border-[#332C23] flex items-center justify-center text-ink-soft hover:border-bad hover:text-bad transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
