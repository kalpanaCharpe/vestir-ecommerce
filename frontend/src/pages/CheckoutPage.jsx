import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { orderAPI } from '../api'
import { useCart } from '../context/CartContext'
import { Spinner } from '../components/common/Loading'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FiCheck } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

export default function CheckoutPage() {
  const { user } = useAuth()
  const { cart, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [placed, setPlaced] = useState(false)

  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    paymentMethod: 'COD',
  })

  const items = cart.items || []
  const subtotal = items.reduce((acc, item) => acc + (item.price || item.product?.price || 0) * item.quantity, 0)
  const shipping = subtotal > 75 ? 0 : 8
  const total = subtotal + shipping

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items.length === 0) { toast.error('Your cart is empty'); return }
    setLoading(true)
    try {
      await orderAPI.place({
        shippingAddress: {
          fullName: form.fullName,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
        },
        paymentMethod: form.paymentMethod,
        totalAmount: total,
      })
      await clearCart()
      setPlaced(true)
      toast.success('Order placed successfully!')
      setTimeout(() => navigate('/orders'), 3000)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ label, name, type = 'text', required, placeholder, half }) => (
    <div className={half ? '' : 'col-span-2'}>
      <label className="block text-xs font-mono text-obsidian-500 mb-1 uppercase tracking-wider">{label}</label>
      <input
        type={type} name={name} value={form[name]}
        onChange={handleChange} required={required}
        placeholder={placeholder}
        className="input-field text-sm"
      />
    </div>
  )

  if (placed) return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center space-y-4 max-w-sm mx-auto px-6"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <FiCheck size={28} className="text-green-600" />
        </div>
        <h2 className="text-3xl font-display font-bold text-obsidian-900">Order Placed!</h2>
        <p className="text-sm text-obsidian-500">Thank you for your purchase. Redirecting to your orders...</p>
        <div className="flex justify-center"><Spinner /></div>
      </motion.div>
    </div>
  )

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="section-label mb-2">Final Step</div>
        <h1 className="text-4xl font-display font-bold text-obsidian-900">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact */}
          <div>
            <h2 className="font-display text-xl font-semibold text-obsidian-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full Name" name="fullName" required placeholder="Jane Doe" />
              <Field label="Email" name="email" type="email" required placeholder="jane@example.com" />
            </div>
          </div>

          {/* Shipping */}
          <div>
            <h2 className="font-display text-xl font-semibold text-obsidian-900 mb-4">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Street Address" name="address" required placeholder="123 Main St" />
              <Field label="City" name="city" required placeholder="New York" half />
              <Field label="State" name="state" required placeholder="NY" half />
              <Field label="ZIP Code" name="zip" required placeholder="10001" half />
              <div>
                <label className="block text-xs font-mono text-obsidian-500 mb-1 uppercase tracking-wider">Country</label>
                <select name="country" value={form.country} onChange={handleChange} className="input-field text-sm">
                  <option value="US">United States</option>
                  <option value="IN">India</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div>
            <h2 className="font-display text-xl font-semibold text-obsidian-900 mb-4">Payment Method</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['COD', 'Credit Card', 'PayPal'].map((method) => (
                <label key={method}
                  className={`border p-3 cursor-pointer transition-colors text-sm font-mono text-center ${
                    form.paymentMethod === method
                      ? 'border-obsidian-900 bg-obsidian-900 text-cream'
                      : 'border-obsidian-200 text-obsidian-600 hover:border-obsidian-400'
                  }`}>
                  <input type="radio" name="paymentMethod" value={method}
                    checked={form.paymentMethod === method}
                    onChange={handleChange} className="sr-only" />
                  {method === 'COD' ? 'Cash on Delivery' : method}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-obsidian-950 p-6 text-cream sticky top-24">
            <h2 className="font-display text-xl font-semibold mb-5">Order Summary</h2>
            <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
              {items.map((item) => {
                const product = item.product || item
                const price = item.price || product.price || 0
                return (
                  <div key={item._id || item.productId} className="flex justify-between text-sm text-obsidian-300">
                    <span className="line-clamp-1 flex-1 pr-2">{product.name} × {item.quantity}</span>
                    <span className="font-mono">${(price * item.quantity).toFixed(2)}</span>
                  </div>
                )
              })}
            </div>
            <div className="border-t border-obsidian-700 pt-4 space-y-2 font-mono text-sm">
              <div className="flex justify-between text-obsidian-300">
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-obsidian-300">
                <span>Shipping</span><span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-semibold text-base text-cream border-t border-obsidian-700 pt-2">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full mt-6 flex items-center justify-center gap-2 text-sm py-4"
            >
              {loading ? <Spinner size="sm" color="white" /> : null}
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
