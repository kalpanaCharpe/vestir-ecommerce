import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="font-display text-[10rem] font-bold text-obsidian-100 leading-none select-none">
          404
        </div>
        <div className="-mt-8">
          <div className="section-label mb-3">Page not found</div>
          <h1 className="text-3xl font-display font-bold text-obsidian-900">Looks like you're lost</h1>
          <p className="text-sm text-obsidian-400 mt-2">The page you're looking for doesn't exist or has been moved.</p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="btn-primary px-8">Go Home</Link>
          <Link to="/products" className="btn-outline px-8">Browse Products</Link>
        </div>
      </motion.div>
    </div>
  )
}
