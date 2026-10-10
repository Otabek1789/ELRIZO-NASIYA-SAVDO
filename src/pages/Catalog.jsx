import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  LayoutGrid,
  List,
  ChevronDown,
  Star,
  Check,
  X,
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'
import FavoritesDrawer from '../components/FavoritesDrawer'
import SignInModal from '../components/SignInModal'
import ProductCard from '../components/ProductCard'
import ProductArt from '../components/ProductArt'
import Toast from '../components/Toast'
import { useLang } from '../context/LangContext'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductContext'
import { CATS, formatMoney } from '../data/products'
import { CAT_KEY } from '../data/translations'

export default function Catalog() {
  const { t, lang } = useLang()
  const { toast, addToCart } = useCart()
  const { products } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()

  const [cartOpen, setCartOpen] = useState(false)
  const [favsOpen, setFavsOpen] = useState(false)
  const [signInOpen, setSignInOpen] = useState(false)

  // Filters state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedCat, setSelectedCat] = useState(searchParams.get('cat') || 'all')
  const [sortBy, setSortBy] = useState('default')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [discountOnly, setDiscountOnly] = useState(searchParams.get('discount') === 'true')
  const [ratingOnly, setRatingOnly] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Sync with URL query parameter changes
  useEffect(() => {
    const q = searchParams.get('q')
    if (q !== null) setSearchQuery(q)
    const cat = searchParams.get('cat')
    if (cat) setSelectedCat(cat)
    if (searchParams.get('discount') === 'true') setDiscountOnly(true)
  }, [searchParams])

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    let list = [...products]

    // 1. Category Filter
    if (selectedCat !== 'all') {
      list = list.filter((p) => p.cat === selectedCat)
    }

    // 2. Search Query Filter (Req 15)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.cat.toLowerCase().includes(q)
      )
    }

    // 3. Price Filter (Req 16)
    if (minPrice && !isNaN(minPrice)) {
      list = list.filter((p) => p.price >= Number(minPrice))
    }
    if (maxPrice && !isNaN(maxPrice)) {
      list = list.filter((p) => p.price <= Number(maxPrice))
    }

    // 4. In Stock Filter
    if (inStockOnly) {
      list = list.filter((p) => p.stock > 0)
    }

    // 5. Discount Only Filter
    if (discountOnly) {
      list = list.filter((p) => p.old && p.old > p.price)
    }

    // 6. Rating Filter (4.0+)
    if (ratingOnly) {
      list = list.filter((p) => parseFloat(p.rating) >= 4.0)
    }

    // 7. Sorting (Req 16)
    switch (sortBy) {
      case 'price_asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        list.sort((a, b) => (b.sold || 0) - (a.sold || 0))
        break
      case 'new':
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case 'rating':
        list.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
        break
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // Default ranking
        break
    }

    return list
  }, [
    products,
    selectedCat,
    searchQuery,
    minPrice,
    maxPrice,
    inStockOnly,
    discountOnly,
    ratingOnly,
    sortBy,
  ])

  const handleResetFilters = () => {
    setSelectedCat('all')
    setSearchQuery('')
    setSortBy('default')
    setMinPrice('')
    setMaxPrice('')
    setInStockOnly(false)
    setDiscountOnly(false)
    setRatingOnly(false)
    setSearchParams({})
  }

  const activeFiltersCount = [
    selectedCat !== 'all',
    searchQuery.trim().length > 0,
    minPrice !== '',
    maxPrice !== '',
    inStockOnly,
    discountOnly,
    ratingOnly,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-[#16130F]">
      <Header
        onOpenCart={() => setCartOpen(true)}
        onOpenFavs={() => setFavsOpen(true)}
        onOpenSignIn={() => setSignInOpen(true)}
        query={searchQuery}
        setQuery={setSearchQuery}
      />

      {/* Breadcrumb & Title Bar */}
      <div className="border-b border-line dark:border-[#332C23] bg-surface-elevated/50 dark:bg-[#211C17]/50 py-5">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink dark:text-[#F3EFE7]">
                {t.navCatalog}
              </h1>
              <p className="text-xs text-ink-soft mt-1">
                {t.showingProducts} {filteredProducts.length} {t.outOf} {products.length}{' '}
                {t.pcs}
              </p>
            </div>

            {/* Quick Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <button
                onClick={() => setSelectedCat('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCat === 'all'
                    ? 'bg-brand text-white'
                    : 'bg-surface dark:bg-[#16130F] border border-line dark:border-[#332C23] text-ink-soft hover:text-ink'
                }`}
              >
                {t.catAll}
              </button>
              {CATS.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCat(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCat === c
                      ? 'bg-brand text-white'
                      : 'bg-surface dark:bg-[#16130F] border border-line dark:border-[#332C23] text-ink-soft hover:text-ink'
                  }`}
                >
                  {t[CAT_KEY[c]] || c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden flex items-center justify-between gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-line dark:border-[#332C23] bg-surface-elevated dark:bg-[#211C17] text-xs font-bold text-ink dark:text-[#F3EFE7]"
            >
              <SlidersHorizontal size={15} />
              <span>{t.filterTitle}</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-brand text-white text-[10px] flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Desktop Left Filter Sidebar */}
          <aside
            className={`fixed inset-0 z-50 bg-black/50 lg:static lg:bg-transparent lg:z-auto transition-opacity duration-200 ${
              mobileFilterOpen
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto'
            }`}
          >
            <div
              className={`fixed top-0 left-0 bottom-0 w-[300px] max-w-[85vw] bg-surface-elevated dark:bg-[#211C17] border-r border-line dark:border-[#332C23] p-5 overflow-y-auto lg:static lg:w-auto lg:border lg:rounded-2xl lg:p-5 shadow-card transition-transform duration-300 ${
                mobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
              }`}
            >
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-line dark:border-[#332C23]">
                <div className="flex items-center gap-2">
                  <Filter size={17} className="text-brand" />
                  <h3 className="font-display font-bold text-base text-ink dark:text-[#F3EFE7]">
                    {t.filterTitle}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={handleResetFilters}
                      className="text-[11px] font-bold text-bad hover:underline flex items-center gap-1"
                    >
                      <RotateCcw size={12} /> {t.resetFilters}
                    </button>
                  )}
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="lg:hidden text-ink-soft p-1"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* 1. Category Filter */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-2.5">
                  {t.admCol_category}
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCat('all')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                      selectedCat === 'all'
                        ? 'bg-brand text-white font-bold'
                        : 'text-ink-soft hover:bg-surface-sunken dark:hover:bg-[#0F0D0A] hover:text-ink'
                    }`}
                  >
                    <span>{t.catAll}</span>
                    <span className="text-[11px] opacity-80">{products.length}</span>
                  </button>
                  {CATS.map((c) => {
                    const count = products.filter((p) => p.cat === c).length
                    return (
                      <button
                        key={c}
                        onClick={() => setSelectedCat(c)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                          selectedCat === c
                            ? 'bg-brand text-white font-bold'
                            : 'text-ink-soft hover:bg-surface-sunken dark:hover:bg-[#0F0D0A] hover:text-ink'
                        }`}
                      >
                        <span>{t[CAT_KEY[c]] || c}</span>
                        <span className="text-[11px] opacity-80">{count}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 2. Price Range Filter */}
              <div className="mb-6 pt-5 border-t border-line dark:border-[#332C23]">
                <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-2.5">
                  {t.priceRange}
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="number"
                    placeholder={t.minPrice}
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-line dark:border-[#332C23] bg-surface dark:bg-[#16130F] text-xs outline-none focus:border-brand text-ink dark:text-[#F3EFE7]"
                  />
                  <input
                    type="number"
                    placeholder={t.maxPrice}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-line dark:border-[#332C23] bg-surface dark:bg-[#16130F] text-xs outline-none focus:border-brand text-ink dark:text-[#F3EFE7]"
                  />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {[
                    { label: '< 100k', min: '', max: '100000' },
                    { label: '100k-300k', min: '100000', max: '300000' },
                    { label: '300k-600k', min: '300000', max: '600000' },
                    { label: '> 600k', min: '600000', max: '' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setMinPrice(preset.min)
                        setMaxPrice(preset.max)
                      }}
                      className="px-2 py-1 rounded bg-surface-sunken dark:bg-[#0F0D0A] text-[10.5px] font-semibold text-ink-soft hover:text-brand"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Checkbox toggles (In stock, Discounts, 4+ rating) */}
              <div className="mb-6 pt-5 border-t border-line dark:border-[#332C23] space-y-3">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-ink dark:text-[#F3EFE7]">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-brand focus:ring-0"
                  />
                  <span>{t.onlyInStock}</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-ink dark:text-[#F3EFE7]">
                  <input
                    type="checkbox"
                    checked={discountOnly}
                    onChange={(e) => setDiscountOnly(e.target.checked)}
                    className="rounded text-brand focus:ring-0"
                  />
                  <span className="text-accent">{t.onlyDiscounts}</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-ink dark:text-[#F3EFE7]">
                  <input
                    type="checkbox"
                    checked={ratingOnly}
                    onChange={(e) => setRatingOnly(e.target.checked)}
                    className="rounded text-brand focus:ring-0"
                  />
                  <span className="flex items-center gap-1">
                    <Star size={13} className="text-[#F2A93B]" fill="currentColor" />
                    {t.ratingFilter}
                  </span>
                </label>
              </div>

              {/* Reset button inside mobile drawer */}
              <div className="lg:hidden pt-4 border-t border-line dark:border-[#332C23]">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-brand text-white font-bold text-xs"
                >
                  Natijalarni ko'rish ({filteredProducts.length})
                </button>
              </div>
            </div>
          </aside>

          {/* Right Product Grid & Sorting Toolbar */}
          <div className="lg:col-span-3">
            {/* Top Toolbar */}
            <div className="bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl p-3.5 sm:p-4 mb-6 flex items-center justify-between gap-4 flex-wrap shadow-card">
              {/* Search query tag / Active filter badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-ink-soft">
                  {t.showingProducts}: <b className="text-brand">{filteredProducts.length}</b>
                </span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-soft text-brand-dark dark:bg-[#2A2140] dark:text-[#C9B8FF] text-xs font-bold">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery('')}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedCat !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-sunken dark:bg-[#0F0D0A] text-xs font-bold text-ink">
                    {t[CAT_KEY[selectedCat]] || selectedCat}
                    <button onClick={() => setSelectedCat('all')}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {discountOnly && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent-soft text-accent text-xs font-bold">
                    {t.onlyDiscounts}
                    <button onClick={() => setDiscountOnly(false)}>
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>

              {/* Sorting & View Switcher */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-ink-soft hidden sm:inline">{t.sortBy}</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-line dark:border-[#332C23] bg-surface dark:bg-[#16130F] text-xs font-bold text-ink dark:text-[#F3EFE7] outline-none cursor-pointer"
                  >
                    <option value="default">{t.sortDefault}</option>
                    <option value="popular">{t.sortPopular}</option>
                    <option value="price_asc">{t.sortPriceAsc}</option>
                    <option value="price_desc">{t.sortPriceDesc}</option>
                    <option value="new">{t.sortNew}</option>
                    <option value="rating">{t.sortRating}</option>
                    <option value="name">{t.sortName}</option>
                  </select>
                </div>

                <div className="flex items-center border border-line dark:border-[#332C23] rounded-xl overflow-hidden bg-surface dark:bg-[#16130F]">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 text-ink-soft transition-colors ${
                      viewMode === 'grid' ? 'bg-brand text-white' : 'hover:text-ink'
                    }`}
                    title={t.viewGrid}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 text-ink-soft transition-colors ${
                      viewMode === 'list' ? 'bg-brand text-white' : 'hover:text-ink'
                    }`}
                    title={t.viewList}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Listing */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-24 bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl p-8">
                <div className="w-16 h-16 rounded-full bg-surface-sunken dark:bg-[#0F0D0A] text-ink-faint flex items-center justify-center mx-auto mb-3">
                  <Search size={28} />
                </div>
                <h3 className="font-display font-bold text-lg text-ink dark:text-[#F3EFE7] mb-1">
                  {t.noResults}
                </h3>
                <p className="text-xs text-ink-soft max-w-sm mx-auto mb-5">{t.noResultsDesc}</p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl bg-brand text-white text-xs font-bold hover:brightness-110"
                >
                  {t.resetFilters}
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              /* List View Mode */
              <div className="space-y-3">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl p-4 flex items-center gap-4 hover:shadow-cardHover transition-all"
                  >
                    <div className="w-20 h-20 rounded-xl bg-surface-sunken dark:bg-[#0F0D0A] flex-shrink-0 flex items-center justify-center">
                      <ProductArt cat={p.cat} id={p.id} className="w-3/5 h-3/5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-ink-faint">
                        {p.cat}
                      </span>
                      <h4 className="font-semibold text-sm text-ink dark:text-[#F3EFE7] truncate">
                        {p.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-ink-soft mt-1">
                        <span className="text-[#F2A93B] flex items-center gap-1">
                          <Star size={12} fill="currentColor" /> {p.rating}
                        </span>
                        <span>· {p.reviews} sharh</span>
                        <span>· Omborda: {p.stock} dona</span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <div className="text-base font-black text-brand">
                        {formatMoney(p.price, lang)}
                      </div>
                      {p.old && (
                        <div className="text-xs text-ink-faint line-through">
                          {formatMoney(p.old, lang)}
                        </div>
                      )}
                      <button
                        onClick={() => addToCart(p, t.addedToast)}
                        className="px-3 py-1.5 rounded-xl bg-brand text-white text-xs font-bold hover:brightness-110 transition-all"
                      >
                        {t.addToCart}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <FavoritesDrawer open={favsOpen} onClose={() => setFavsOpen(false)} />
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
      <Toast text={toast} />
    </div>
  )
}
