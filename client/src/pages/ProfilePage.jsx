import { useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'

export default function ProfilePage() {

  const currentUser = useSelector((state) => state.user.user)

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    shippingAddress: '',
    billingAddress: '',
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
  e.preventDefault()

  setLoading(true)

  setTimeout(() => {
    toast.success('Profile updated successfully')
    setLoading(false)
  }, 800)
}

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center px-4 py-16"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070&auto=format&fit=crop')",
      }}
    >

      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/10">

        <h1 className="text-4xl font-serif text-white mb-8 text-center tracking-wide">
          My Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="text-white text-sm block mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl bg-white/20 border border-white/20 px-4 py-3 text-white placeholder-gray-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-white text-sm block mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl bg-white/20 border border-white/20 px-4 py-3 text-white placeholder-gray-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-white text-sm block mb-2">
              Phone Number
            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-xl bg-white/20 border border-white/20 px-4 py-3 text-white placeholder-gray-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-white text-sm block mb-2">
              Shipping Address
            </label>

            <textarea
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl bg-white/20 border border-white/20 px-4 py-3 text-white placeholder-gray-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-white text-sm block mb-2">
              Billing Address
            </label>

            <textarea
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl bg-white/20 border border-white/20 px-4 py-3 text-white placeholder-gray-300 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-indigo-700 hover:bg-indigo-600 text-white py-3 font-semibold transition duration-300 shadow-lg"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>

        </form>
      </div>
    </div>
  )
}