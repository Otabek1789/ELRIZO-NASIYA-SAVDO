import { useState } from 'react'
import { FileText, Eye, CheckCircle2, Clock, Truck, XCircle, Trash2 } from 'lucide-react'
import { useLang } from '../../context/LangContext'
import { useOrders } from '../../context/OrderContext'
import { formatMoney } from '../../data/products'

const STATUS_MAP = {
  delivered: ['stDelivered', 'bg-good-soft text-good', CheckCircle2],
  processing: ['stProcessing', 'bg-accent-soft text-accent', Clock],
  shipped: ['stShipped', 'bg-brand-soft dark:bg-[#2A2140] text-brand-dark dark:text-[#C9B8FF]', Truck],
  cancelled: ['stCancelled', 'bg-bad-soft text-bad', XCircle],
  pending: ['stPending', 'bg-accent-soft text-accent', Clock],
}

export default function Orders() {
  const { t, lang } = useLang()
  const { orders, updateOrderStatus, deleteOrder } = useOrders()

  const [filter, setFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  return (
    <div className="bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl shadow-card overflow-hidden">
      {/* Top Filter Header */}
      <div className="px-5 py-4 border-b border-line dark:border-[#332C23] flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-display font-bold text-lg text-ink dark:text-[#F3EFE7]">
            {t.admOrdersTitle}
          </h2>
          <p className="text-xs text-ink-soft">
            Jami buyurtmalar: <b className="text-brand">{orders.length}</b> ta
          </p>
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                filter === s
                  ? 'border-brand text-brand bg-brand-soft dark:bg-[#2A2140]'
                  : 'border-line dark:border-[#332C23] text-ink-soft hover:text-ink'
              }`}
            >
              {s === 'all' ? t.all : t[STATUS_MAP[s][0]]}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-surface-sunken/50 dark:bg-[#0F0D0A]/50">
              <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-ink-faint font-extrabold border-b border-line dark:border-[#332C23]">
                {t.admOrderId}
              </th>
              <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-ink-faint font-extrabold border-b border-line dark:border-[#332C23]">
                {t.admCustomer}
              </th>
              <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-ink-faint font-extrabold border-b border-line dark:border-[#332C23]">
                {t.admDate}
              </th>
              <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-ink-faint font-extrabold border-b border-line dark:border-[#332C23]">
                {t.admAmount}
              </th>
              <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-ink-faint font-extrabold border-b border-line dark:border-[#332C23]">
                {t.admStatus}
              </th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-ink-faint font-extrabold border-b border-line dark:border-[#332C23]">
                {t.admActions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-[#332C23]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-ink-faint">
                  {t.noResults}
                </td>
              </tr>
            ) : (
              filtered.map((o) => {
                const [labelKey, cls] = STATUS_MAP[o.status] || STATUS_MAP.pending
                return (
                  <tr
                    key={o.id}
                    className="hover:bg-surface-sunken dark:hover:bg-[#0F0D0A] transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono font-bold text-ink dark:text-[#F3EFE7]">
                      {o.id}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-ink dark:text-[#F3EFE7]">{o.customer}</div>
                      {o.phone && (
                        <div className="text-[11px] text-ink-faint font-mono">{o.phone}</div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-ink-soft whitespace-nowrap">
                      {o.date}
                      {o.time && <span className="block text-[10px] text-ink-faint">{o.time}</span>}
                    </td>
                    <td className="px-5 py-3.5 font-extrabold text-ink dark:text-[#F3EFE7]">
                      {formatMoney(o.amount, lang)}
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold border-none outline-none cursor-pointer ${cls}`}
                      >
                        <option value="pending">{t.stPending}</option>
                        <option value="processing">{t.stProcessing}</option>
                        <option value="shipped">{t.stShipped}</option>
                        <option value="delivered">{t.stDelivered}</option>
                        <option value="cancelled">{t.stCancelled}</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="px-2.5 py-1.5 rounded-lg border border-line dark:border-[#332C23] text-ink-soft hover:text-brand hover:border-brand text-xs font-semibold inline-flex items-center gap-1 transition-colors mr-2"
                      >
                        <Eye size={13} /> Tafsilot
                      </button>
                      <button
                        onClick={() => deleteOrder(o.id)}
                        className="w-7 h-7 rounded-lg border border-line dark:border-[#332C23] text-ink-faint hover:text-bad inline-flex items-center justify-center transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-lg w-full bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl p-6 shadow-2xl text-ink dark:text-[#F3EFE7]">
            <div className="flex items-center justify-between pb-3.5 border-b border-line dark:border-[#332C23] mb-4">
              <div>
                <h3 className="font-display font-bold text-lg">
                  Buyurtma #{selectedOrder.id}
                </h3>
                <span className="text-xs text-ink-soft">
                  Sana: {selectedOrder.date} {selectedOrder.time || ''}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-7 h-7 rounded-lg border border-line dark:border-[#332C23] text-ink-soft flex items-center justify-center hover:text-ink"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs mb-5">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-surface-sunken dark:bg-[#0F0D0A]">
                <div>
                  <span className="text-ink-faint block">Mijoz:</span>
                  <b className="text-sm">{selectedOrder.customer}</b>
                </div>
                <div>
                  <span className="text-ink-faint block">Telefon:</span>
                  <b className="text-sm">{selectedOrder.phone || '—'}</b>
                </div>
                <div className="col-span-2">
                  <span className="text-ink-faint block">Manzil:</span>
                  <b>{selectedOrder.address || 'Do\'kondan olib ketish'}</b>
                </div>
                <div>
                  <span className="text-ink-faint block">To'lov usuli:</span>
                  <b>{selectedOrder.paymentMethod || 'Naqd'}</b>
                </div>
                {selectedOrder.promoCode && (
                  <div>
                    <span className="text-ink-faint block">Promokod:</span>
                    <b className="text-brand">{selectedOrder.promoCode}</b>
                  </div>
                )}
              </div>

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <span className="font-bold text-ink-soft block mb-2">Buyurtma qilingan tovarlar:</span>
                  <div className="divide-y divide-line dark:divide-[#332C23] border border-line dark:border-[#332C23] rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                    {selectedOrder.items.map((it, idx) => (
                      <div key={idx} className="p-2.5 flex justify-between items-center bg-surface dark:bg-[#16130F]">
                        <div>
                          <div className="font-semibold">{it.name}</div>
                          <div className="text-[11px] text-ink-faint">
                            {it.qty} dona × {it.price?.toLocaleString()} so'm
                          </div>
                        </div>
                        <div className="font-bold">
                          {((it.qty || 1) * it.price)?.toLocaleString()} so'm
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-between items-baseline text-sm">
                <span className="font-bold">Jami to'lov:</span>
                <span className="text-lg font-black text-brand">
                  {formatMoney(selectedOrder.amount, lang)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2.5 rounded-xl bg-brand text-white font-bold text-xs"
            >
              Yopish
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
