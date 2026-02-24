import { useState, useEffect } from 'react'
import { orderAPI } from '../api'
import { Spinner, EmptyState } from '../components/common/Loading'
import { FiPackage, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  const fetchOrders = async () => {
    try {
      const { data } = await orderAPI.getUserOrders()
      setOrders(data.orders || data || [])
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const handleDelete = async (orderId) => {
    toast((t) => (
      <div className="flex items-center gap-3">
        <span>Delete this order?</span>
        <button
          onClick={async () => {
            try {
              await orderAPI.deleteOrder(orderId)
              setOrders(orders.filter(o => o._id !== orderId))
              toast.dismiss(t.id)
              toast.success('Order deleted')
            } catch (err) {
              toast.error(err.response?.data?.message || 'Failed to delete order')
            }
          }}
          className="px-3 py-1 bg-red-600 text-white rounded"
        >
          Yes
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1 bg-gray-300 text-black rounded"
        >
          No
        </button>
      </div>
    ))
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="section-label mb-2">History</div>
        <h1 className="text-4xl font-display font-bold text-obsidian-900">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={<FiPackage />}
          title="No orders yet"
          desc="Once you place an order, it will appear here"
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div key={order._id} layout className="bg-white border border-obsidian-100">
              {/* Order header */}
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      {/* <span className="text-xs font-mono text-obsidian-400">
                        #{order._id?.slice(-8).toUpperCase()}
                      </span> */}
                      <span>
                        {/* ✅ Show product name */}
                        {order.products?.[0]?.product?.name && (
                          <p className="text-sm font-semibold text-obsidian-900 mt-1">
                            {order.products[0].product.name}
                          </p>
                        )}
                      </span>
                      <span className={`badge text-xs ${STATUS_COLORS[order.status?.toLowerCase()] || 'bg-obsidian-100 text-obsidian-600'}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-obsidian-400 font-mono">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-mono font-semibold text-obsidian-900">
                        ${order.totalPrice?.toFixed(2)}
                      </div>
                      <div className="text-xs text-obsidian-400">
                        {order.products?.length || 0} item{(order.products?.length || 0) !== 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* ✅ Square delete button
                    {order.status?.toLowerCase() === 'pending' && (
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="px-4 py-2 flex items-center gap-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors rounded-sm"
                      >
                        <FiTrash2 Delete size={16} />
                        Delete
                      </button>
                    )} */}

                    <button
                      onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                      className="text-obsidian-400 hover:text-obsidian-700 p-1 transition-colors"
                    >
                      {expandedId === order._id ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded items */}
              <AnimatePresence>
                {expandedId === order._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-obsidian-100"
                  >
                    <div className="p-4 sm:p-5 space-y-3 bg-obsidian-50">
                      {(order.products || []).map((item, i) => {
                        const product = item.product
                        const imageUrl = product.images?.[0] || product.image || 'https://placehold.co/60x80/f5f5f0/a8a890'
                        const price = item.price || product.price || 0
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <img
                              src={imageUrl}
                              alt={product.name || 'Product'}
                              className="w-12 h-16 object-cover bg-obsidian-100 flex-shrink-0"
                              onError={(e) => { e.target.src = 'https://placehold.co/60x80/f5f5f0/a8a890' }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-obsidian-900 line-clamp-1">
                                {product.name || 'Product'}
                              </p>
                              {item.size && (
                                <p className="text-xs text-obsidian-400 font-mono">Size: {item.size}</p>
                              )}
                              <p className="text-xs text-obsidian-400 font-mono">
                                Qty: {item.quantity} × ${price.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-sm font-mono font-medium text-obsidian-800">
                              ${(price * item.quantity).toFixed(2)}
                            </div>

                            {order.status?.toLowerCase() === 'pending' && (
                              <button
                                onClick={() => handleDelete(order._id)}
                                className="px-4 py-2 flex items-center gap-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors rounded-sm"
                              >
                                <FiTrash2 Delete size={16} />
                                Delete
                              </button>
                            )}


                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}