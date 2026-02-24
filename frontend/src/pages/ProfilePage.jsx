import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { userAPI } from '../api'
import { Spinner } from '../components/common/Loading'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiEdit3, FiTrash2, FiSave } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', password: '' })

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { name: form.name, email: form.email }
      if (form.password) payload.password = form.password
      const { data } = await userAPI.updateProfile(payload)
      updateUser(data.user || data)
      setEditing(false)
      setForm(f => ({ ...f, password: '' }))
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('This will permanently delete your account. Continue?')) return
    try {
      await userAPI.deleteProfile()
      await logout()
      navigate('/')
      toast.success('Account deleted')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account')
    }
  }

  return (
    <div className="page-enter max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="section-label mb-2">Account</div>
        <h1 className="text-4xl font-display font-bold text-obsidian-900">My Profile</h1>
      </div>

      {/* Avatar section */}
      <div className="flex items-center gap-5 mb-8 p-6 bg-white border border-obsidian-100">
        <div className="w-16 h-16 bg-obsidian-900 text-cream rounded-full flex items-center justify-center text-2xl font-display font-bold flex-shrink-0">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <h2 className="text-xl font-display font-semibold text-obsidian-900">{user?.name}</h2>
          <p className="text-sm text-obsidian-400 font-mono">{user?.email}</p>
          {user?.role === 'admin' && (
            <span className="badge bg-gold-100 text-gold-700 mt-1">Admin</span>
          )}
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-white border border-obsidian-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-obsidian-900">Personal Information</h2>
          {!editing && (
            <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-sm text-obsidian-500 hover:text-obsidian-900 transition-colors">
              <FiEdit3 size={14} /> Edit
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            {[
              { label: 'Full Name', key: 'name', type: 'text', icon: FiUser },
              { label: 'Email Address', key: 'email', type: 'email', icon: FiMail },
            ].map(({ label, key, type, icon: Icon }) => (
              <div key={key}>
                <label className="block text-xs font-mono text-obsidian-500 mb-1.5 uppercase tracking-wider">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-300" size={15} />
                  <input type={type} value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="input-field pl-9" required />
                </div>
              </div>
            ))}
            <div>
              <label className="block text-xs font-mono text-obsidian-500 mb-1.5 uppercase tracking-wider">New Password <span className="normal-case">(leave blank to keep current)</span></label>
              <input type="password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••" className="input-field" minLength={6} />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5">
                {loading ? <Spinner size="sm" color="white" /> : <FiSave size={14} />}
                Save Changes
              </button>
              <button type="button" onClick={() => setEditing(false)} className="btn-ghost">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {[['Name', user?.name], ['Email', user?.email], ['Member since', new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })]].map(([label, value]) => (
              <div key={label} className="flex items-center gap-4 py-2 border-b border-obsidian-50 last:border-0">
                <span className="text-xs font-mono text-obsidian-400 uppercase tracking-wider w-28 flex-shrink-0">{label}</span>
                <span className="text-sm text-obsidian-800">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div className="border border-red-100 p-6 bg-red-50">
        <h2 className="font-display text-lg font-semibold text-red-900 mb-2">Danger Zone</h2>
        <p className="text-sm text-red-600 mb-4">Permanently delete your account and all associated data. This cannot be undone.</p>
        <button onClick={handleDelete}
          className="flex items-center gap-2 text-sm bg-red-600 text-white px-5 py-2.5 hover:bg-red-700 transition-colors">
          <FiTrash2 size={14} /> Delete Account
        </button>
      </div>
    </div>
  )
}
