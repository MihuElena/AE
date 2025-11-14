// client/src/pages/CartPage.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCart, updateCartItem, deleteCartItem, clearCart } from '../store/slices/cartSlice'

export default function CartPage() {
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector((state) => state.cart)
  console.log('REDUX CART ITEMS:', items)
  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

  const handleQuantityChange = (item, newQuantity) => {
    const q = parseInt(newQuantity, 10)
    if (isNaN(q) || q < 1) return
    dispatch(updateCartItem({ id: item.id, quantity: q }))
  }

  const handleDeleteItem = (id) => {
    dispatch(deleteCartItem(id))
  }

  const handleClearCart = () => {
    dispatch(clearCart())
  }

  const total = items.reduce((sum, item) => {
    const price = item.Product?.price || 0
    return sum + price * item.quantity
  }, 0)

  if (loading) {
    return <div className="p-4 text-white">Loading cart...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {items.length === 0 ? (
        <p className="text-gray-300">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4 mb-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-gray-800 rounded-lg p-3"
              >
                <div>
                  <div className="font-semibold">
                    {item.Product?.name || 'Unknown product'}
                  </div>
                  <div className="text-sm text-gray-400">
                    Price: {item.Product?.price?.toFixed(2) ?? '0.00'} USD
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    className="w-16 rounded-md bg-gray-700 border border-gray-600 px-2 py-1 text-white"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item, e.target.value)}
                  />
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-gray-700 pt-4">
            <div className="text-lg font-semibold">
              Total: <span className="text-indigo-400">{total.toFixed(2)} USD</span>
            </div>
            <button
              onClick={handleClearCart}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
            >
              Clear cart
            </button>
          </div>
        </>
      )}
    </div>
  )
}
