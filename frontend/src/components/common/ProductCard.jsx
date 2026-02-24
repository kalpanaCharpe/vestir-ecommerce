import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { FiShoppingBag, FiEye } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    await addItem(product, 1)
  }

  const price = product.price?.toFixed(2)
  const imageUrl = product.images?.[0] || product.image || 'https://placehold.co/400x500/f5f5f0/a8a890?text=No+Image'

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="product-card group cursor-pointer"
    >
      <Link to={`/products/${product._id}`} className="block">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[3/4] bg-obsidian-100">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => { e.target.src = 'https://placehold.co/400x500/f5f5f0/a8a890?text=No+Image' }}
          />
          {/* Overlay */}
          <div className="product-image-overlay">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className="bg-cream text-obsidian-900 p-3 hover:bg-obsidian-900 hover:text-cream transition-colors"
                title="Add to cart"
              >
                <FiShoppingBag size={16} />
              </button>
              <Link to={`/products/${product._id}`}
                className="bg-cream text-obsidian-900 p-3 hover:bg-obsidian-900 hover:text-cream transition-colors"
                onClick={e => e.stopPropagation()}
                title="View product">
                <FiEye size={16} />
              </Link>
            </div>
          </div>
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.isNew && (
              <span className="badge bg-obsidian-900 text-cream text-[10px]">NEW</span>
            )}
            {product.stock === 0 && (
              <span className="badge bg-obsidian-400 text-cream text-[10px]">SOLD OUT</span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-3 space-y-1">
          {product.category && (
            <p className="text-[10px] font-mono tracking-widest text-obsidian-400 uppercase">{product.category}</p>
          )}
          <h3 className="text-sm font-body font-medium text-obsidian-900 line-clamp-1 group-hover:text-gold-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm font-mono font-medium text-obsidian-800">${price}</p>
        </div>
      </Link>
    </motion.div>
  )
}
