import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { Spinner, EmptyState } from '../components/common/Loading'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi'

export default function CartPage() {
  const { cart, loading, updateItem, removeItem, clearCart } = useCart()
  const navigate = useNavigate()

  const items = cart.items || []
  const subtotal = items.reduce((acc, item) => acc + (item.price || item.product?.price || 0) * item.quantity, 0)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>
  )

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="section-label mb-2">Review Items</div>
        <h1 className="text-4xl font-display font-bold text-obsidian-900">Shopping Cart</h1>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<FiShoppingBag />}
          title="Your cart is empty"
          desc="Add some pieces you love to get started"
          action={<Link to="/products" className="btn-primary inline-block">Continue Shopping</Link>}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-obsidian-100">
              <span className="text-sm font-mono text-obsidian-500">{items.length} item{items.length !== 1 ? 's' : ''}</span>
              <button onClick={clearCart} className="text-sm text-obsidian-400 hover:text-red-500 transition-colors">Clear all</button>
            </div>

            <AnimatePresence>
              {items.map((item) => {
                const product = item.product || item
                const imageUrl = product.images?.[0] || product.image || 'https://placehold.co/100x130/f5f5f0/a8a890?text=Item'
                const price = item.price || product.price || 0

                return (
                  <motion.div
                    key={item._id || item.productId}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-4 p-4 bg-white border border-obsidian-100"
                  >
                    <Link to={`/products/${product._id}`} className="flex-shrink-0">
                      <img src={imageUrl} alt={product.name}
                        className="w-20 h-26 object-cover bg-obsidian-100"
                        style={{ height: '104px' }}
                        onError={(e) => { e.target.src = 'https://placehold.co/100x130/f5f5f0/a8a890?text=Item' }}
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${product._id}`}
                        className="font-medium text-obsidian-900 hover:text-gold-700 transition-colors text-sm line-clamp-1">
                        {product.name}
                      </Link>
                      {item.size && <p className="text-xs text-obsidian-400 font-mono mt-0.5">Size: {item.size}</p>}
                      {item.color && <p className="text-xs text-obsidian-400 font-mono">Color: {item.color}</p>}
                      <p className="text-sm font-mono font-medium text-obsidian-800 mt-1">${price.toFixed(2)}</p>

                      <div className="flex items-center justify-between mt-3">
                        {/* Qty controls */}
                        <div className="flex items-center gap-0 border border-obsidian-200">
                          <button
                            onClick={() => updateItem(product._id, Math.max(1, item.quantity - 1), item.size, item.color)}
                            className="w-8 h-8 text-obsidian-500 hover:bg-obsidian-50 flex items-center justify-center text-base">−</button>
                          <span className="w-8 text-center font-mono text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateItem(product._id, item.quantity + 1, item.size, item.color)}
                            className="w-8 h-8 text-obsidian-500 hover:bg-obsidian-50 flex items-center justify-center text-base">+</button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-s font-mono font-semibold text-obsidian-600">Total Price: ${(price * item.quantity).toFixed(2)}</span>
                        </div>
                        <button
                            onClick={() => removeItem(product._id, item.size, item.color)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium 
                                      text-white bg-red-600 rounded hover:bg-red-700 
                                      transition-colors">
                            <FiTrash2 size={16} />Delete</button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-obsidian-950 p-6 text-cream sticky top-24">
              <h2 className="font-display text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm font-mono">
                <div className="flex justify-between text-obsidian-300">
                  <span>Subtotal ({items.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-obsidian-300">
                  <span>Shipping</span>
                  <span>{subtotal > 75 ? 'FREE' : '$8.00'}</span>
                </div>
                {subtotal > 75 && (
                  <div className="text-xs text-gold-400 flex items-center gap-1">✓ You qualify for free shipping</div>
                )}
                <div className="border-t border-obsidian-700 pt-3 flex justify-between font-semibold text-base text-cream">
                  <span>Total</span>
                  <span>${(subtotal + (subtotal > 75 ? 0 : 8)).toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="btn-gold w-full mt-6 flex items-center justify-center gap-2 text-sm py-4"
              >
                Proceed to Checkout <FiArrowRight size={16} />
              </button>
              <Link to="/products" className="block text-center text-obsidian-400 text-xs mt-4 hover:text-obsidian-200 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
