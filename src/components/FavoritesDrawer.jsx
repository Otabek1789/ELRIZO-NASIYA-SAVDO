import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ProductArt from './ProductArt'
import { useLang } from '../context/LangContext'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductContext'
import { formatMoney } from '../data/products'

export default function FavoritesDrawer({ open, onClose }) {
  const { t, lang } = useLang()
  const { favs, toggleFav, clearFavs, addToCart } = useCart()
  const { products } = useProducts()
  const navigate = useNavigate()

  const favProducts = products.filter((p) => favs.includes(p.id))

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-200 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      <div
        className={`fixed top-0 right-0 h-full w-[420px] max-w-[94vw] bg-surface-elevated dark:bg-[#211C17] z-[51] flex flex-col shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="px-5 pt-5 pb-4 border-b border-line dark:border-[#332C23] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-[19px] font-bold m-0 text-ink dark:text-[#F3EFE7]">
              {t.favorites}
            </h3>
            {favs.length > 0 && (
              <span className="bg-accent-soft dark:bg-[#3A2418] text-accent text-xs font-bold px-2 py-0.5 rounded-full">
                {favs.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {favs.length > 0 && (
              <button
                onClick={clearFavs}
                className="text-ink-faint hover:text-bad text-xs flex items-center gap-1 transition-colors mr-2"
              >
                <Trash2 size={13} />
                <span>{t.clearFavs}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl border border-line dark:border-[#332C23] flex items-center justify-center text-ink-soft hover:bg-surface-sunken dark:hover:bg-[#0F0D0A] transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-line dark:divide-[#332C23]">
          {favProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 px-5 text-ink-faint gap-3">
              <div className="w-16 h-16 rounded-2xl bg-surface-sunken dark:bg-[#0F0D0A] flex items-center justify-center text-ink-faint">
                <Heart size={32} />
              </div>
              <div className="font-bold text-base text-ink dark:text-[#F3EFE7]">
                {t.favEmpty}
              </div>
              <div className="text-xs max-w-[240px]">{t.favEmptyD}</div>
              <button
                onClick={() => {
                  onClose()
                  navigate('/catalog')
                }}
                className="mt-3 px-4 py-2.5 rounded-xl bg-brand text-white text-xs font-bold hover:brightness-110 transition-all"
              >
                {t.continueShopping}
              </button>
            </div>
          ) : (
            favProducts.map((p) => (
              <div key={p.id} className="flex gap-3 py-3.5 items-center">
                <div
                  onClick={() => {
                    onClose()
                    navigate(`/product/${p.id}`)
                  }}
                  className="w-[62px] h-[62px] rounded-xl bg-surface-sunken dark:bg-[#0F0D0A] flex-shrink-0 flex items-center justify-center cursor-pointer overflow-hidden"
                >
                  <ProductArt cat={p.cat} id={p.id} className="w-3/5 h-3/5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    onClick={() => {
                      onClose()
                      navigate(`/product/${p.id}`)
                    }}
                    className="text-xs font-semibold leading-[1.3] mb-1 line-clamp-2 text-ink dark:text-[#F3EFE7] hover:text-brand cursor-pointer"
                  >
                    {p.name}
                  </div>
                  <div className="text-xs font-extrabold text-brand mb-2">
                    {formatMoney(p.price, lang)}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addToCart(p, t.addedToast)}
                      className="px-2.5 py-1 rounded-lg bg-brand text-white text-[11px] font-bold flex items-center gap-1 hover:brightness-110 transition-all"
                    >
                      <ShoppingBag size={12} /> {t.addToCart}
                    </button>
                    <button
                      onClick={() => toggleFav(p.id, t.favAdded, t.favRemoved)}
                      className="text-ink-faint hover:text-bad text-[11px] underline transition-colors"
                    >
                      {t.remove}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {favProducts.length > 0 && (
          <div className="p-4 border-t border-line dark:border-[#332C23]">
            <button
              onClick={() => {
                onClose()
                navigate('/favorites')
              }}
              className="w-full py-2.5 rounded-xl border border-line dark:border-[#332C23] text-ink dark:text-[#F3EFE7] hover:border-brand font-bold text-xs transition-colors"
            >
              {t.seeAll} ({favProducts.length}) →
            </button>
          </div>
        )}
      </div>
    </>
  )
}