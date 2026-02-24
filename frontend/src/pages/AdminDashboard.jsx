import { useState, useEffect } from 'react'
import { productAPI, userAPI, orderAPI } from '../api'
import { Spinner, SkeletonCard } from '../components/common/Loading'
import { FiPackage, FiUsers, FiShoppingBag, FiPlus, FiEdit, FiTrash2, FiChevronDown, FiChevronUp, FiX, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const TABS = ['Products', 'Orders', 'Users']
const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('Products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0 })

  const [productForm, setProductForm] = useState({
    name: '', price: '', description: '', category: '', stock: '', sizes: '', colors: '', tags: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchOrders()
    fetchUsers()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data } = await productAPI.getAll({ limit: 100 })
      const list = data.products || data || []
      setProducts(list)
      setStats(s => ({ ...s, products: list.length }))
    } finally { setLoading(false) }
  }

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const { data } = await orderAPI.getAllOrders()
      const list = data.orders || data || []
      setOrders(list)
      setStats(s => ({ ...s, orders: list.length }))
    } finally { setLoading(false) }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { data } = await userAPI.getAllUsers()
      const list = data.users || data || []
      setUsers(list)
      setStats(s => ({ ...s, users: list.length }))
    } finally { setLoading(false) }
  }

  const openEdit = (product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name || '',
      price: product.price || '',
      description: product.description || '',
      category: product.category || '',
      stock: product.stock || '',
      sizes: (product.sizes || []).join(', '),
      colors: (product.colors || []).join(', '),
      tags: (product.tags || []).join(', '),
    })
    setImageFile(null)
    setShowProductForm(true)
  }

  const openCreate = () => {
    setEditingProduct(null)
    setProductForm({ name: '', price: '', description: '', category: '', stock: '', sizes: '', colors: '', tags: '' })
    setImageFile(null)
    setShowProductForm(true)
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(productForm).forEach(([k, v]) => {
        if (k === 'sizes' || k === 'colors' || k === 'tags') {
          const arr = v.split(',').map(s => s.trim()).filter(Boolean)
          arr.forEach(item => fd.append(k, item))
        } else {
          fd.append(k, v)
        }
      })
      if (imageFile) fd.append('image', imageFile)

      if (editingProduct) {
        await productAPI.update(editingProduct._id, fd)
        toast.success('Product updated')
      } else {
        await productAPI.create(fd)
        toast.success('Product created')
      }
      setShowProductForm(false)
      fetchProducts()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product')
    } finally { setSubmitting(false) }
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await productAPI.delete(id)
      setProducts(products.filter(p => p._id !== id))
      toast.success('Product deleted')
    } catch { toast.error('Failed to delete') }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('Delete this user?')) return
    try {
      await userAPI.deleteUser(userId)
      setUsers(users.filter(u => u._id !== userId))
      toast.success('User deleted')
    } catch { toast.error('Failed to delete') }
  }

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, { status })
      setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o))
      toast.success('Status updated')
    } catch { toast.error('Failed to update') }
  }

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white border border-obsidian-100 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 ${color} flex items-center justify-center flex-shrink-0`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-mono font-bold text-obsidian-900">{value}</p>
        <p className="text-xs font-mono text-obsidian-400 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  )

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="section-label mb-2">Control Panel</div>
        <h1 className="text-4xl font-display font-bold text-obsidian-900">Admin Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={FiPackage} label="Products" value={stats.products} color="bg-obsidian-900" />
        <StatCard icon={FiShoppingBag} label="Orders" value={stats.orders} color="bg-gold-500" />
        <StatCard icon={FiUsers} label="Users" value={stats.users} color="bg-obsidian-600" />
      </div>

      {/* Tabs */}
      <div className="border-b border-obsidian-200 mb-6">
        <div className="flex gap-0">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-6 py-3 text-sm font-medium font-mono transition-colors border-b-2 ${tab === t
                  ? 'border-obsidian-900 text-obsidian-900'
                  : 'border-transparent text-obsidian-400 hover:text-obsidian-700'
                }`}>{t}</button>
          ))}
        </div>
      </div>

      {/* Products Tab */}
      {tab === 'Products' && (
        <div>
          <div className="flex justify-between items-center mb-5">
            <span className="text-sm text-obsidian-400 font-mono">{products.length} products</span>
            <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5">
              <FiPlus size={14} /> Add Product
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-obsidian-200">
                    {['Product', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-3 text-xs font-mono text-obsidian-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b border-obsidian-50 hover:bg-obsidian-50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images?.[0] || product.image || 'https://placehold.co/40x50/f5f5f0/a8a890'}
                            alt={product.name}
                            className="w-10 h-12 object-cover bg-obsidian-100 flex-shrink-0"
                            onError={(e) => { e.target.src = 'https://placehold.co/40x50/f5f5f0/a8a890' }}
                          />
                          <span className="font-medium text-obsidian-900 line-clamp-1">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-obsidian-500 font-mono text-xs">{product.category || '—'}</td>
                      <td className="py-3 px-3 font-mono font-medium">${product.price?.toFixed(2)}</td>
                      <td className="py-3 px-3">
                        <span className={`badge text-xs ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {product.stock || 0}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(product)}
                            className="text-obsidian-400 hover:text-obsidian-800 transition-colors p-1"><FiEdit size={14} /></button>
                          <button onClick={() => handleDeleteProduct(product._id)}
                            className="text-obsidian-400 hover:text-red-500 transition-colors p-1"><FiTrash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'Orders' && (
        <div className="space-y-4">
          {loading ? <div className="flex justify-center py-10"><Spinner /></div> : (
            orders.length === 0 ? <p className="text-center text-obsidian-400 py-10 font-mono">No orders found</p> :
              orders.map((order) => (
                <div key={order._id} className="bg-white border border-obsidian-100 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-mono text-obsidian-400">#{order._id?.slice(-8).toUpperCase()}</p>
                      <p className="font-medium text-obsidian-900 mt-0.5">
                        {order.user?.name || order.user?.email || 'Customer'}
                      </p>
                      <p className="text-xs text-obsidian-400 font-mono">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono font-semibold text-obsidian-900">${order.totalAmount?.toFixed(2)}</span>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        className={`text-xs font-mono px-3 py-1.5 border border-obsidian-200 cursor-pointer focus:outline-none ${STATUS_COLORS[order.status] || ''}`}
                      >
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* Users Tab */}
      {tab === 'Users' && (
        <div className="overflow-x-auto">
          {loading ? <div className="flex justify-center py-10"><Spinner /></div> : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-obsidian-200">
                  {['Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left py-3 px-3 text-xs font-mono text-obsidian-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-obsidian-50 hover:bg-obsidian-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-obsidian-800 text-cream rounded-full flex items-center justify-center text-xs font-medium">
                          {u.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <span className="font-medium text-obsidian-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-obsidian-500 font-mono text-xs">{u.email}</td>
                    <td className="py-3 px-3">
                      <span className={`badge text-xs ${u.role === 'admin' ? 'bg-gold-100 text-gold-700' : 'bg-obsidian-100 text-obsidian-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-obsidian-400 font-mono text-xs">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3">
                      <button onClick={() => handleDeleteUser(u._id)}
                        className="text-obsidian-300 hover:text-red-500 transition-colors p-1">
                        <FiTrash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Product Form Modal */}
      <AnimatePresence>
        {showProductForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-obsidian-950/60 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowProductForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-cream w-full max-w-xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-obsidian-100 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-obsidian-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setShowProductForm(false)} className="text-obsidian-400 hover:text-obsidian-700">
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="p-6 space-y-4">
                {[
                  { label: 'Product Name', key: 'name', required: true },
                  { label: 'Price ($)', key: 'price', type: 'number', required: true },
                  { label: 'Category', key: 'category' },
                  { label: 'Stock Quantity', key: 'stock', type: 'number' },
                  { label: 'Sizes (comma-separated)', key: 'sizes', placeholder: 'XS, S, M, L, XL' },
                  { label: 'Colors (comma-separated)', key: 'colors', placeholder: 'Black, White, Navy' },
                  { label: 'Tags (comma-separated)', key: 'tags', placeholder: 'casual, summer, new' },
                ].map(({ label, key, type = 'text', required, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-mono text-obsidian-500 mb-1.5 uppercase tracking-wider">{label}</label>
                    <input type={type} required={required} placeholder={placeholder}
                      value={productForm[key]}
                      onChange={(e) => setProductForm({ ...productForm, [key]: e.target.value })}
                      className="input-field text-sm" />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-mono text-obsidian-500 mb-1.5 uppercase tracking-wider">Description</label>
                  <textarea value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    rows={3} className="input-field text-sm resize-none" />
                </div>

                <div>
                  <label className="block text-xs font-mono text-obsidian-500 mb-1.5 uppercase tracking-wider">
                    Product Image {editingProduct && '(Leave empty to keep current)'}
                  </label>
                  <input type="file" accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="text-sm text-obsidian-600 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-obsidian-900 file:text-cream file:text-xs file:cursor-pointer" />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={submitting}
                    className="btn-primary flex items-center gap-2 text-sm py-2.5 flex-1 justify-center">
                    {submitting ? <Spinner size="sm" color="white" /> : <FiCheck size={14} />}
                    {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                  <button type="button" onClick={() => setShowProductForm(false)} className="btn-outline py-2.5 px-5 text-sm">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
