import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productAPI } from '../api'
import ProductCard from '../components/common/ProductCard'
import { SkeletonCard } from '../components/common/Loading'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { FiTruck, FiRotateCcw, FiLock, FiStar } from "react-icons/fi";

const CATEGORIES = ['All', 'Men', 'Women', 'Kids']

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productAPI.getAll({ limit: 8 })
      .then(({ data }) => {
        setProducts(data.products || data || [])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page-enter">

      {/* HERO */}
      <section
        className="relative min-h-[90vh] overflow-hidden"
        style={{
          backgroundImage: "url('https://png.pngtree.com/background/20230519/original/pngtree-store-with-hanging-clothing-in-a-high-end-environment-picture-image_2654941.jpg')",
          // backgroundImage: "url('')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* overlay for readability */}
        <div className="absolute inset-0 bg-obsidian-950/60" />

        {/* CONTENT */}
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <p className="section-label text-gold-500 mb-2 tracking-widest">
              New Collection 2026
            </p>

            <h2 className="text-6xl sm:text-7xl lg:text-8xl font-display font-bold text-cream leading-[0.92] tracking-tight mb-6">
              Wear<br />
              <span className="text-gold-400 italic">Your</span><br />
              Story
            </h2>

            <p className="text-cream text-base leading-relaxed mb-8">
              Thoughtfully curated pieces that speak to your individuality.
              Premium fabrics, timeless silhouettes, and contemporary edge.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link
                to="/products"
                className="btn-gold inline-flex items-center gap-2 text-sm py-3.5 px-7"
              >
                Shop Collection <FiArrowRight size={16} />
              </Link>

              <Link
                to="/products?sort=newest"
                className="btn-outline border-cream text-cream hover:bg-obsidian-800 hover:text-gold-400 inline-flex items-center gap-2 text-sm py-3.5 px-7"
              >
                New Arrivals
              </Link>
            </div>

            {/* stats */}
            {/* <div className="flex gap-10 pt-6 border-t border-cream/30">
              {[['2K+', 'Styles'], ['50+', 'Brands'], ['4.9', 'Rating']].map(([num, label]) => (
                <div key={label}>
                  <div className="text-2xl font-display font-bold text-cream">{num}</div>
                  <div className="text-xs font-mono text-cream/70 mt-1">{label}</div>
                </div>
              ))}
            </div> */}
          </motion.div>
        </div>
      </section>



      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="section-label mb-2">Curated Picks</div>
            <h2 className="text-4xl font-display font-bold text-obsidian-900">
              Featured Pieces
            </h2>
          </div>

          <Link
            to="/products"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-obsidian-500 hover:text-obsidian-900 transition-colors"
          >
            View all <FiArrowRight size={16} />
          </Link>
        </div>

        {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((p) => <ProductCard key={p._id} product={p} />)
          }
        </div> */}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) // show 4 skeletons
            : products.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />) // show only 4 products
          }
        </div>


        <div className="flex justify-center mt-10">
          <Link to="/products" className="btn-outline">
            Explore All Products
          </Link>
        </div>
      </section>


      {/* About */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* IMAGE LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-lg"
        >
          <img
            src="https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmFzaGlvbiUyMHN0b3JlfGVufDB8fDB8fHww"
            alt="Our Story"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* TEXT RIGHT */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-4xl font-display font-bold text-obsidian-900">
            Our Story
          </h2>
          <p className="text-obsidian-600 leading-relaxed">
            Born from a passion for timeless design and premium craftsmanship,
            our brand is more than just clothing—it’s a statement of individuality.
            Every piece is thoughtfully curated to help you express your unique
            story, blending modern aesthetics with heritage-inspired details.
          </p>
          <p className="text-obsidian-600 leading-relaxed">
            From sustainable fabrics to ethical production, we believe fashion
            should empower both the wearer and the world around them. Step into
            our journey and discover how style meets purpose.
          </p>
          <button className="btn-gold px-6 py-3 text-sm">
            Learn More
          </button>
        </motion.div>
      </section>


      {/* VALUE PROPS */}
      <section className="bg-obsidian-50 border-y border-obsidian-100 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { title: 'Free Shipping', desc: 'On orders over $75', icon: FiTruck },
            { title: 'Easy Returns', desc: '30-day return policy', icon: FiRotateCcw },
            { title: 'Secure Payment', desc: 'SSL encrypted checkout', icon: FiLock },
            { title: 'Premium Quality', desc: 'Curated with care', icon: FiStar },
          ].map(({ title, desc, icon: Icon }) => (
            <div key={title} className="space-y-2">
              <Icon className="w-8 h-8 text-gold-500 mx-auto" />
              <h3 className="font-display font-semibold text-obsidian-900">{title}</h3>
              <p className="text-xs text-obsidian-500 font-mono">{desc}</p>
            </div>
          ))}
        </div>
      </section>


    </div>
  )
}