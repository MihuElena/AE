import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCart, updateCartItem, deleteCartItem, clearCart } from '../store/slices/cartSlice'

export default function CartPage() {
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector((state) => state.cart)

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
  <div className="relative w-full min-h-screen flex justify-center items-start bg-cover bg-center bg-fixed py-20"
    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1543422655-cb586ad21df1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
  >
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-none"></div>

    <div className="relative z-10 w-full max-w-2xl px-4">
      <h1 className="text-4xl font-serif font-bold text-white text-center mb-10">Your Cart</h1>

      {items.length === 0 ? (
        <p className="text-gray-300 text-center text-lg">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row justify-between items-center bg-white/20 backdrop-blur-md rounded-xl p-5 shadow-lg">
              <div className="text-center sm:text-left mb-3 sm:mb-0">
                <div className="font-semibold text-white text-lg">{item.Product?.name || 'Unknown product'}</div>
                <div className="text-gray-200 text-sm">Price: ${item.Product?.price?.toFixed(2) ?? '0.00'} USD</div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  className="w-16 rounded-md bg-gray-700 border border-gray-600 px-2 py-1 text-white text-center"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item, e.target.value)}
                />
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row justify-between items-center bg-white/20 backdrop-blur-md rounded-xl p-5 shadow-lg">
            <div className="text-xl font-semibold text-white mb-3 sm:mb-0 text-center sm:text-left">
              Total: <span className="text-indigo-300">${total.toFixed(2)} USD</span>
            </div>
            <button
              onClick={handleClearCart}
              className="rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-6 py-2 text-white font-semibold hover:from-red-400 hover:to-pink-400 transition-all duration-300"
            >
              Clear cart
            </button>
          </div>
        </div>
      )}
    </div>

    {/* Scrollbar styling */}
    <style>
      {`
        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
        }
        ::-webkit-scrollbar-thumb {
          background-color: rgba(255,255,255,0.3);
          border-radius: 10px;
        }
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.3) rgba(255,255,255,0.05);
        }
      `}
    </style>
  </div>
);

}
