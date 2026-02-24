import { Link } from 'react-router-dom'
import { FiInstagram, FiTwitter, FiMail, FiPhone } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-obsidian-950 text-obsidian-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="font-display text-3xl font-bold text-cream tracking-[0.15em] mb-4">VESTIR</div>
            <p className="text-sm text-obsidian-400 leading-relaxed max-w-xs">
              Curated fashion for the discerning individual. Quality, craftsmanship, and timeless style.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {[FiInstagram, FiTwitter, FiMail].map((Icon, i) => (
                <button key={i} className="text-obsidian-400 hover:text-cream transition-colors p-1">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <div className="section-label text-obsidian-500 mb-4">Shop</div>
            <div className="space-y-2">
              {[['All Products', '/products'], ['New Arrivals', '/products?sort=newest'], ['Sale', '/products?sale=true']].map(([label, to]) => (
                <Link key={to} to={to} className="block text-sm text-obsidian-400 hover:text-cream transition-colors">{label}</Link>
              ))}
            </div>
          </div>

          {/* Account */}
          <div>
            <div className="section-label text-obsidian-500 mb-4">Account</div>
            <div className="space-y-2">
              {[['My Profile', '/profile'], ['Orders', '/orders'], ['Cart', '/cart']].map(([label, to]) => (
                <Link key={to} to={to} className="block text-sm text-obsidian-400 hover:text-cream transition-colors">{label}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="section-label text-obsidian-500 mb-4">Contact</div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-obsidian-400 hover:text-cream transition-colors">
                <FiMail size={16} /> <span>support@vestir.com</span>
              </div>
              <div className="flex items-center gap-2 text-obsidian-400 hover:text-cream transition-colors">
                <FiPhone size={16} /> <span>+1 (555) 123‑4567</span>
              </div>
              <p className="text-xs text-obsidian-500 mt-2">
                123 Fashion Street, New York, NY
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-obsidian-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-obsidian-600 font-mono">© {new Date().getFullYear()} VESTIR. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service'].map((item) => (
              <span key={item} className="text-xs text-obsidian-600 hover:text-obsidian-400 cursor-pointer transition-colors">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}