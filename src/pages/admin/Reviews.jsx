import { Star } from 'lucide-react'
import { useLang } from '../../context/LangContext'
import { REVIEWS } from '../../data/products'

export default function Reviews() {
  const { t } = useLang()

  return (
    <div className="bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl shadow-card overflow-hidden">
      <div className="px-5.5 py-4.5 border-b border-line dark:border-[#332C23]">
        <h3 className="font-display font-bold text-[16px] m-0 text-ink dark:text-[#F3EFE7]">{t.admReviewsTitle}</h3>
      </div>
      <div className="px-5.5 pb-4.5">
        {REVIEWS.map((r, i) => (
          <div
            key={i}
            className={`py-4 ${i < REVIEWS.length - 1 ? 'border-b border-line dark:border-[#332C23]' : ''}`}
          >
            <div className="flex justify-between items-start gap-2.5 flex-wrap">
              <div>
                <div className="font-bold text-[13.5px] text-ink dark:text-[#F3EFE7]">
                  {r.name} <span className="text-ink-faint font-medium">· {r.product}</span>
                </div>
                <div className="flex gap-0.5 my-1 text-[#F2A93B]">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} size={13} fill={idx < r.rating ? 'currentColor' : 'none'} opacity={idx < r.rating ? 1 : 0.3} />
                  ))}
                </div>
              </div>
              <span className="text-xs text-ink-faint">{r.date}</span>
            </div>
            <p className="text-[13.5px] text-ink-soft my-1.5 mb-2.5 leading-[1.5]">{r.text}</p>
            {r.replied ? (
              <span className="inline-flex items-center text-[11.5px] font-bold px-2.5 py-1 rounded-full bg-good-soft text-good">
                ✓ {t.admReply}
              </span>
            ) : (
              <button className="px-3 py-1.5 rounded-[9px] text-[12.5px] font-bold border-[1.5px] border-line dark:border-[#332C23] text-ink dark:text-[#F3EFE7] hover:border-brand hover:text-brand transition-colors">
                {t.admReply}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
