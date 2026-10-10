import { Plus, Percent } from 'lucide-react'
import { useLang } from "../../context/LangContext";

export default function Promos() {
  const { t, lang } = useLang()

  const promos = [
    {
      name: 'AUTUMN25',
      desc: lang === 'uz' ? "Barcha elektronikaga 25% chegirma" : lang === 'ru' ? 'Скидка 25% на всю электронику' : '25% off all electronics',
      active: true,
      uses: 342,
    },
    {
      name: 'NEWUSER10',
      desc: lang === 'uz' ? "Yangi mijozlar uchun 10% chegirma" : lang === 'ru' ? '10% для новых клиентов' : '10% off for new customers',
      active: true,
      uses: 1204,
    },
    {
      name: 'FREESHIP',
      desc: lang === 'uz' ? 'Bepul yetkazib berish' : lang === 'ru' ? 'Бесплатная доставка' : 'Free delivery',
      active: false,
      uses: 87,
    },
  ]

  return (
    <div className="bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl shadow-card overflow-hidden">
      <div className="px-5.5 py-4.5 border-b border-line dark:border-[#332C23] flex items-center justify-between gap-3 flex-wrap">
        <h3 className="font-display font-bold text-[16px] m-0 text-ink dark:text-[#F3EFE7]">{t.admPromosTitle}</h3>
        <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-[12.5px] font-bold bg-brand text-white hover:brightness-110 transition-all">
          <Plus size={14} /> {t.admAddPromo}
        </button>
      </div>
      <div className="px-5.5 pb-4.5">
        {promos.map((p, i) => (
          <div
            key={i}
            className={`flex items-center gap-3.5 py-3.5 ${i < promos.length - 1 ? 'border-b border-line dark:border-[#332C23]' : ''}`}
          >
            <div className="w-[38px] h-[38px] rounded-[10px] bg-accent-soft dark:bg-[#3A2418] text-accent flex items-center justify-center flex-shrink-0">
              <Percent size={17} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-extrabold tracking-[0.02em] text-ink dark:text-[#F3EFE7]">{p.name}</div>
              <div className="text-[12.5px] text-ink-faint">
                {p.desc} · {p.uses} {t.uses}
              </div>
            </div>
            <span
              className={`inline-flex items-center text-[11.5px] font-bold px-2.5 py-1 rounded-full ${
                p.active ? 'bg-good-soft text-good' : 'bg-surface-sunken text-ink-soft'
              }`}
            >
              {p.active ? t.active : t.inactive}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
