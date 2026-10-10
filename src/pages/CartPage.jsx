import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  Tag,
  ArrowLeft,
  CheckCircle2,
  Truck,
  CreditCard,
  Send,
  Sparkles,
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'
import FavoritesDrawer from '../components/FavoritesDrawer'
import SignInModal from '../components/SignInModal'
import Toast from '../components/Toast'
import ProductArt from '../components/ProductArt'
import { useLang } from '../context/LangContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrderContext'
import { formatMoney } from '../data/products'

export default function CartPage() {
  const { t, lang } = useLang()
  const {
    cart,
    changeQty,
    removeFromCart,
    clearCart,
    subtotal,
    shippingFee,
    discountAmount,
    cartTotal,
    appliedPromo,
    applyPromo,
    removePromo,
    showToast,
    toast,
  } = useCart()
  const { user } = useAuth()
  const { createOrder } = useOrders()
  const navigate = useNavigate()

  const [cartOpen, setCartOpen] = useState(false)
  const [favsOpen, setFavsOpen] = useState(false)
  const [signInOpen, setSignInOpen] = useState(false)
  const [query, setQuery] = useState('')

  // Checkout form fields
  const [customerName, setCustomerName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '+998')
  const [address, setAddress] = useState('')
  const [deliveryType, setDeliveryType] = useState('courier')
  const [paymentMethod, setPaymentMethod] = useState('payme')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [completedOrder, setCompletedOrder] = useState(null)

  // Promo code input
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

  const handleCheckout = async (e) => {
    e.preventDefault()
    if (cart.length === 0) return

    if (!customerName.trim() || !phone.trim()) {
      showToast('Iltimos, ism va telefoningizni kiriting')
      return
    }

    if (deliveryType === 'courier' && !address.trim()) {
      showToast('Iltimos, yetkazib berish manzilini kiriting')
      return
    }

    setIsSubmitting(true)
    try {
      const order = await createOrder({
        customer: customerName,
        phone,
        address: deliveryType === 'courier' ? address : "Do'kondan olib ketish",
        subtotal,
        discount: discountAmount,
        total: cartTotal,
        promoCode: appliedPromo?.code || null,
        paymentMethod:
          paymentMethod === 'payme'
            ? 'Payme'
            : paymentMethod === 'click'
            ? 'Click'
            : paymentMethod === 'uzum'
            ? 'Uzum'
            : 'Naqd pul',
        deliveryType: deliveryType === 'courier' ? 'Kuryer' : "Olib ketish",
        notes,
        items: cart,
      })

      clearCart()
      setCompletedOrder(order)
      showToast(t.orderSuccess)
    } catch (err) {
      console.error(err)
      showToast('Buyurtma berishda xatolik yuz berdi')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-[#16130F]">
      <Header
        onOpenCart={() => setCartOpen(true)}
        onOpenFavs={() => setFavsOpen(true)}
        onOpenSignIn={() => setSignInOpen(true)}
        query={query}
        setQuery={setQuery}
      />

      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Link
            to="/"
            className="text-xs font-semibold text-ink-soft hover:text-brand flex items-center gap-1"
          >
            <ArrowLeft size={14} /> {t.backToHome}
          </Link>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink dark:text-[#F3EFE7] mb-8 flex items-center gap-3">
          <ShoppingCart className="text-brand" size={28} />
          <span>{t.cart}</span>
          <span className="text-base text-ink-faint font-normal">
            ({cart.reduce((s, i) => s + i.qty, 0)} {t.pcs})
          </span>
        </h1>

        {/* Order Completed Modal */}
        {completedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="max-w-md w-full bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl p-6 sm:p-8 text-center text-ink dark:text-[#F3EFE7] shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-good-soft/40 text-good flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="font-display text-2xl font-bold mb-2">{t.orderSuccess}</h2>
              <div className="inline-block px-3 py-1 bg-brand-soft/50 dark:bg-[#2A2140] text-brand-dark dark:text-[#C9B8FF] font-mono text-sm font-bold rounded-lg mb-3">
                {t.orderNumber} {completedOrder.id}
              </div>
              <p className="text-xs text-ink-soft mb-4">{t.orderSuccessDesc}</p>
              <div className="p-3 bg-good-soft/20 border border-good/20 rounded-xl text-xs text-good font-semibold mb-6 flex items-center justify-center gap-2">
                <Send size={15} />
                <span>{t.telegramNotifSent}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setCompletedOrder(null)
                    navigate('/catalog')
                  }}
                  className="flex-1 py-3 rounded-xl bg-brand text-white font-bold text-xs hover:brightness-110 transition-all"
                >
                  {t.continueShopping}
                </button>
                <button
                  onClick={() => {
                    setCompletedOrder(null)
                    navigate('/')
                  }}
                  className="px-4 py-3 rounded-xl border border-line dark:border-[#332C23] text-ink dark:text-[#F3EFE7] font-bold text-xs hover:bg-surface-sunken dark:hover:bg-[#0F0D0A] transition-all"
                >
                  {t.backToHome}
                </button>
              </div>
            </div>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl p-8 max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-full bg-surface-sunken dark:bg-[#0F0D0A] text-ink-faint flex items-center justify-center mx-auto mb-4">
              <ShoppingCart size={36} />
            </div>
            <h3 className="text-xl font-display font-bold text-ink dark:text-[#F3EFE7] mb-2">
              {t.cartEmpty}
            </h3>
            <p className="text-sm text-ink-soft max-w-sm mx-auto mb-6">{t.cartEmptyD}</p>
            <button
              onClick={() => navigate('/catalog')}
              className="px-6 py-3 rounded-xl bg-brand text-white font-bold text-sm hover:brightness-110 transition-all shadow-md"
            >
              {t.continueShopping}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Cart Items List */}
            <div className="lg:col-span-7 bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl p-5 sm:p-6 shadow-card">
              <div className="flex items-center justify-between pb-4 border-b border-line dark:border-[#332C23] mb-4">
                <span className="text-xs font-bold text-ink-soft uppercase tracking-wider">
                  {t.admCol_product}
                </span>
                <button
                  onClick={clearCart}
                  className="text-ink-faint hover:text-bad text-xs flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={13} /> {t.clearCart}
                </button>
              </div>

              <div className="divide-y divide-line dark:divide-[#332C23]">
                {cart.map((item) => (
                  <div key={item.id} className="py-4 flex gap-4 items-center">
                    <div
                      onClick={() => navigate(`/product/${item.id}`)}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-surface-sunken dark:bg-[#0F0D0A] flex-shrink-0 flex items-center justify-center cursor-pointer overflow-hidden"
                    >
                      <ProductArt cat={item.cat} id={item.id} className="w-3/5 h-3/5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        onClick={() => navigate(`/product/${item.id}`)}
                        className="text-sm font-semibold text-ink dark:text-[#F3EFE7] hover:text-brand cursor-pointer mb-1 line-clamp-2"
                      >
                        {item.name}
                      </div>
                      <div className="text-xs font-bold text-brand mb-2">
                        {formatMoney(item.price, lang)}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-line dark:border-[#332C23] rounded-lg overflow-hidden bg-surface dark:bg-[#16130F]">
                          <button
                            onClick={() => changeQty(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center text-ink hover:bg-surface-sunken dark:hover:bg-[#0F0D0A]"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold min-w-[24px] text-center text-ink dark:text-[#F3EFE7]">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => changeQty(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center text-ink hover:bg-surface-sunken dark:hover:bg-[#0F0D0A]"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id, t.removedToast)}
                          className="text-ink-faint hover:text-bad text-xs underline transition-colors"
                        >
                          {t.remove}
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-bold text-sm sm:text-base text-ink dark:text-[#F3EFE7]">
                        {formatMoney(item.price * item.qty, lang)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo code box */}
              <div className="mt-6 pt-5 border-t border-line dark:border-[#332C23]">
                <div className="text-xs font-bold text-ink-soft mb-2 flex items-center gap-1.5">
                  <Tag size={14} className="text-brand" />
                  <span>{t.promoCode}</span>
                </div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-good-soft/30 border border-good/30 text-good text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      <span>
                        {appliedPromo.code} ({appliedPromo.label})
                      </span>
                    </div>
                    <button
                      onClick={removePromo}
                      className="text-bad hover:underline text-xs font-semibold"
                    >
                      {t.remove}
                    </button>
                  </div>
                ) : (
                  <div>
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        placeholder={t.promoPlaceholder}
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value.toUpperCase())
                          setPromoError('')
                        }}
                        className="flex-1 px-3 py-2.5 rounded-xl border border-line dark:border-[#332C23] bg-surface dark:bg-[#16130F] text-xs uppercase outline-none focus:border-brand text-ink dark:text-[#F3EFE7]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-surface-sunken dark:bg-[#0F0D0A] border border-line dark:border-[#332C23] hover:border-brand text-xs font-bold text-ink dark:text-[#F3EFE7] transition-colors"
                      >
                        {t.applyPromo}
                      </button>
                    </form>
                    {promoError && (
                      <div className="text-xs text-bad mt-1.5 font-semibold">{promoError}</div>
                    )}
                    <div className="text-[11px] text-ink-faint mt-2">
                      {t.availablePromos}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Checkout & Delivery Form */}
            <div className="lg:col-span-5 bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl p-5 sm:p-6 shadow-card">
              <h2 className="font-display text-lg font-bold text-ink dark:text-[#F3EFE7] mb-4">
                {t.checkoutTitle}
              </h2>

              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink-soft mb-1.5">
                    {t.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Alisher Qodirov"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-line dark:border-[#332C23] bg-surface dark:bg-[#16130F] text-xs outline-none focus:border-brand text-ink dark:text-[#F3EFE7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-soft mb-1.5">
                    {t.phone} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+998 90 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-line dark:border-[#332C23] bg-surface dark:bg-[#16130F] text-xs outline-none focus:border-brand text-ink dark:text-[#F3EFE7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-soft mb-1.5">
                    {t.deliveryType}
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('courier')}
                      className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                        deliveryType === 'courier'
                          ? 'border-brand bg-brand-soft/40 dark:bg-[#2A2140] text-brand-dark dark:text-[#EDE6FF]'
                          : 'border-line dark:border-[#332C23] bg-surface dark:bg-[#16130F] text-ink-soft'
                      }`}
                    >
                      <Truck size={14} className="mb-1" />
                      <div>{t.deliveryCourier}</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType('pickup')}
                      className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                        deliveryType === 'pickup'
                          ? 'border-brand bg-brand-soft/40 dark:bg-[#2A2140] text-brand-dark dark:text-[#EDE6FF]'
                          : 'border-line dark:border-[#332C23] bg-surface dark:bg-[#16130F] text-ink-soft'
                      }`}
                    >
                      <ShoppingCart size={14} className="mb-1" />
                      <div>{t.deliveryPickup}</div>
                    </button>
                  </div>
                </div>

                {deliveryType === 'courier' && (
                  <div>
                    <label className="block text-xs font-bold text-ink-soft mb-1.5">
                      {t.address} *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Toshkent shahar, Yunusobod tumani, 4-mavze, 12-uy, 45-xonadon"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-line dark:border-[#332C23] bg-surface dark:bg-[#16130F] text-xs outline-none focus:border-brand text-ink dark:text-[#F3EFE7] resize-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-ink-soft mb-1.5">
                    {t.paymentMethod}
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'payme', label: 'Payme' },
                      { id: 'click', label: 'Click' },
                      { id: 'uzum', label: 'Uzum Pay' },
                      { id: 'cash', label: 'Naqd pul' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPaymentMethod(p.id)}
                        className={`p-2 rounded-xl border text-center font-bold transition-all ${
                          paymentMethod === p.id
                            ? 'border-brand bg-brand-soft/40 dark:bg-[#2A2140] text-brand-dark dark:text-[#EDE6FF]'
                            : 'border-line dark:border-[#332C23] bg-surface dark:bg-[#16130F] text-ink-soft'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-soft mb-1.5">
                    {t.orderNotes}
                  </label>
                  <input
                    type="text"
                    placeholder="Domofon kodi, eshik oldida qoldiring..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-line dark:border-[#332C23] bg-surface dark:bg-[#16130F] text-xs outline-none focus:border-brand text-ink dark:text-[#F3EFE7]"
                  />
                </div>

                {/* Calculation breakdown */}
                <div className="pt-3 border-t border-line dark:border-[#332C23] space-y-2 text-xs text-ink-soft">
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
                  <div className="border-t border-line dark:border-[#332C23] pt-2.5 flex justify-between items-baseline text-base font-bold text-ink dark:text-[#F3EFE7]">
                    <span>{t.total}</span>
                    <span className="text-xl font-black text-brand">
                      {formatMoney(cartTotal, lang)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-brand hover:brightness-110 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-70"
                >
                  <Send size={16} />
                  <span>{isSubmitting ? 'Yuborilmoqda...' : t.confirmOrder}</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <FavoritesDrawer open={favsOpen} onClose={() => setFavsOpen(false)} />
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
      <Toast text={toast} />
    </div>
  )
}
