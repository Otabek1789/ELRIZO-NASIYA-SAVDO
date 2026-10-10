import { useState } from 'react'
import { X, ShoppingCart, Minus, Plus, Tag, ArrowRight, Trash2, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ProductArt from './ProductArt'
import { useLang } from '../context/LangContext'
import { useCart, PROMO_CODES } from '../context/CartContext'
import { formatMoney } from '../data/products'

export default function CartDrawer({ open, onClose }) {
  const { t, lang } = useLang()
  const {
    cart,
    changeQty,
    removeFromCart,
    clearCart,
    cartCount,
    subtotal,
    shippingFee,
    discountAmount,
    cartTotal,
    appliedPromo,
    applyPromo,
    removePromo,
    showToast,
  } = useCart()
  const navigate = useNavigate()

  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState('')

  const handleApplyPromo = (e) => {
    e.preventDefault()
    setPromoError('')
    if (!promoInput.trim()) return

    const res = applyPromo(promoInput)
    if (res.success) {
      showToast(t.promoApplied)
      setPromoInput('')
    } else {
      setPromoError(t.invalidPromo)
    }
  }

  const handleGoToCheckout = () => {
    onClose()
    navigate('/cart')
  }

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-200 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      <div
        className={`fixed top-0 right-0 h-full w-[430px] max-w-[94vw] bg-surface-elevated dark:bg-[#211C17] z-[51] flex flex-col shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="px-5 pt-5 pb-4 border-b border-line dark:border-[#332C23] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-[19px] font-bold m-0 text-ink dark:text-[#F3EFE7]">
              {t.cart}
            </h3>
            {cartCount > 0 && (
              <span className="bg-brand-soft dark:bg-[#2A2140] text-brand-dark dark:text-[#C9B8FF] text-xs font-bold px-2 py-0.5 rounded-full">
                {cartCount} {t.pcs}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                title={t.clearCart}
                className="text-ink-faint hover:text-bad text-xs flex items-center gap-1 transition-colors mr-2"
              >
                <Trash2 size={13} />
                <span>{t.clearCart}</span>
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

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-line dark:divide-[#332C23]">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 px-5 text-ink-faint gap-3">
              <div className="w-16 h-16 rounded-2xl bg-surface-sunken dark:bg-[#0F0D0A] flex items-center justify-center text-ink-faint">
                <ShoppingCart size={32} />
              </div>
              <div className="font-bold text-base text-ink dark:text-[#F3EFE7]">
                {t.cartEmpty}
              </div>
              <div className="text-xs max-w-[240px]">{t.cartEmptyD}</div>
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
            cart.map((item) => (
              <div key={item.id} className="flex gap-3 py-3.5 items-center">
                <div
                  onClick={() => {
                    onClose()
                    navigate(`/product/${item.id}`)
                  }}
                  className="w-[62px] h-[62px] rounded-xl bg-surface-sunken dark:bg-[#0F0D0A] flex-shrink-0 flex items-center justify-center cursor-pointer overflow-hidden"
                >
                  <ProductArt cat={item.cat} id={item.id} className="w-3/5 h-3/5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    onClick={() => {
                      onClose()
                      navigate(`/product/${item.id}`)
                    }}
                    className="text-xs font-semibold leading-[1.3] mb-1 line-clamp-2 text-ink dark:text-[#F3EFE7] hover:text-brand cursor-pointer"
                  >
                    {item.name}
                  </div>
                  <div className="text-xs font-extrabold text-brand mb-1.5">
                    {formatMoney(item.price, lang)}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-line dark:border-[#332C23] rounded-lg overflow-hidden bg-surface dark:bg-[#16130F]">
                      <button
                        onClick={() => changeQty(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-ink hover:bg-surface-sunken dark:hover:bg-[#0F0D0A]"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="text-xs font-bold min-w-[20px] text-center text-ink dark:text-[#F3EFE7]">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => changeQty(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-ink hover:bg-surface-sunken dark:hover:bg-[#0F0D0A]"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id, t.removedToast)}
                      className="text-ink-faint hover:text-bad text-[11px] underline ml-2 transition-colors"
                    >
                      {t.remove}
                    </button>
                  </div>
                </div>
                <div className="font-extrabold text-xs whitespace-nowrap text-ink dark:text-[#F3EFE7] text-right">
                  {formatMoney(item.price * item.qty, lang)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Promo Code & Totals Footer */}
        {cart.length > 0 && (
          <div className="border-t border-line dark:border-[#332C23] px-5 pt-3.5 pb-5 bg-surface dark:bg-[#16130F]">
            {/* Promo Code Input */}
            <div className="mb-3">
              {appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-good-soft/30 border border-good/30 text-good text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={15} />
                    <span>
                      {appliedPromo.code} ({appliedPromo.label})
                    </span>
                  </div>
                  <button
                    onClick={removePromo}
                    className="text-bad hover:underline text-[11px] font-semibold"
                  >
                    {t.remove}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-1.5">
                  <div className="relative flex-1">
                    <Tag size={13} className="absolute left-2.5 top-2.5 text-ink-faint" />
                    <input
                      type="text"
                      placeholder={t.promoPlaceholder}
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value.toUpperCase())
                        setPromoError('')
                      }}
                      className="w-full pl-7 pr-2 py-2 rounded-xl text-xs border border-line dark:border-[#332C23] bg-surface-elevated dark:bg-[#211C17] text-ink dark:text-[#F3EFE7] uppercase outline-none focus:border-brand"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] hover:border-brand text-xs font-bold text-ink dark:text-[#F3EFE7] transition-colors"
                  >
                    {t.applyPromo}
                  </button>
                </form>
              )}
              {promoError && (
                <div className="text-[11px] text-bad mt-1 font-semibold">{promoError}</div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-ink-soft mb-3">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span className="font-semibold text-ink dark:text-[#F3EFE7]">
                  {formatMoney(subtotal, lang)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-good font-semibold">
                  <span>{t.promoDiscount}</span>
                  <span>-{formatMoney(discountAmount, lang)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t.shipping}</span>
                <span className="font-semibold text-ink dark:text-[#F3EFE7]">
                  {shippingFee === 0 ? t.freeShipping : formatMoney(shippingFee, lang)}
                </span>
              </div>
              <div className="border-t border-line dark:border-[#332C23] pt-2 flex justify-between items-baseline text-sm text-ink dark:text-[#F3EFE7]">
                <span className="font-bold">{t.total}</span>
                <span className="text-lg font-black text-brand">
                  {formatMoney(cartTotal, lang)}
                </span>
              </div>
            </div>

            <button
              onClick={handleGoToCheckout}
              className="w-full py-3.5 rounded-xl bg-brand hover:brightness-110 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span>{t.checkout}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  )
}
