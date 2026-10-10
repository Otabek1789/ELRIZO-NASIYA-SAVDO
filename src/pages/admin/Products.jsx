import { useState } from 'react'
import { Search, Plus, Edit2, Trash2, X, AlertTriangle, CheckCircle2 } from 'lucide-react'
import ProductArt from '../../components/ProductArt'
import { useLang } from '../../context/LangContext'
import { useProducts } from '../../context/ProductContext'
import { CATS, formatMoney } from '../../data/products'
import { CAT_KEY } from '../../data/translations'

export default function Products() {
  const { t, lang } = useLang()
  const { products, addProduct, updateProduct, deleteProduct, resetProducts } = useProducts()

  const [query, setQuery] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [modal, setModal] = useState(null) // { mode: 'new' | 'edit', data: { ... } }
  const [deleteId, setDeleteId] = useState(null)
  const [alertMsg, setAlertMsg] = useState('')

  const filtered = products.filter((p) => {
    if (catFilter !== 'all' && p.cat !== catFilter) return false
    if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  const openNew = () =>
    setModal({
      mode: 'new',
      data: { name: '', cat: CATS[0], price: '', old: '', stock: '10', desc: '' },
    })

  const openEdit = (p) =>
    setModal({
      mode: 'edit',
      data: {
        id: p.id,
        name: p.name,
        cat: p.cat,
        price: p.price,
        old: p.old || '',
        stock: p.stock,
        desc: p.desc || '',
      },
    })

  const saveModal = (e) => {
    e.preventDefault()
    const d = modal.data
    if (!d.name.trim()) return

    if (modal.mode === 'new') {
      addProduct({
        name: d.name.trim(),
        cat: d.cat,
        price: Number(d.price) || 0,
        old: d.old ? Number(d.old) : null,
        stock: Number(d.stock) || 0,
        desc: d.desc || '',
      })
      setAlertMsg("Yangi mahsulot muvaffaqiyatli qo'shildi!")
    } else {
      updateProduct(d.id, {
        name: d.name.trim(),
        cat: d.cat,
        price: Number(d.price) || 0,
        old: d.old ? Number(d.old) : null,
        stock: Number(d.stock) || 0,
        desc: d.desc || '',
      })
      setAlertMsg("Mahsulot muvaffaqiyatli yangilandi!")
    }

    setModal(null)
    setTimeout(() => setAlertMsg(''), 3000)
  }

  const confirmDelete = () => {
    if (deleteId) {
      deleteProduct(deleteId)
      setDeleteId(null)
      setAlertMsg("Mahsulot o'chirildi!")
      setTimeout(() => setAlertMsg(''), 3000)
    }
  }

  const stockPill = (s) =>
    s === 0 ? (
      <span className="inline-flex items-center text-[11.5px] font-bold px-2.5 py-1 rounded-full bg-bad-soft text-bad">
        {t.admOutStock}
      </span>
    ) : s < 10 ? (
      <span className="inline-flex items-center text-[11.5px] font-bold px-2.5 py-1 rounded-full bg-accent-soft text-accent">
        {t.admLowStock} ({s})
      </span>
    ) : (
      <span className="inline-flex items-center text-[11.5px] font-bold px-2.5 py-1 rounded-full bg-good-soft text-good">
        {t.admInStock} ({s})
      </span>
    )

  return (
    <div>
      {/* Alert Banner */}
      {alertMsg && (
        <div className="mb-4 p-3.5 rounded-xl bg-good-soft text-good text-xs font-bold flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle2 size={16} />
          <span>{alertMsg}</span>
        </div>
      )}

      <div className="bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl shadow-card overflow-hidden">
        {/* Table Top Controls */}
        <div className="px-5 py-4 border-b border-line dark:border-[#332C23] flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="font-display font-bold text-lg text-ink dark:text-[#F3EFE7]">
              {t.admProductsTitle}
            </h2>
            <p className="text-xs text-ink-soft">
              Jami mahsulotlar soni: <b className="text-brand">{products.length}</b> ta
            </p>
          </div>

          <div className="flex gap-2.5 flex-wrap items-center">
            {/* Search filter */}
            <div className="flex items-center gap-2 bg-surface-sunken dark:bg-[#0F0D0A] rounded-xl px-3 h-10 min-w-[200px] border border-line dark:border-[#332C23]">
              <Search size={15} className="text-ink-faint flex-shrink-0" />
              <input
                className="bg-transparent border-none outline-none text-xs text-ink dark:text-[#F3EFE7] placeholder:text-ink-faint w-full"
                placeholder={t.admSearchProducts}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {/* Category filter */}
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="bg-surface-sunken dark:bg-[#0F0D0A] border border-line dark:border-[#332C23] rounded-xl h-10 px-3 text-xs font-bold text-ink dark:text-[#F3EFE7] outline-none cursor-pointer"
            >
              <option value="all">{t.admAllCats}</option>
              {CATS.map((c) => (
                <option key={c} value={c}>
                  {t[CAT_KEY[c]] || c}
                </option>
              ))}
            </select>

            {/* Add Product Button (Req 9) */}
            <button
              onClick={openNew}
              className="inline-flex items-center gap-1.5 px-3.5 h-10 rounded-xl text-xs font-bold bg-brand text-white hover:brightness-110 transition-all shadow-md"
            >
              <Plus size={15} />
              <span>{t.admAddProduct}</span>
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-surface-sunken/50 dark:bg-[#0F0D0A]/50">
                <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-ink-faint font-extrabold border-b border-line dark:border-[#332C23]">
                  {t.admCol_product}
                </th>
                <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-ink-faint font-extrabold border-b border-line dark:border-[#332C23]">
                  {t.admCol_category}
                </th>
                <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-ink-faint font-extrabold border-b border-line dark:border-[#332C23]">
                  {t.admCol_price}
                </th>
                <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-ink-faint font-extrabold border-b border-line dark:border-[#332C23]">
                  {t.admCol_stock}
                </th>
                <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-ink-faint font-extrabold border-b border-line dark:border-[#332C23]">
                  {t.admActions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line dark:divide-[#332C23]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-ink-faint">
                    {t.noResults}
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-surface-sunken dark:hover:bg-[#0F0D0A] transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-sunken dark:bg-[#0F0D0A] flex items-center justify-center flex-shrink-0">
                          <ProductArt cat={p.cat} id={p.id} className="w-3/5 h-3/5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-ink dark:text-[#F3EFE7] truncate max-w-[240px]">
                            {p.name}
                          </div>
                          <div className="text-[11px] text-ink-faint">ID: #{p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-ink-soft">
                      {t[CAT_KEY[p.cat]] || p.cat}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-extrabold text-ink dark:text-[#F3EFE7]">
                        {formatMoney(p.price, lang)}
                      </div>
                      {p.old && (
                        <div className="text-[11px] text-ink-faint line-through">
                          {formatMoney(p.old, lang)}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">{stockPill(p.stock)}</td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      {/* Edit Button (Req 9) */}
                      <button
                        onClick={() => openEdit(p)}
                        title={t.admEditProduct}
                        className="w-8 h-8 rounded-lg border border-line dark:border-[#332C23] inline-flex items-center justify-center text-ink-soft hover:text-brand hover:border-brand mr-2 transition-colors"
                      >
                        <Edit2 size={13} />
                      </button>
                      {/* Delete Button (Req 9) */}
                      <button
                        onClick={() => setDeleteId(p.id)}
                        title="O'chirish"
                        className="w-8 h-8 rounded-lg border border-line dark:border-[#332C23] inline-flex items-center justify-center text-ink-soft hover:text-bad hover:border-bad transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal (Req 9) */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl p-6 shadow-2xl text-ink dark:text-[#F3EFE7]">
            <div className="flex items-center justify-between pb-3.5 border-b border-line dark:border-[#332C23] mb-4">
              <h3 className="font-display font-bold text-base">
                {modal.mode === 'new' ? t.admNewProduct : t.admEditProduct}
              </h3>
              <button
                onClick={() => setModal(null)}
                className="w-7 h-7 rounded-lg border border-line dark:border-[#332C23] flex items-center justify-center text-ink-soft hover:text-ink"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={saveModal} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-ink-soft mb-1">{t.fldName} *</label>
                <input
                  type="text"
                  required
                  value={modal.data.name}
                  onChange={(e) =>
                    setModal({ ...modal, data: { ...modal.data, name: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-line dark:border-[#332C23] bg-surface dark:bg-[#16130F] text-ink dark:text-[#F3EFE7] outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block font-bold text-ink-soft mb-1">{t.fldCategory}</label>
                <select
                  value={modal.data.cat}
                  onChange={(e) =>
                    setModal({ ...modal, data: { ...modal.data, cat: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-line dark:border-[#332C23] bg-surface dark:bg-[#16130F] text-ink dark:text-[#F3EFE7] outline-none focus:border-brand cursor-pointer"
                >
                  {CATS.map((c) => (
                    <option key={c} value={c}>
                      {t[CAT_KEY[c]] || c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink-soft mb-1">{t.fldPrice} *</label>
                  <input
                    type="number"
                    required
                    value={modal.data.price}
                    onChange={(e) =>
                      setModal({ ...modal, data: { ...modal.data, price: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-line dark:border-[#332C23] bg-surface dark:bg-[#16130F] text-ink dark:text-[#F3EFE7] outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink-soft mb-1">{t.fldOldPrice}</label>
                  <input
                    type="number"
                    value={modal.data.old}
                    onChange={(e) =>
                      setModal({ ...modal, data: { ...modal.data, old: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-line dark:border-[#332C23] bg-surface dark:bg-[#16130F] text-ink dark:text-[#F3EFE7] outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink-soft mb-1">{t.fldStock}</label>
                <input
                  type="number"
                  value={modal.data.stock}
                  onChange={(e) =>
                    setModal({ ...modal, data: { ...modal.data, stock: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-line dark:border-[#332C23] bg-surface dark:bg-[#16130F] text-ink dark:text-[#F3EFE7] outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block font-bold text-ink-soft mb-1">{t.fldDesc}</label>
                <textarea
                  rows={2}
                  value={modal.data.desc}
                  onChange={(e) =>
                    setModal({ ...modal, data: { ...modal.data, desc: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-line dark:border-[#332C23] bg-surface dark:bg-[#16130F] text-ink dark:text-[#F3EFE7] outline-none focus:border-brand resize-none"
                />
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-line dark:border-[#332C23] font-bold text-ink-soft hover:bg-surface-sunken transition-colors"
                >
                  {t.fldCancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand text-white font-bold hover:brightness-110 transition-all shadow-md"
                >
                  {t.fldSave}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Req 9) */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-sm w-full bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl p-6 shadow-2xl text-center text-ink dark:text-[#F3EFE7]">
            <div className="w-12 h-12 rounded-full bg-bad-soft text-bad flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={24} />
            </div>
            <h3 className="font-display font-bold text-base mb-2">
              {t.admDeleteConfirm}
            </h3>
            <p className="text-xs text-ink-soft mb-5">
              Ushbu mahsulot do'kon katalogi va ma'lumotlar bazasidan butunlay o'chiriladi.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-line dark:border-[#332C23] font-bold text-xs"
              >
                {t.fldCancel}
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-bad text-white font-bold text-xs hover:brightness-110 shadow-md"
              >
                {t.admYesDelete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
