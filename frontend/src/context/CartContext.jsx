import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { cartAPI } from '../api'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [], total: 0 }); return }
    setLoading(true)
    try {
      const { data } = await cartAPI.get()
      setCart(data)
    } catch { setCart({ items: [], total: 0 }) }
    finally { setLoading(false) }
  }, [user])

  useEffect(() => { fetchCart() }, [fetchCart])

  const addItem = async (productId, quantity = 1, size, color) => {
    try {
      const { data } = await cartAPI.add({ productId, quantity, size, color })
      setCart(data)
      toast.success('Added to cart')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add item')
    }
  }

  const updateItem = async (productId, quantity, size, color) => {
    try {
      const { data } = await cartAPI.update({ productId, quantity, size, color })
      setCart(data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update cart')
    }
  }

  const removeItem = async (productId, size, color) => {
    try {
      const { data } = await cartAPI.remove({ productId, size, color })
      setCart(data)
      toast.success('Item removed')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove item')
    }
  }

  const clearCart = async () => {
    try {
      await cartAPI.clear()
      setCart({ items: [], total: 0 })
    } catch {}
  }

  const itemCount = cart.items?.reduce((acc, i) => acc + i.quantity, 0) || 0

  return (
    <CartContext.Provider value={{ cart, loading, addItem, updateItem, removeItem, clearCart, fetchCart, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
