import { Heart, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ProductArt from './ProductArt'
import { useLang } from '../context/LangContext'
import { useCart } from '../context/CartContext'
import { formatMoney } from '../data/products'

export default function ProductCard({ product }) {
  const { t, lang } = useLang()
  const { cart, addToCart, favs, toggleFav } = useCart()
  const navigate = useNavigate()

  const inCart = cart.some((i) => i.id === product.id)
  const isFav = favs.includes(product.id)
  const discountPct = product.old ? Math.round((1 - product.price / product.old) * 100) : null

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-[14px] overflow-hidden shadow-card hover:shadow-cardHover hover:-translate-y-1 transition-all duration-200 flex flex-col relative cursor-pointer"
    >
      <div className="aspect-square bg-surface-sunken dark:bg-[#0F0D0A] relative flex items-center justify-center overflow-hidden">
        {discountPct && (
          <span className="absolute top-2.5 left-2.5 bg-accent text-white text-[11px] font-extrabold px-2 py-[3px] rounded-[7px] z-10">
            -{discountPct}%
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleFav(product.id)
          }}
          aria-label="favorite"
          className={`absolute top-2 right-2 w-[30px] h-[30px] rounded-[9px] bg-white/85 dark:bg-[#14110D]/75 backdrop-blur flex items-center justify-center transition-colors z-10 ${
            isFav ? 'text-accent' : 'text-ink-soft'
          }`}
        >
          <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
        </button>
        <ProductArt cat={product.cat} id={product.id} className="w-[62%] h-[62%]" />
      </div>

      <div className="p-3 pt-3 pb-3.5 flex flex-col gap-1.5 flex-1">
        <div className="text-[13.5px] font-semibold leading-[1.35] line-clamp-2 min-h-[36px] text-ink dark:text-[#F3EFE7]">
          {product.name}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-ink-faint">
          <span className="text-[#F2A93B]">
            <Star size={12} fill="currentColor" />
          </span>
          {product.rating} · {product.reviews}
        </div>
        <div className="flex items-baseline gap-1.5 mt-auto">
          <span className="text-base font-extrabold text-ink dark:text-[#F3EFE7]">
            {formatMoney(product.price, lang)}
          </span>
          {product.old && (
            <span className="text-xs text-ink-faint line-through">{formatMoney(product.old, lang)}</span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            addToCart(product, t.addedToast)
          }}
          className={`mt-2 w-full py-2.5 rounded-[9px] border-[1.5px] border-brand font-bold text-[13px] transition-colors ${
            inCart ? 'bg-brand text-white' : 'bg-transparent text-brand hover:bg-brand hover:text-white'
          }`}
        >
          {inCart ? t.inCart : t.addToCart}
        </button>
      </div>
    </div>
  )
}