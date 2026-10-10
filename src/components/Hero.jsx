import { Truck, Shield, RotateCcw, Headset, ChevronRight } from 'lucide-react'
import { useLang } from '../context/LangContext'

export default function Hero() {
  const { t } = useLang()

  const strip = [
    { icon: Truck, title: t.fastDelivery, desc: t.fastDeliveryD },
    { icon: Shield, title: t.securePay, desc: t.securePayD },
    { icon: RotateCcw, title: t.easyReturn, desc: t.easyReturnD },
    { icon: Headset, title: t.support, desc: t.supportD },
  ]

  return (
    <section className="pt-11 pb-2">
      <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-brand-dark via-[#4A2BAE] to-brand dark:from-[#0F0D0A] dark:via-[#2A1466] dark:to-[#4A2BAE] px-7 sm:px-12 py-10 sm:py-12 flex items-center justify-between gap-6 min-h-[230px]">
        <div className="relative z-10 max-w-[520px]">
          <div className="text-[#D7C6FF] text-[12.5px] font-bold tracking-[0.14em] uppercase mb-3.5">
            {t.heroEyebrow}
          </div>
          <h1 className="font-display text-[28px] sm:text-[40px] leading-[1.08] text-white font-bold mb-3.5">
            {t.heroTitle}
          </h1>
          <p className="text-[#E2D6FF] text-[15px] leading-[1.55] mb-6 max-w-[460px]">{t.heroSub}</p>
          <button className="inline-flex items-center gap-2 bg-white text-brand-dark font-bold text-[14.5px] px-[22px] py-[13px] rounded-[11px] hover:-translate-y-0.5 transition-transform">
            {t.heroCta} <ChevronRight size={16} />
          </button>
        </div>
        <svg className="absolute -right-10 -top-10 w-[340px] h-[340px] opacity-50 hidden sm:block" viewBox="0 0 340 340">
          <circle cx="170" cy="170" r="150" fill="rgba(255,255,255,0.08)" />
          <circle cx="170" cy="170" r="100" fill="rgba(255,255,255,0.08)" />
        </svg>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
        {strip.map((item) => (
          <div
            key={item.title}
            className="bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-[14px] px-4.5 py-4 flex items-center gap-3"
          >
            <div className="w-[38px] h-[38px] rounded-[10px] bg-brand-soft dark:bg-[#2A2140] text-brand dark:text-[#9B7BFF] flex items-center justify-center flex-shrink-0">
              <item.icon size={18} />
            </div>
            <div>
              <div className="text-[13px] font-bold text-ink dark:text-[#F3EFE7]">{item.title}</div>
              <div className="text-[11.5px] text-ink-faint">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
