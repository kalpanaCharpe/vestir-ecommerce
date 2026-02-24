import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Spinner } from '../components/common/Loading'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const result = await login(form)
    if (result.success) navigate(from, { replace: true })
    else setError(result.message)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 relative">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fENsb3RoaW5nJTIwc3RvcmV8ZW58MHx8MHx8fDA%3D"
          alt="img"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay (optional dark tint for readability) */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Text content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center space-y-6">
          <div className="font-display text-5xl font-bold text-white tracking-[0.15em]">
            VESTIR
          </div>
          <div className="w-12 h-0.5 bg-gold-500 mx-auto" />
          <p className="text-cream leading-relaxed text-s">
            "Style is a way to say who you are without having to speak."
          </p>
          <p className="text-black-500 text-s font-mono">— Rachel Zoe</p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-cream">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden text-center mb-8">
            <div className="font-display text-3xl font-bold text-obsidian-900 tracking-widest">VESTIR</div>
          </div>

          <div className="mb-8">
            <div className="section-label mb-2">Welcome back</div>
            <h1 className="text-3xl font-display font-bold text-obsidian-900">Sign In</h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-6 font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-obsidian-700 mb-1.5 uppercase tracking-wider">Email</label>
              <input
                type="email" required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-obsidian-700 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-400 hover:text-obsidian-700 transition-colors">
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
              {loading && <Spinner size="sm" color="white" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-obsidian-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-obsidian-900 font-medium hover:text-gold-600 transition-colors">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
