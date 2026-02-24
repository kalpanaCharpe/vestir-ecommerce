import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { productAPI } from '../api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Spinner } from '../components/common/Loading'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiShoppingBag, FiHeart } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    productAPI.getOne(id).then(({ data }) => {
      setProduct(data)
      if (data.sizes?.[0]) setSelectedSize(data.sizes[0])
      if (data.colors?.[0]) setSelectedColor(data.colors[0])
    }).catch(() => navigate('/products'))
    .finally(() => setLoading(false))
  }, [id, navigate])

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return }
    setAdding(true)
    await addItem(product, quantity, selectedSize, selectedColor)
    setAdding(false)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )

  if (!product) return null

  const images = product.images?.length ? product.images : [product.image || 'https://th.bing.com/th/id/OIP.vR43xivJc6INNyeRAX7DvgHaEJ?w=325&h=183&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3']

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/products" className="inline-flex items-center gap-2 text-sm text-obsidian-400 hover:text-obsidian-900 transition-colors mb-8">
        <FiArrowLeft size={14} /> Back to products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-[3/4] overflow-hidden bg-obsidian-100">
            <motion.img
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://placehold.co/600x700/f5f5f0/a8a890?text=No+Image' }}
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-20 overflow-hidden border-2 transition-colors ${i === selectedImage ? 'border-obsidian-900' : 'border-transparent hover:border-obsidian-200'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://placehold.co/80x100/f5f5f0/a8a890' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          {product.category && (
            <p className="section-label">{product.category}</p>
          )}
          <h1 className="text-4xl font-display font-bold text-obsidian-900 leading-tight">{product.name}</h1>
          <div className="text-3xl font-mono font-medium text-obsidian-800">${product.price?.toFixed(2)}</div>

          {product.description && (
            <p className="text-obsidian-500 leading-relaxed text-sm">{product.description}</p>
          )}

          {/* Stock status */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-400'}`} />
            <span className="text-sm font-mono text-obsidian-500">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div>
              <label className="section-label block mb-2">Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-[42px] h-10 px-3 text-sm font-mono border transition-colors ${
                      selectedSize === s
                        ? 'border-obsidian-900 bg-obsidian-900 text-cream'
                        : 'border-obsidian-200 text-obsidian-700 hover:border-obsidian-500'
                    }`}
                  >{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div>
              <label className="section-label block mb-2">Color — <span className="normal-case font-body text-obsidian-600">{selectedColor}</span></label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1 text-xs border transition-colors ${
                      selectedColor === c
                        ? 'border-obsidian-900 bg-obsidian-900 text-cream'
                        : 'border-obsidian-200 text-obsidian-600 hover:border-obsidian-400'
                    }`}
                  >{c}</button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="section-label block mb-2">Quantity</label>
            <div className="flex items-center gap-0 border border-obsidian-200 w-fit">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 text-obsidian-600 hover:bg-obsidian-100 transition-colors flex items-center justify-center text-lg">−</button>
              <span className="w-12 text-center font-mono text-sm">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                className="w-10 h-10 text-obsidian-600 hover:bg-obsidian-100 transition-colors flex items-center justify-center text-lg">+</button>
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="btn-primary flex-1 flex items-center justify-center gap-2 py-4"
            >
              {adding ? <Spinner size="sm" color="white" /> : <FiShoppingBag size={16} />}
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button className="btn-outline py-4 px-4">
              <FiHeart size={18} />
            </button>
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {product.tags.map((tag) => (
                <span key={tag} className="badge bg-obsidian-100 text-obsidian-500 text-xs">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
