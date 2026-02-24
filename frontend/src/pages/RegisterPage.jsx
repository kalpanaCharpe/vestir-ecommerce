import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Spinner } from '../components/common/Loading'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    const result = await register({ name: form.name, email: form.email, password: form.password })
    if (result.success) navigate('/')
    else setError(result.message)
  }

  return (
    <div className="min-h-screen flex">

      <div className="hidden lg:flex w-1/2 relative">
        {/* Background image */}
        <img
          src="https://plus.unsplash.com/premium_photo-1664202526047-405824c633e7?w=1200&auto=format&fit=crop&q=60"
          alt="Fashion store"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Optional overlay for readability */}
        <div className="absolute inset-0 bg-obsidian-950/70" />

        {/* Text content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <div className="max-w-md text-center space-y-6">
            <div className="font-display text-5xl font-bold text-cream tracking-[0.15em]">
              VESTIR
            </div>
            <div className="w-12 h-0.5 bg-gold-500 mx-auto" />
            <p className="text-cream leading-relaxed text-s">
              Join thousands of fashion-forward individuals who choose quality over quantity.
            </p>
            {/* <div className="flex justify-center gap-6 text-center">
              {[['2K+', 'Members'], ['500+', 'Products'], ['Free', 'Returns']].map(([n, l]) => (
                <div key={l}>
                  <div className="text-xl font-display font-bold text-cream">{n}</div>
                  <div className="text-xs font-mono text-gold-500">{l}</div>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>

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
            <div className="section-label mb-2">Get started</div>
            <h1 className="text-3xl font-display font-bold text-obsidian-900">Create Account</h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-6 font-mono">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Jane Doe' },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-mono text-obsidian-600 mb-1.5 uppercase tracking-wider">{label}</label>
                <input type={type} required value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder} className="input-field" />
              </div>
            ))}

            {['password', 'confirm'].map((key) => (
              <div key={key}>
                <label className="block text-xs font-mono text-obsidian-600 mb-1.5 uppercase tracking-wider">
                  {key === 'password' ? 'Password' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} required
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder="••••••••" className="input-field pr-10" />
                  {key === 'password' && (
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-400 hover:text-obsidian-700">
                      {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 mt-2">
              {loading && <Spinner size="sm" color="white" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-obsidian-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-obsidian-900 font-medium hover:text-gold-600 transition-colors">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
