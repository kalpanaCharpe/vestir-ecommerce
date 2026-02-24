import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { FiShoppingBag, FiUser, FiMenu, FiX, FiChevronDown, FiSettings } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setUserMenuOpen(false)
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-cream/95 backdrop-blur-md shadow-sm border-b border-obsidian-100' : 'bg-cream/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-display text-3xl font-bold tracking-[0.15em] text-obsidian-900 hover:text-gold-600 transition-colors">
            VESTIR
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) =>
                  `text-s font-body font-medium tracking-wide transition-colors ${
                    isActive ? 'text-obsidian-900 border-b border-obsidian-900' : 'text-obsidian-700 hover:text-obsidian-900'
                  }`
                }>{label}</NavLink>
            ))}
            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) =>
                `text-sm font-body font-medium tracking-wide transition-colors ${
                  isActive ? 'text-gold-600' : 'text-gold-500 hover:text-gold-700'
                }`}>Dashboard</NavLink>
            )}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-obsidian-600 hover:text-obsidian-900 transition-colors">
              <FiShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gold-500 text-white text-xs font-mono w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 p-2 text-obsidian-600 hover:text-obsidian-900 transition-colors"
                >
                  <div className="w-7 h-7 bg-obsidian-900 text-cream rounded-full flex items-center justify-center text-xs font-medium">
                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <FiChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-1 w-52 bg-white border border-obsidian-100 shadow-lg py-1 z-50"
                    >
                      <div className="px-4 py-2 border-b border-obsidian-100">
                        <p className="text-sm font-medium text-obsidian-900">{user.name}</p>
                        <p className="text-xs text-obsidian-400 truncate">{user.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-obsidian-700 hover:bg-obsidian-50 transition-colors">
                        <FiUser size={14} /> Profile
                      </Link>
                      <Link to="/orders" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-obsidian-700 hover:bg-obsidian-50 transition-colors">
                        <FiShoppingBag size={14} /> My Orders
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gold-600 hover:bg-gold-50 transition-colors">
                          <FiSettings size={14} /> Admin Dashboard
                        </Link>
                      )}
                      <div className="border-t border-obsidian-100 mt-1">
                        <button onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-obsidian-500 hover:text-obsidian-900 hover:bg-obsidian-50 transition-colors">
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-s">Sign in</Link>
                <Link to="/register" className="btn-primary text-xs py-2 px-4">Register</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button className="md:hidden p-2 text-obsidian-600" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-cream border-t border-obsidian-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(({ to, label }) => (
                <Link key={to} to={to} onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm font-medium text-obsidian-700 hover:text-obsidian-900">
                  {label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-obsidian-700">Profile</Link>
                  <Link to="/orders" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-obsidian-700">Orders</Link>
                  {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gold-600">Admin</Link>}
                  <button onClick={() => { handleLogout(); setMobileOpen(false) }}
                    className="block w-full text-left py-2 text-sm text-obsidian-500">Sign out</button>
                </>
              ) : (
                <div className="flex gap-3 pt-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline py-2 px-4 text-xs flex-1 text-center">Sign in</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary py-2 px-4 text-xs flex-1 text-center">Join</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
