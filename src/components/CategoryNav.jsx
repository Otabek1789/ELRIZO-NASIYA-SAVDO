import { useLang } from '../context/LangContext'
import { CATS } from '../data/products'
import { CAT_KEY } from '../data/translations'

export default function CategoryNav({ activeCat, setActiveCat }) {
  const { t } = useLang()

  return (
    <div className="border-b border-line dark:border-[#332C23] bg-surface dark:bg-[#16130F]">
      <div className="max-w-[1240px] mx-auto flex justify-center gap-1 px-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveCat('all')}
          className={`whitespace-nowrap px-3.5 py-[11px] text-[13.5px] font-semibold border-b-[2.5px] transition-colors ${
            activeCat === 'all'
              ? 'text-brand border-brand'
              : 'text-ink-soft border-transparent hover:text-ink dark:hover:text-white'
          }`}
        >
          {t.catAll}
        </button>
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCat(c)}
            className={`whitespace-nowrap px-3.5 py-[11px] text-[13.5px] font-semibold border-b-[2.5px] transition-colors ${
              activeCat === c
                ? 'text-brand border-brand'
                : 'text-ink-soft border-transparent hover:text-ink dark:hover:text-white'
            }`}
          >
            {t[CAT_KEY[c]]}
          </button>
        ))}
      </div>
    </div>
  )
}
