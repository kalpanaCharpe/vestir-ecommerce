import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productAPI } from '../api'
import ProductCard from '../components/common/ProductCard'
import Pagination from '../components/common/Pagination'
import { SkeletonCard, EmptyState } from '../components/common/Loading'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const CATEGORIES = ['Men', 'Women', 'Kids']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'name_asc', label: 'Name A–Z' },
]

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const page = parseInt(searchParams.get('page') || '1')
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || 'newest'
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''

  const [searchInput, setSearchInput] = useState(search)

  const updateParams = (updates) => {
    const newParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([k, v]) => {
      if (v) newParams.set(k, v)
      else newParams.delete(k)
    })
    if (!updates.page) newParams.set('page', '1')
    setSearchParams(newParams)
  }

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 12 }
      if (search) params.search = search
      if (category) params.category = category
      if (sort) params.sort = sort
      if (minPrice) params.minPrice = minPrice
      if (maxPrice) params.maxPrice = maxPrice

      const { data } = await productAPI.getAll(params)
      setProducts(data.products || data || [])
      setTotalPages(data.totalPages || 1)
      setTotal(data.total || (data.products || data || []).length)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [page, search, category, sort, minPrice, maxPrice])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleSearch = (e) => {
    e.preventDefault()
    updateParams({ search: searchInput })
  }

  const clearFilters = () => {
    setSearchInput('')
    setSearchParams({ page: '1' })
  }

  const hasFilters = search || category || minPrice || maxPrice

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="section-label mb-2">Catalogue</div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h1 className="text-4xl font-display font-bold text-obsidian-900">
            {category || 'All Products'}
          </h1>
          <span className="text-sm text-obsidian-400 font-mono">{total} items</span>
        </div>
      </div>

      {/* Search + Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-300" size={16} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input-field pl-9 pr-4 py-2.5 text-sm"
            />
          </div>
          <button type="submit" className="btn-primary py-2.5 px-5 text-sm">Search</button>
        </form>

        <div className="flex gap-2">
          <select
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="input-field py-2.5 text-sm min-w-[160px] cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`btn-outline py-2.5 px-4 text-sm flex items-center gap-2 ${filtersOpen ? 'bg-obsidian-900 text-cream' : ''}`}
          >
            <FiFilter size={14} /> Filters
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-obsidian-50 border border-obsidian-100 p-5 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Category */}
              <div>
                <label className="section-label block mb-2">Category</label>
                <div className="flex flex-wrap gap-1">
                  {CATEGORIES.map((cat) => (
                    <button key={cat}
                      onClick={() =>
                        updateParams({ category: category === cat ? '' : cat })
                      }

                      className={`text-s py-1 px-2.5 border transition-colors ${category === cat
                          ? 'bg-obsidian-900 text-cream border-obsidian-900'
                          : 'border-obsidian-200 text-obsidian-600 hover:border-obsidian-400'
                        }`}
                    >{cat}</button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <label className="section-label block mb-2">Min Price</label>
                <input
                  type="number"
                  placeholder="$0"
                  value={minPrice}
                  onChange={(e) => updateParams({ minPrice: e.target.value })}
                  className="input-field py-2 text-sm"
                />
              </div>
              <div>
                <label className="section-label block mb-2">Max Price</label>
                <input
                  type="number"
                  placeholder="Any"
                  value={maxPrice}
                  onChange={(e) => updateParams({ maxPrice: e.target.value })}
                  className="input-field py-2 text-sm"
                />
              </div>

              <div className="flex items-end">
                {hasFilters && (
                  <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-obsidian-500 hover:text-obsidian-900 transition-colors">
                    <FiX size={14} /> Clear all
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filters */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {search && (
            <span className="badge bg-obsidian-100 text-obsidian-700 text-xs flex items-center gap-1">
              "{search}" <button onClick={() => { setSearchInput(''); updateParams({ search: '' }) }}><FiX size={10} /></button>
            </span>
          )}
          {category && (
            <span className="badge bg-obsidian-100 text-obsidian-700 text-xs flex items-center gap-1">
              {category} <button onClick={() => updateParams({ category: '' })}><FiX size={10} /></button>
            </span>
          )}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found"
          desc="Try adjusting your search or filters"
          action={<button onClick={clearFilters} className="btn-outline text-sm">Clear Filters</button>}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={(p) => updateParams({ page: String(p) })} />
    </div>
  )
}
